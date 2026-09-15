#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Synchronisation Formadep -> JSON pour l'emploi du temps FI2A / FI2C.

Utilisation locale à partir d'un HTML enregistré :
    python formadep_sync.py --html "formadep.html" --week 38 --out edt_s38.json

Récupération directe depuis Formadep :
    python formadep_sync.py --week 38 --out edt_s38.json

Plusieurs semaines :
    python formadep_sync.py --weeks 38 39 40 41 --out edt.json

Dépendances :
    pip install requests beautifulsoup4
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

try:
    import requests
except ImportError:
    requests = None

from bs4 import BeautifulSoup


BASE_URL = "https://www.formadep360.fr"
PUBLIC_URL = BASE_URL + "/Extra/extra_edt?dep=32"
MAIN_URL = BASE_URL + "/multi/multi_edt?type=2&promo=60"
PRINT_URL = BASE_URL + "/multi/multi_edt_imp.aspx"
PROMO_ID = 60
TYPE_ID = 2

# Géométrie constatée dans le HTML Formadep.
# 105 px = 08:00 ; 104 px = 1 heure.
X_08H = 105
PX_PER_HOUR = 104

# 1 journée = 108 px verticalement, avec les 3 lignes A/B/C.
Y_FIRST_DAY = 83
PX_PER_DAY = 108


def _style_px(style: str, key: str) -> int | None:
    m = re.search(rf"{re.escape(key)}\s*:\s*(\d+)px", style, re.I)
    return int(m.group(1)) if m else None


def _round_quarter(minutes: float) -> int:
    return int(round(minutes / 15) * 15)


def _minutes_to_hhmm(total_minutes: int) -> str:
    total_minutes = max(0, total_minutes)
    h, m = divmod(total_minutes, 60)
    return f"{h:02d}:{m:02d}"


def _left_to_time(left: int) -> str:
    minutes_after_8 = _round_quarter((left - X_08H) * 60 / PX_PER_HOUR)
    return _minutes_to_hhmm(8 * 60 + minutes_after_8)


def _width_to_duration(width: int) -> int:
    # Les blocs incluent généralement 1 px de bordure.
    effective = max(0, width - 1)
    return max(15, _round_quarter(effective * 60 / PX_PER_HOUR))


def _add_minutes(hhmm: str, minutes: int) -> str:
    h, m = map(int, hhmm.split(":"))
    return _minutes_to_hhmm(h * 60 + m + minutes)


def _extract_days(soup: BeautifulSoup) -> list[dict[str, str]]:
    days: list[dict[str, str]] = []
    weekday_map = {
        "lun.": "Lundi",
        "mar.": "Mardi",
        "mer.": "Mercredi",
        "jeu.": "Jeudi",
        "ven.": "Vendredi",
    }

    for table in soup.find_all("table"):
        classes = [c.strip() for c in table.get("class", [])]
        if "LayerDay" not in classes:
            continue

        text = " ".join(table.stripped_strings)
        m = re.match(r"(lun\.|mar\.|mer\.|jeu\.|ven\.)\s+(\d{2}/\d{2})", text, re.I)
        if not m:
            continue

        short, date = m.groups()
        days.append({
            "name": weekday_map[short.lower()],
            "date": date
        })

    # Déduplication en conservant l'ordre.
    unique = []
    seen = set()
    for d in days:
        key = (d["name"], d["date"])
        if key not in seen:
            seen.add(key)
            unique.append(d)
    return unique[:5]


def _extract_week_buttons(soup: BeautifulSoup) -> dict[int, str]:
    weeks: dict[int, str] = {}
    for inp in soup.find_all("input", attrs={"type": "submit"}):
        name = inp.get("name", "")
        value = inp.get("value", "")
        title = inp.get("title", "")
        if name.startswith("rptsemaines$") and value.isdigit():
            weeks[int(value)] = title
    return weeks


def _parse_first_line(first_line: str) -> tuple[str, str, str | None, str]:
    """
    Retourne (group, subject, subgroup, room)
    group = A / C / shared
    """
    parts = re.split(r"\s+-\s+", first_line.strip(), maxsplit=1)
    left_part = parts[0].strip()
    room = parts[1].strip() if len(parts) > 1 else ""

    if left_part.startswith("Amphi-"):
        return "shared", left_part[len("Amphi-"):].strip(), None, room

    tokens = left_part.split("-")
    if not tokens:
        return "unknown", left_part, None, room

    group_token = tokens[0].strip()
    if group_token not in {"FI2A", "FI2C", "FI2B"}:
        return "unknown", left_part, None, room

    group = {"FI2A": "A", "FI2C": "C", "FI2B": "B"}[group_token]

    subgroup = None
    rest = tokens[1:]
    if rest and re.fullmatch(rf"{group_token}[12]", rest[0]):
        subgroup = rest[0]
        rest = rest[1:]

    subject = "-".join(rest).strip()
    return group, subject, subgroup, room


