# 地学数据三维可视化系统

## 🌍 项目介绍
这是一个基于Web的地学数据三维可视化系统，实现了DEM地形数据和SEGY地震数据的二维/三维可视化。

## 🚀 在线访问地址
系统已部署在GitHub Pages，点击链接即可访问：
https://[YHNB636].github.io/geology-3d-visualization/

或者直接访问系统介绍页：
https://[YHNB636].github.io/geology-3d-visualization/geology-3d-system.html

## 📋 主要功能
1. **DEM三维曲面** - 地形数据三维可视化
2. **SEGY二维剖面** - 地震数据剖面显示
3. **SEGY三维体** - 体数据三维可视化
4. **丰富的交互** - 旋转、缩放、平移、颜色映射、截图保存

## 🛠️ 技术栈
- 前端：HTML5、CSS3、JavaScript
- 可视化库：vtk.js（三维图形渲染）
- 数据格式：JSON、TIFF

## 👥 开发小组
- 乐杭
- 武超凡
- 谢世乐

## 📚 课程设计信息
**课程名称**：面向Web可视化系统设计与实现  
**指导老师**：[姚兴苗]  
**完成时间**：2025年1月  
**所属专业**：[遥感科学与技术]

## 🖥️ 运行要求
- 现代浏览器：Chrome、Edge、Firefox、Safari
- 支持WebGL的显卡
- 网络连接（需要加载约2MB的vtk.js库）

## 🔧 本地运行方法
```bash
# 1. 安装Node.js和http-server
npm install -g http-server

# 2. 在项目文件夹打开命令行，运行：
http-server -p 3000

# 3. 浏览器访问：
http://localhost:3000