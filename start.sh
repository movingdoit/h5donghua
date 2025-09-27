#!/bin/bash

echo "================================"
echo "清风伴节气 廉韵润心田"
echo "H5动画项目启动脚本"
echo "================================"
echo

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "错误：未检测到Node.js环境，请先安装Node.js"
    echo "下载地址：https://nodejs.org/"
    exit 1
fi

echo "Node.js环境检查通过"
echo "Node.js版本：$(node --version)"
echo

# 安装依赖
echo "正在安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "错误：依赖安装失败"
    exit 1
fi

echo
echo "依赖安装完成，正在启动开发服务器..."
echo "项目将在浏览器中自动打开"
echo "如需停止服务器，请按 Ctrl+C"
echo

# 启动开发服务器
npm run dev