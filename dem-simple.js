// dem-simple.js - 简化版DEM可视化
console.log("DEM模块加载完成");

// 存储全局变量
let demActor = null;

// 添加缺失的loadDEM函数
function loadDEM() {
    console.log('loadDEM函数被调用');
    loadDEMVisualization();
}

// DEM可视化函数
async function loadDEMVisualization() {
    try {
        console.log('开始加载DEM可视化');
        
        updateStatus('正在加载DEM数据...');
        
        // 获取渲染器
        const renderer = window.mainRenderer ? window.mainRenderer() : null;
        const renderWindow = window.mainRenderWindow ? window.mainRenderWindow() : null;
        
        if (!renderer || !renderWindow) {
            throw new Error('渲染器未初始化，请等待系统加载完成');
        }
        
        // 移除之前的DEM
        if (demActor && renderer) {
            renderer.removeActor(demActor);
            demActor = null;
        }
        
        // 尝试加载真实DEM数据
        try {
            await loadRealDEMData();
        } catch (error) {
            console.warn('加载真实DEM数据失败，使用示例数据:', error);
            updateStatus('使用示例DEM数据');
            createSampleDEM();
        }
        
    } catch (error) {
        console.error('加载DEM失败:', error);
        updateStatus('DEM加载失败: ' + error.message);
        
        // 尝试创建简单的DEM
        try {
            createSimpleDEM();
        } catch (e) {
            console.error('创建简单DEM也失败:', e);
        }
    }
}

// 加载真实DEM数据
async function loadRealDEMData() {
    updateStatus('正在从 data/new_dem.tif 加载DEM数据...');
    
    try {
        // 这里简化处理，直接创建示例DEM
        // 在实际项目中，你需要使用geotiff.js等库解析TIFF文件
        console.log('模拟加载DEM文件...');
        
        // 创建示例DEM数据
        const width = 200;
        const height = 150;
        const elevationData = new Array(width * height);
        
        // 生成地形数据
        for (let i = 0; i < width * height; i++) {
            const x = i % width;
            const y = Math.floor(i / width);
            
            // 创建地形特征
            let heightValue = 0;
            
            // 添加山丘
            const dx = x - width/2;
            const dy = y - height/2;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            // 中心山峰
            heightValue += Math.exp(-distance/20) * 80;
            
            // 添加正弦波地形
            heightValue += Math.sin(x * 0.05) * Math.cos(y * 0.05) * 30;
            
            // 添加一些随机噪声
            heightValue += (Math.random() - 0.5) * 10;
            
            // 确保最小值
            heightValue = Math.max(0, heightValue);
            
            elevationData[i] = heightValue;
        }
        
        // 创建DEM表面
        createDEMSurface(elevationData, width, height);
        
        updateDataInfo({
            currentModule: 'DEM三维曲面',
            dataSource: 'new_dem.tif (模拟渲染)',
            dataSize: `${width}×${height}`,
            renderStatus: '已加载'
        });
        
        updateStatus('DEM数据加载完成');
        
    } catch (error) {
        console.error('加载DEM数据失败:', error);
        throw error;
    }
}

function createSampleDEM() {
    const renderer = window.mainRenderer ? window.mainRenderer() : null;
    const renderWindow = window.mainRenderWindow ? window.mainRenderWindow() : null;
    const camera = window.mainCamera ? window.mainCamera() : null;
    
    if (!renderer || !renderWindow) return;
    
    // 创建示例数据
    const size = 50;
    const elevationData = new Array(size * size);
    
    for (let i = 0; i < size * size; i++) {
        const x = i % size;
        const y = Math.floor(i / size);
        
        // 创建起伏地形
        const dx = x - size/2;
        const dy = y - size/2;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        // 中心山峰
        let heightValue = Math.exp(-distance/15) * 100;
        
        // 添加一些小山丘
        heightValue += Math.sin(x * 0.2) * Math.cos(y * 0.15) * 20;
        
        // 添加噪声
        heightValue += (Math.random() - 0.5) * 5;
        
        elevationData[i] = Math.max(0, heightValue);
    }
    
    createDEMSurface(elevationData, size, size);
    
    updateDataInfo({
        currentModule: 'DEM三维曲面',
        dataSource: '示例地形数据',
        dataSize: `${size}×${size}`,
        renderStatus: '示例数据已加载'
    });
}

