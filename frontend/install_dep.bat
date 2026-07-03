@echo off
set PATH=C:\Program Files\nodejs;%PATH%
call "C:\Program Files\nodejs\npm.cmd" install --ignore-scripts > install.log 2>&1
