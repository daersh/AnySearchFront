@echo off
setlocal

REM 현재 스크립트 디렉토리로 이동
cd /d %~dp0

REM Nuxt generate 실행
npm run generate

endlocal