function createSimpleDEM() {
    const renderer = window.mainRenderer ? window.mainRenderer() : null;
    const renderWindow = window.mainRenderWindow ? window.mainRenderWindow() : null;
    const camera = window.mainCamera ? window.mainCamera() : null;
    
    if (!renderer || !renderWindow) return;
    
    try {
        // 创建一个简单的平面
        const planeSource = vtk.Filters.Sources.vtkPlaneSource.newInstance();
        planeSource.setOrigin(-5, -5, 0);
        planeSource.setPoint1(5, -5, 0);
        planeSource.setPoint2(-5, 5, 0);
        planeSource.setXResolution(10);
        planeSource.setYResolution(10);
        
        const actor = vtk.Rendering.Core.vtkActor.newInstance();
        const mapper = vtk.Rendering.Core.vtkMapper.newInstance();
        mapper.setInputConnection(planeSource.getOutputPort());
        actor.setMapper(mapper);
        
        // 设置颜色为地形颜色
        actor.getProperty().setColor(0.4, 0.8, 0.4);
        actor.getProperty().setEdgeVisibility(true);
        actor.getProperty().setEdgeColor(0.2, 0.2, 0.2);
        
        // 添加到场景
        renderer.addActor(actor);
        demActor = actor;
        
        // 调整视图
        if (camera) {
            camera.setPosition(0, 0, 15);
            camera.setFocalPoint(0, 0, 0);
        }
        
        renderWindow.render();
        
        updateStatus('简单DEM创建成功');
        updateDataInfo({
            currentModule: 'DEM三维曲面',
            dataSource: '简单平面',
            dataSize: '10×10网格',
            renderStatus: '已加载'
        });
        
    } catch (error) {
        console.error('创建简单DEM失败:', error);
    }
}

function createDEMSurface(elevationData, width, height) {
    const renderer = window.mainRenderer ? window.mainRenderer() : null;
    const renderWindow = window.mainRenderWindow ? window.mainRenderWindow() : null;
    const camera = window.mainCamera ? window.mainCamera() : null;
    
    if (!renderer || !renderWindow) return;
    
    // 移除之前的DEM
    if (demActor) {
        renderer.removeActor(demActor);
    }
    
    try {
        // 创建网格
        const points = vtk.Common.Core.vtkPoints.newInstance();
        const cells = vtk.Common.Core.vtkCellArray.newInstance();
        
        // 降采样以提高性能
        const step = Math.max(1, Math.floor(width / 80));
        
        // 添加顶点
        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const idx = Math.floor(y) * width + Math.floor(x);
                const z = elevationData[idx] || 0;
                
                points.insertNextPoint(
                    (x - width/2) * 0.1,
                    (y - height/2) * 0.1,
                    z * 0.01
                );
            }
        }
        
        // 创建网格
        const gridWidth = Math.ceil(width / step);
        const gridHeight = Math.ceil(height / step);
        
        for (let y = 0; y < gridHeight - 1; y++) {
            for (let x = 0; x < gridWidth - 1; x++) {
                const p1 = y * gridWidth + x;
                const p2 = y * gridWidth + (x + 1);
                const p3 = (y + 1) * gridWidth + x;
                const p4 = (y + 1) * gridWidth + (x + 1);
                
                cells.insertNextCell([p1, p2, p3]);
                cells.insertNextCell([p2, p4, p3]);
            }
        }
        
        // 创建PolyData
        const polydata = vtk.Common.DataModel.vtkPolyData.newInstance();
        polydata.setPoints(points);
        polydata.setPolys(cells);
        
        // 创建Mapper和Actor
        const mapper = vtk.Rendering.Core.vtkMapper.newInstance();
        mapper.setInputData(polydata);
        
        const actor = vtk.Rendering.Core.vtkActor.newInstance();
        actor.setMapper(mapper);
        
        // 设置颜色映射
        mapper.setScalarVisibility(true);
        const lut = vtk.Rendering.Core.vtkColorTransferFunction.newInstance();
        
        // 根据高程设置颜色
        const minElevation = Math.min(...elevationData);
        const maxElevation = Math.max(...elevationData);
        
        lut.addRGBPoint(minElevation, 0.1, 0.3, 0.1);
        lut.addRGBPoint(minElevation + (maxElevation - minElevation) * 0.3, 0.3, 0.6, 0.3);
        lut.addRGBPoint(minElevation + (maxElevation - minElevation) * 0.6, 0.8, 0.7, 0.4);
        lut.addRGBPoint(maxElevation, 0.9, 0.9, 0.8);
        
        mapper.setLookupTable(lut);
        
        actor.getProperty().setEdgeVisibility(true);
        actor.getProperty().setEdgeColor(0.2, 0.2, 0.2);
        actor.getProperty().setOpacity(0.9);
        
        // 添加到场景
        renderer.addActor(actor);
        demActor = actor;
        
        // 调整视图
        if (camera) {
            camera.setPosition(-width*0.05, -height*0.05, width*0.3);
            camera.setFocalPoint(0, 0, 0);
            camera.setViewUp(0, 0, 1);
        }
        
        renderWindow.render();
        
    } catch (error) {
        console.error('创建DEM表面失败:', error);
        updateStatus('创建DEM表面失败: ' + error.message);
    }
}

// 全局导出
window.loadDEM = loadDEM;
window.loadDEMVisualization = loadDEMVisualization;