@echo off
set PATH=C:\Program Files\nodejs;%PATH%
call "C:\Program Files\nodejs\node.exe" ".\node_modules\@angular\cli\bin\ng.js" build > build.log 2>&1
