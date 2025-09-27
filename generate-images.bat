@echo off
echo ================================
echo 生成占位符背景图片
echo ================================
echo.

cd /d "%~dp0"

if not exist "scripts" (
    mkdir scripts
)

if not exist "public\images\backgrounds" (
    mkdir "public\images\backgrounds"
)

echo 正在生成占位符图片...
node scripts/generate-placeholder-images.js

echo.
echo ================================
echo 完成！请查看 public/images/backgrounds 目录
echo ================================
pause