// main-simple.js - 简化版主程序
console.log("开始初始化地学可视化系统...");

// 声明全局变量
let renderer = null;
let renderWindow = null;
let camera = null;

// 等待页面加载完成
window.addEventListener('load', function() {
    console.log("页面加载完成，检查vtk.js...");
    
    // 检查vtk.js是否加载成功
    if (typeof vtk === 'undefined') {
        document.getElementById('loadMessage').innerHTML = 
            '错误：vtk.js库加载失败！<br>请检查网络连接或刷新页面。';
        console.error('vtk.js未加载');
        return;
    }
    
    console.log('vtk.js加载成功，开始初始化三维场景...');
    
    try {
        // 创建渲染窗口
        const renderContainer = document.getElementById('renderWindow');
        const fullScreenRenderWindow = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance({
            rootContainer: renderContainer,
            background: [0.1, 0.1, 0.1]
        });
        
        // 赋值给全局变量
        renderer = fullScreenRenderWindow.getRenderer();
        renderWindow = fullScreenRenderWindow.getRenderWindow();
        camera = renderer.getActiveCamera();
        
        // 设置相机
        camera.setPosition(0, 0, 10);
        camera.setFocalPoint(0, 0, 0);
        camera.setViewUp(0, 1, 0);
        
        // 添加坐标系
        const axes = vtk.Rendering.Core.vtkAxesActor.newInstance();
        renderer.addActor(axes);
        
        // 添加光源
        const light = vtk.Rendering.Core.vtkLight.newInstance();
        light.setPosition(10, 10, 10);
        renderer.addLight(light);
        
        // 初始渲染
        renderWindow.render();
        
        // 隐藏加载提示
        document.getElementById('loadingOverlay').style.display = 'none';
        
        // 更新状态
        updateStatus('三维场景初始化成功！');
        updateDataInfo({
            currentModule: '三维框架',
            dataSource: 'vtk.js框架',
            renderStatus: '就绪'
        });
        
        // 绑定按钮事件
        bindButtonEvents();
        
        console.log('系统初始化完成！');
        
    } catch (error) {
        console.error('初始化失败:', error);
        document.getElementById('loadMessage').innerHTML = 
            '初始化失败：' + error.message + '<br>请刷新页面重试。';
    }
});

