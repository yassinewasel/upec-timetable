# Deployment

## Prerequisites

- Apache or compatible static hosting
- PHP with `exec()` enabled for the HTTP cron endpoint
- Python 3.10+
- A virtual environment at `.venv/`
- Dependencies from `sync/requirements.txt`

## Installation

```bash
python3 -m venv .venv
.venv/bin/pip install -r sync/requirements.txt
```

Create the cron secret outside Git:

```bash
printf '%s\n' 'replace-with-a-long-random-secret' > sync/cron_secret.txt
chmod 600 sync/cron_secret.txt
```

Generate timetable data:

```bash
.venv/bin/python sync/formadep_sync.py --auto --out public_html/data/edt.json
.venv/bin/python sync/formadep_sync_fa2.py --auto --out public_html/data/fa2.json
```

Serve `public_html/` as the web root.

## Production update

Before replacing a working deployment, create a backup and deploy to a staging
folder first. Validate FI2/FA2, week/day views, responsive layouts, theme
switching, the formation dropdown and PNG export before switching the web root.
