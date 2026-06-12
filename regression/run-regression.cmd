@echo off
rem Website regression ritual - run after ANY change to this repo.
rem 1) next build  = the type/compile net (catches most silent breakage)
rem 2) smoke.mjs   = pages render + API guard contract (403/401/400/429), zero AI cost
rem Optional: run-regression.cmd https://erken.systems   (post-deploy check, skips build)
setlocal
cd /d "%~dp0.."
if not "%~1"=="" (
  node regression\smoke.mjs %1
  exit /b %errorlevel%
)
echo [1/2] next build...
call npm run build
if errorlevel 1 (
  echo BUILD FAILED - fix before anything else.
  exit /b 1
)
echo [2/2] API + page smoke against localhost...
node regression\smoke.mjs
exit /b %errorlevel%