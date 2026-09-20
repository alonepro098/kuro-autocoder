@echo off
title Kuro AI Physical Auto-Coder Bot
py "%~dp0kuro_bot.py"
if %errorlevel% neq 0 (
    python "%~dp0kuro_bot.py"
)
pause