def parse_formadep_html(html: str, week: int | None = None) -> dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")

    days = _extract_days(soup)
    week_buttons = _extract_week_buttons(soup)

    # La page d'impression indique explicitement :
    # "Emploi du temps Semaine 38 - BUT Info FI2".
    # On s'en sert pour éviter d'enregistrer une semaine sous un mauvais numéro
    # si Formadep redirige ou refuse une semaine non publiée.
    actual_week = None
    title_node = soup.find(id="labeltitre")
    if title_node:
        m = re.search(r"Semaine\s+(\d{1,2})", title_node.get_text(" ", strip=True), re.I)
        if m:
            actual_week = int(m.group(1))

    if week is not None and actual_week is not None and week != actual_week:
        raise ValueError(
            f"Formadep a renvoyé la semaine {actual_week} au lieu de la semaine {week}."
        )

    if week is None:
        if actual_week is not None:
            week = actual_week
        else:
            # Sur la page principale, la semaine active a la classe btn-primary.
            active = soup.find("input", class_=lambda c: c and "btn-primary" in c.split())
            if active and str(active.get("value", "")).isdigit():
                week = int(active["value"])

    if week is None:
        raise ValueError("Impossible de déterminer le numéro de semaine.")

    events: list[dict[str, Any]] = []
    seen = set()

    for div in soup.find_all("div"):
        classes = [c.strip() for c in div.get("class", [])]
        if "dd" not in classes:
            continue

        style = div.get("style", "")
        left = _style_px(style, "left")
        top = _style_px(style, "top")
        width = _style_px(style, "width")
        height = _style_px(style, "height")
        if None in (left, top, width, height):
            continue

        strings = [s.strip() for s in div.stripped_strings if s.strip()]
        if not strings:
            continue

        first_line = strings[0]
        type_match = next((re.fullmatch(r"\[([^\]]+)\]", s) for s in reversed(strings)), None)
        session_type = type_match.group(1) if type_match else ""

        # Enseignant = texte entre la première ligne et [CM]/[TD]/[TP]/[Proj].
        teacher_parts = []
        for s in strings[1:]:
            if re.fullmatch(r"\[[^\]]+\]", s):
                break
            teacher_parts.append(s)
        teacher = " ".join(teacher_parts).replace("\xa0", " ").strip()

        group, subject, subgroup, room = _parse_first_line(first_line)

        # On ne garde que FI2A, FI2C et les cours communs.
        if group not in {"A", "C", "shared"}:
            continue

        # Jour à partir de la position verticale.
        day_index = int((top - Y_FIRST_DAY) // PX_PER_DAY)
        if not 0 <= day_index <= 4:
            continue

        start = _left_to_time(left)
        duration = _width_to_duration(width)
        end = _add_minutes(start, duration)

        color_match = re.search(r"background-color\s*:\s*([^;]+)", style, re.I)
        color = color_match.group(1).strip() if color_match else None

        event = {
            "day": day_index,
            "date": days[day_index]["date"] if day_index < len(days) else None,
            "group": group,
            "subgroup": subgroup,
            "subject": subject,
            "room": room,
            "teacher": teacher,
            "type": session_type,
            "start": start,
            "end": end,
            "color": color,
            "source_id": div.get("id"),
        }

        # Formadep duplique certains blocs HTML : on déduplique ici.
        dedup_key = (
            event["day"], event["group"], event["subgroup"], event["subject"],
            event["room"], event["teacher"], event["type"],
            event["start"], event["end"]
        )
        if dedup_key in seen:
            continue
        seen.add(dedup_key)
        events.append(event)

    events.sort(key=lambda e: (e["day"], e["start"], e["group"], e["subject"]))

    range_title = week_buttons.get(week, "")
    return {
        "week": week,
        "range_title": range_title,
        "days": days,
        "events": events,
        "source": {
            "provider": "Formadep360",
            "promo": PROMO_ID,
            "type": TYPE_ID,
            "url": f"{PRINT_URL}?type={TYPE_ID}&promo={PROMO_ID}&sem={week}&nb=0",
            "generated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        }
    }


def build_formadep_session(timeout: int = 20):
    """
    Reproduit le parcours du navigateur :
    1. page publique -> création ASP.NET_SessionId
    2. page FI2 promo=60
    3. pages d'impression par semaine
    """
    if requests is None:
        raise RuntimeError(
            "Le module requests n'est pas installé. Lance : pip install requests beautifulsoup4"
        )

    session = requests.Session()
    session.headers.update({
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/152.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
    })

    r1 = session.get(PUBLIC_URL, timeout=timeout)
    r1.raise_for_status()

    r2 = session.get(
        MAIN_URL,
        headers={"Referer": r1.url},
        timeout=timeout,
    )
    r2.raise_for_status()
    r2.encoding = r2.apparent_encoding or "utf-8"

    return session, r2.text, r2.url


def discover_available_weeks(timeout: int = 20) -> list[int]:
    """
    Lit directement les boutons de semaines publiées par Formadep.
    """
    session, main_html, _ = build_formadep_session(timeout=timeout)
    try:
        soup = BeautifulSoup(main_html, "html.parser")
        weeks = sorted(_extract_week_buttons(soup))
        if not weeks:
            raise RuntimeError("Aucune semaine publiée n'a été détectée sur Formadep.")
        return weeks
    finally:
        session.close()


def fetch_week_html(
    week: int,
    timeout: int = 20,
    session=None,
    referer: str | None = None,
) -> str:
    own_session = session is None

    if own_session:
        session, _, referer = build_formadep_session(timeout=timeout)

    try:
        params = {
            "type": TYPE_ID,
            "promo": PROMO_ID,
            "sem": week,
            "nb": 0,
        }

        response = session.get(
            PRINT_URL,
            params=params,
            headers={"Referer": referer or MAIN_URL},
            timeout=timeout,
        )
        response.raise_for_status()
        response.encoding = response.apparent_encoding or "utf-8"
        return response.text
    finally:
        if own_session:
            session.close()

def sync_weeks(
    weeks: list[int],
    html_file: Path | None = None,
    existing: dict[str, Any] | None = None
) -> dict[str, Any]:
    """
    Synchronise les semaines demandées.

    Les anciennes données sont conservées si Formadep est temporairement
    indisponible. Une seule session ASP.NET est réutilisée pour toutes
    les semaines du même passage.
    """
    previous_weeks = {}
    if isinstance(existing, dict):
        previous_weeks = dict(existing.get("weeks") or {})

    result = {
        "promo": PROMO_ID,
        "updated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "weeks": previous_weeks,
    }

    errors: dict[str, str] = {}
    session = None
    referer = None

    if html_file is None:
        session, _, referer = build_formadep_session()

    try:
        for week in weeks:
            try:
                if html_file is not None:
                    html = html_file.read_text(encoding="utf-8", errors="replace")
                else:
                    html = fetch_week_html(
                        week,
                        session=session,
                        referer=referer,
                    )

                parsed = parse_formadep_html(html, week=week)

                if parsed["days"] and parsed["events"]:
                    result["weeks"][str(week)] = parsed
                else:
                    errors[str(week)] = "Semaine vide ou non exploitable."

            except Exception as exc:
                errors[str(week)] = str(exc)
    finally:
        if session is not None:
            session.close()

    if errors:
        result["sync_errors"] = errors

    return result

def default_auto_weeks() -> list[int]:
    """
    Fenêtre raisonnable autour de la semaine ISO actuelle.
    Permet de détecter une nouvelle semaine publiée sans connaître sa date à l'avance.
    """
    current = datetime.now().isocalendar().week
    candidates = []
    for delta in range(-4, 13):
        n = current + delta
        if 1 <= n <= 53:
            candidates.append(n)
    return candidates


def main() -> None:
    parser = argparse.ArgumentParser(description="Synchronisation EDT Formadep FI2A/FI2C")
    parser.add_argument("--html", type=Path, help="HTML Formadep local à analyser")
    parser.add_argument("--week", type=int, help="Une seule semaine")
    parser.add_argument("--weeks", type=int, nargs="+", help="Plusieurs semaines")
    parser.add_argument(
        "--auto",
        action="store_true",
        help="Détecte automatiquement les semaines publiées sur Formadep"
    )
    parser.add_argument("--out", type=Path, default=Path("edt.json"), help="Fichier JSON de sortie")
    args = parser.parse_args()

    existing = None
    if args.out.exists():
        try:
            existing = json.loads(args.out.read_text(encoding="utf-8"))
        except Exception:
            existing = None

    if args.week is not None:
        weeks = [args.week]
    elif args.weeks:
        weeks = args.weeks
    elif args.auto:
        weeks = discover_available_weeks()

        # Le JSON initial commence actuellement à S38. On ne rajoute donc pas
        # d'anciennes semaines (S36/S37) si elles apparaissent encore dans Formadep.
        existing_numbers = []
        if isinstance(existing, dict):
            for key in (existing.get("weeks") or {}):
                try:
                    existing_numbers.append(int(key))
                except (TypeError, ValueError):
                    pass

        floor = min(existing_numbers) if existing_numbers else datetime.now().isocalendar().week
        weeks = [w for w in weeks if w >= floor]
    else:
        raise SystemExit("Indique --week, --weeks ou --auto.")

    if args.html is not None and len(weeks) > 1:
        raise SystemExit("--html sert à tester un seul HTML. Utilise une seule semaine avec --week.")

    print("Semaines Formadep à synchroniser :", ", ".join(f"S{w}" for w in weeks))

    data = sync_weeks(weeks, html_file=args.html, existing=existing)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    total_events = sum(len(w["events"]) for w in data["weeks"].values())
    print(f"OK : {len(data['weeks'])} semaine(s), {total_events} événement(s)")
    if data.get("sync_errors"):
        print("Avertissements :", json.dumps(data["sync_errors"], ensure_ascii=False))
    print(f"Sortie : {args.out.resolve()}")


if __name__ == "__main__":
    main()
