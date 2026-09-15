@echo off
cd /d "%~dp0\.."
py -3 sync\formadep_sync.py --auto --out public_html\data\edt.json
py -3 sync\formadep_sync_fa2.py --auto --out public_html\data\fa2.json
pause
