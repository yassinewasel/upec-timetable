@echo off
cd /d "%~dp0\.."
py -3 sync\formadep_sync.py --auto --out public_html\data\edt.json
pause
