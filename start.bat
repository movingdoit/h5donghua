@echo off
echo ================================
echo 清风伴节气 廉韵润心田
echo H5动画项目启动脚本
echo ================================
echo.

echo 正在检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未检测到Node.js环境，请先安装Node.js
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js环境检查通过
echo.

echo 正在安装项目依赖...
call npm install

if errorlevel 1 (
    echo 错误：依赖安装失败
    pause
    exit /b 1
)

echo.
echo 依赖安装完成，正在启动开发服务器...
echo 项目将在浏览器中自动打开
echo 如需停止服务器，请按 Ctrl+C
echo.

call npm run dev

pause