// 工具函数
function updateStatus(message) {
    console.log('状态更新:', message);
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

function updateDataInfo(info) {
    if (info.currentModule) {
        const currentModuleElement = document.getElementById('currentModule');
        if (currentModuleElement) currentModuleElement.textContent = info.currentModule;
    }
    if (info.dataSource) {
        const dataSourceElement = document.getElementById('dataSource');
        if (dataSourceElement) dataSourceElement.textContent = info.dataSource;
    }
    if (info.dataSize) {
        const dataSizeElement = document.getElementById('dataSize');
        if (dataSizeElement) dataSizeElement.textContent = info.dataSize;
    }
    if (info.renderStatus) {
        const renderStatusElement = document.getElementById('renderStatus');
        if (renderStatusElement) renderStatusElement.textContent = info.renderStatus;
    }
}

// 控制函数
function resetView() {
    if (camera && renderWindow) {
        camera.setPosition(0, 0, 10);
        camera.setFocalPoint(0, 0, 0);
        renderWindow.render();
        updateStatus('视图已重置');
    }
}

function toggleAxes() {
    if (renderer) {
        const actors = renderer.getActors();
        let axes = null;
        actors.forEach(actor => {
            if (actor.isA && actor.isA('vtkAxesActor')) {
                axes = actor;
            }
        });
        if (axes && renderWindow) {
            axes.setVisibility(!axes.getVisibility());
            renderWindow.render();
            updateStatus('坐标轴 ' + (axes.getVisibility() ? '显示' : '隐藏'));
        }
    }
}

function toggleGrid() {
    updateStatus('网格功能开发中...');
}

function screenshot() {
    try {
        const canvas = document.querySelector('#renderWindow canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = '三维可视化截图.png';
            link.href = canvas.toDataURL();
            link.click();
            updateStatus('截图已保存');
        } else {
            updateStatus('截图失败：未找到画布');
        }
    } catch (error) {
        console.error('截图失败:', error);
        updateStatus('截图失败');
    }
}

function changeColorMap() {
    const colorMapSelect = document.getElementById('colorMap');
    if (colorMapSelect) {
        const map = colorMapSelect.value;
        updateStatus('颜色映射切换为: ' + map);
    }
}

// 绑定按钮事件
function bindButtonEvents() {
    // 绑定DEM按钮
    const demBtn = document.getElementById('dem-btn');
    if (demBtn) {
        demBtn.addEventListener('click', function() {
            if (typeof window.loadDEMVisualization === 'function') {
                window.loadDEMVisualization();
            } else {
                console.error('loadDEMVisualization函数未定义');
                updateStatus('DEM模块加载失败');
            }
        });
    }
    
    // 绑定SEGY二维按钮
    const segy2dBtn = document.getElementById('segy2d-btn');
    if (segy2dBtn) {
        segy2dBtn.addEventListener('click', function() {
            if (typeof window.loadSEGY2DVisualization === 'function') {
                window.loadSEGY2DVisualization();
            } else {
                console.error('loadSEGY2DVisualization函数未定义');
                updateStatus('SEGY二维模块加载失败');
            }
        });
    }
    
    // 绑定SEGY三维按钮
    const segy3dBtn = document.getElementById('segy3d-btn');
    if (segy3dBtn) {
        segy3dBtn.addEventListener('click', function() {
            if (typeof window.loadSEGY3DVisualization === 'function') {
                window.loadSEGY3DVisualization();
            } else {
                console.error('loadSEGY3DVisualization函数未定义');
                updateStatus('SEGY三维模块加载失败');
            }
        });
    }
    
    // 绑定其他控制按钮
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetView);
    }
    
    const axesBtn = document.getElementById('axes-btn');
    if (axesBtn) {
        axesBtn.addEventListener('click', toggleAxes);
    }
    
    const gridBtn = document.getElementById('grid-btn');
    if (gridBtn) {
        gridBtn.addEventListener('click', toggleGrid);
    }
    
    const screenshotBtn = document.getElementById('screenshot-btn');
    if (screenshotBtn) {
        screenshotBtn.addEventListener('click', screenshot);
    }
    
    const colorMapSelect = document.getElementById('colorMap');
    if (colorMapSelect) {
        colorMapSelect.addEventListener('change', changeColorMap);
    }
}

// 模块加载函数（供外部调用）
function loadDEM() {
    updateStatus('正在加载DEM数据...');
    if (typeof window.loadDEMVisualization === 'function') {
        window.loadDEMVisualization();
    } else {
        console.error('loadDEMVisualization函数未定义');
        updateStatus('DEM模块未加载');
    }
}

function loadSEGY2D() {
    updateStatus('正在加载SEGY二维数据...');
    if (typeof window.loadSEGY2DVisualization === 'function') {
        window.loadSEGY2DVisualization();
    } else {
        console.error('loadSEGY2DVisualization函数未定义');
        updateStatus('SEGY二维模块未加载');
    }
}

function loadSEGY3D() {
    updateStatus('正在加载SEGY三维数据...');
    if (typeof window.loadSEGY3DVisualization === 'function') {
        window.loadSEGY3DVisualization();
    } else {
        console.error('loadSEGY3DVisualization函数未定义');
        updateStatus('SEGY三维模块未加载');
    }
}

// 全局导出
window.resetView = resetView;
window.toggleAxes = toggleAxes;
window.toggleGrid = toggleGrid;
window.screenshot = screenshot;
window.loadDEM = loadDEM;
window.loadSEGY2D = loadSEGY2D;
window.loadSEGY3D = loadSEGY3D;
window.updateStatus = updateStatus;
window.updateDataInfo = updateDataInfo;
window.mainRenderer = () => renderer;
window.mainRenderWindow = () => renderWindow;
window.mainCamera = () => camera;

console.log("主程序加载完成");