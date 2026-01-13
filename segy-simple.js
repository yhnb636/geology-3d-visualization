// segy-simple.js - 简化版SEGY可视化
console.log("SEGY模块加载完成");

let segyActor = null;
let segyVolume = null;

// 添加缺失的SEGY函数
function loadSEGY2D() {
    console.log('loadSEGY2D函数被调用');
    loadSEGY2DVisualization();
}

function loadSEGY3D() {
    console.log('loadSEGY3D函数被调用');
    loadSEGY3DVisualization();
}

// SEGY二维剖面
async function loadSEGY2DVisualization() {
    try {
        console.log('开始加载SEGY二维可视化');
        
        updateStatus('正在加载SEGY二维数据...');
        
        const renderer = window.mainRenderer ? window.mainRenderer() : null;
        const renderWindow = window.mainRenderWindow ? window.mainRenderWindow() : null;
        
        if (!renderer || !renderWindow) {
            throw new Error('渲染器未初始化，请等待系统加载完成');
        }
        
        // 清理之前的可视化
        if (segyActor) {
            renderer.removeActor(segyActor);
            segyActor = null;
        }
        if (segyVolume) {
            renderer.removeVolume(segyVolume);
            segyVolume = null;
        }
        
        // 尝试加载真实数据
        try {
            await loadRealSEGYData(true);
        } catch (error) {
            console.warn('加载真实SEGY数据失败，使用示例数据:', error);
            updateStatus('使用示例SEGY数据');
            createSampleSEGY2D();
        }
        
    } catch (error) {
        console.error('加载SEGY二维失败:', error);
        updateStatus('SEGY二维加载失败: ' + error.message);
    }
}

// SEGY三维体
async function loadSEGY3DVisualization() {
    try {
        console.log('开始加载SEGY三维体可视化');
        
        updateStatus('正在加载SEGY三维数据...');
        
        const renderer = window.mainRenderer ? window.mainRenderer() : null;
        const renderWindow = window.mainRenderWindow ? window.mainRenderWindow() : null;
        
        if (!renderer || !renderWindow) {
            throw new Error('渲染器未初始化，请等待系统加载完成');
        }
        
        // 清理之前的可视化
        if (segyActor) {
            renderer.removeActor(segyActor);
            segyActor = null;
        }
        if (segyVolume) {
            renderer.removeVolume(segyVolume);
            segyVolume = null;
        }
        
        // 尝试加载真实数据
        try {
            await loadRealSEGYData(false);
        } catch (error) {
            console.warn('加载真实SEGY三维数据失败，使用示例数据:', error);
            updateStatus('使用示例SEGY三维数据');
            createSampleSEGY3D();
        }
        
    } catch (error) {
        console.error('加载SEGY三维体失败:', error);
        updateStatus('SEGY三维体加载失败: ' + error.message);
    }
}

// 加载真实SEGY数据
async function loadRealSEGYData(is2D) {
    updateStatus('正在从 data/f3_sm_real.json 加载SEGY' + (is2D ? '二维' : '三维') + '数据...');
    
    try {
        const response = await fetch('data/f3_sm_real.json');
        if (!response.ok) {
            throw new Error('无法加载SEGY文件: ' + response.status + ' ' + response.statusText);
        }
        
        const segyData = await response.json();
        console.log('SEGY数据加载成功，数据格式:', Object.keys(segyData));
        
        if (is2D) {
            createSEGY2DProfile(segyData);
            
            updateDataInfo({
                currentModule: 'SEGY二维剖面',
                dataSource: 'f3_sm_real.json',
                dataSize: (segyData.n_traces || '未知') + '道×' + (segyData.n_samples || '未知') + '采样点',
                renderStatus: '已加载'
            });
        } else {
            createSEGY3DVolume(segyData);
            
            updateDataInfo({
                currentModule: 'SEGY三维体',
                dataSource: 'f3_sm_real.json',
                dataSize: (segyData.n_traces || '未知') + '道×' + (segyData.n_samples || '未知') + '采样点',
                renderStatus: '已加载'
            });
        }
        
        updateStatus('SEGY' + (is2D ? '二维' : '三维') + '数据加载完成');
        
    } catch (error) {
        console.error('加载SEGY数据失败:', error);
        throw error;
    }
}

function createSampleSEGY2D() {
    const renderer = window.mainRenderer ? window.mainRenderer() : null;
    const renderWindow = window.mainRenderWindow ? window.mainRenderWindow() : null;
    const camera = window.mainCamera ? window.mainCamera() : null;
    
    if (!renderer || !renderWindow) return;
    
    try {
        // 创建示例SEGY数据
        const n_traces = 100;
        const n_samples = 200;
        const traces = [];
        
        for (let i = 0; i < n_traces; i++) {
            const trace = new Array(n_samples);
            for (let j = 0; j < n_samples; j++) {
                const t = j / n_samples;
                const position = i / n_traces;
                const value = Math.sin(j * 0.1) * Math.exp(-j * 0.02) * 
                             Math.cos(i * 0.05) * 5000;
                trace[j] = value;
            }
            traces.push(trace);
        }
        
        const segyData = {
            n_traces: n_traces,
            n_samples: n_samples,
            sample_interval: 4,
            traces: traces
        };
        
        createSEGY2DProfile(segyData);
        
        updateDataInfo({
            currentModule: 'SEGY二维剖面',
            dataSource: '示例地震数据',
            dataSize: n_traces + '×' + n_samples,
            renderStatus: '示例数据已加载'
        });
        
    } catch (error) {
        console.error('创建示例SEGY二维失败:', error);
        updateStatus('创建示例SEGY二维失败: ' + error.message);
    }
}

function createSampleSEGY3D() {
    const renderer = window.mainRenderer ? window.mainRenderer() : null;
    const renderWindow = window.mainRenderWindow ? window.mainRenderWindow() : null;
    const camera = window.mainCamera ? window.mainCamera() : null;
    
    if (!renderer || !renderWindow) return;
    
    try {
        // 创建一个简单的三维立方体作为示例
        const cubeSource = vtk.Filters.Sources.vtkCubeSource.newInstance();
        cubeSource.setCenter([0, 0, 0]);
        cubeSource.setXLength(8);
        cubeSource.setYLength(6);
        cubeSource.setZLength(10);
        
        const actor = vtk.Rendering.Core.vtkActor.newInstance();
        const mapper = vtk.Rendering.Core.vtkMapper.newInstance();
        mapper.setInputConnection(cubeSource.getOutputPort());
        actor.setMapper(mapper);
        
        // 设置地震数据样式
        actor.getProperty().setColor(0.3, 0.7, 0.9);
        actor.getProperty().setOpacity(0.6);
        
        renderer.addActor(actor);
        segyVolume = actor;
        
        // 调整视图
        if (camera) {
            camera.setPosition(15, 10, 20);
            camera.setFocalPoint(0, 0, 0);
        }
        
        renderWindow.render();
        
        updateDataInfo({
            currentModule: 'SEGY三维体',
            dataSource: '示例体数据',
            dataSize: '8×6×10',
            renderStatus: '示例数据已加载'
        });
        
    } catch (error) {
        console.error('创建示例SEGY三维体失败:', error);
        updateStatus('创建示例SEGY三维体失败: ' + error.message);
    }
}

function createSEGY2DProfile(segyData) {
    const renderer = window.mainRenderer ? window.mainRenderer() : null;
    const renderWindow = window.mainRenderWindow ? window.mainRenderWindow() : null;
    const camera = window.mainCamera ? window.mainCamera() : null;
    
    if (!renderer || !renderWindow) return;
    
    try {
        const traces = segyData.traces || [];
        const n_traces = traces.length || segyData.n_traces || 100;
        const n_samples = segyData.n_samples || (traces[0] ? traces[0].length : 200);
        
        console.log('创建SEGY二维剖面: ' + n_traces + '道, ' + n_samples + '采样点');
        
        // 创建网格表示地震剖面
        const points = vtk.Common.Core.vtkPoints.newInstance();
        const cells = vtk.Common.Core.vtkCellArray.newInstance();
        
        // 降采样以提高性能
        const xStep = Math.max(1, Math.floor(n_traces / 80));
        const yStep = Math.max(1, Math.floor(n_samples / 80));
        
        // 添加顶点
        for (let y = 0; y < n_samples; y += yStep) {
            for (let x = 0; x < n_traces; x += xStep) {
                let amplitude = 0;
                if (traces[x] && traces[x][y] !== undefined) {
                    amplitude = traces[x][y];
                } else {
                    amplitude = Math.sin(x * 0.05) * Math.exp(-y * 0.01) * 1000;
                }
                
                points.insertNextPoint(
                    (x - n_traces/2) * 0.05,
                    (y - n_samples/2) * 0.02,
                    amplitude * 0.0001
                );
            }
        }
        
        // 创建网格
        const gridWidth = Math.ceil(n_traces / xStep);
        const gridHeight = Math.ceil(n_samples / yStep);
        
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
        
        lut.addRGBPoint(-5000, 0, 0, 1);
        lut.addRGBPoint(0, 1, 1, 1);
        lut.addRGBPoint(5000, 1, 0, 0);
        
        mapper.setLookupTable(lut);
        actor.getProperty().setOpacity(0.9);
        
        // 添加到场景
        renderer.addActor(actor);
        segyActor = actor;
        
        // 调整视图
        if (camera) {
            camera.setPosition(-n_traces * 0.05, -n_samples * 0.02, n_traces * 0.15);
            camera.setFocalPoint(0, 0, 0);
        }
        
        renderWindow.render();
        
    } catch (error) {
        console.error('创建SEGY二维剖面失败:', error);
        updateStatus('创建SEGY二维剖面失败: ' + error.message);
    }
}

function createSEGY3DVolume(segyData) {
    const renderer = window.mainRenderer ? window.mainRenderer() : null;
    const renderWindow = window.mainRenderWindow ? window.mainRenderWindow() : null;
    const camera = window.mainCamera ? window.mainCamera() : null;
    
    if (!renderer || !renderWindow) return;
    
    try {
        const traces = segyData.traces || [];
        const n_traces = Math.min(traces.length || segyData.n_traces || 50, 50);
        const n_samples = Math.min(segyData.n_samples || (traces[0] ? traces[0].length : 64), 64);
        
        console.log('创建SEGY三维体: ' + n_traces + '×10×' + n_samples);
        
        // 创建简单的3D网格
        const points = vtk.Common.Core.vtkPoints.newInstance();
        const cells = vtk.Common.Core.vtkCellArray.newInstance();
        
        const depth = 10;
        
        // 添加顶点
        for (let z = 0; z < depth; z++) {
            for (let y = 0; y < n_samples; y += 2) {
                for (let x = 0; x < n_traces; x += 2) {
                    let amplitude = 0;
                    if (traces[x] && traces[x][y] !== undefined) {
                        amplitude = traces[x][y];
                    }
                    
                    points.insertNextPoint(
                        (x - n_traces/2) * 0.1,
                        (y - n_samples/2) * 0.05,
                        (z - depth/2) * 0.5 + amplitude * 0.00005
                    );
                }
            }
        }
        
        // 创建网格
        const gridWidth = Math.ceil(n_traces / 2);
        const gridHeight = Math.ceil(n_samples / 2);
        
        for (let z = 0; z < depth - 1; z++) {
            for (let y = 0; y < gridHeight - 1; y++) {
                for (let x = 0; x < gridWidth - 1; x++) {
                    const base = z * gridWidth * gridHeight;
                    const p1 = base + y * gridWidth + x;
                    const p2 = base + y * gridWidth + (x + 1);
                    const p3 = base + (y + 1) * gridWidth + x;
                    const p4 = base + (y + 1) * gridWidth + (x + 1);
                    const p5 = (z + 1) * gridWidth * gridHeight + y * gridWidth + x;
                    const p6 = (z + 1) * gridWidth * gridHeight + y * gridWidth + (x + 1);
                    const p7 = (z + 1) * gridWidth * gridHeight + (y + 1) * gridWidth + x;
                    const p8 = (z + 1) * gridWidth * gridHeight + (y + 1) * gridWidth + (x + 1);
                    
                    cells.insertNextCell([p1, p2, p3]);
                    cells.insertNextCell([p2, p4, p3]);
                    cells.insertNextCell([p5, p6, p7]);
                    cells.insertNextCell([p6, p8, p7]);
                }
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
        
        // 设置颜色和透明度
        mapper.setScalarVisibility(true);
        const lut = vtk.Rendering.Core.vtkColorTransferFunction.newInstance();
        lut.addRGBPoint(-3000, 0, 0, 0.8);
        lut.addRGBPoint(0, 0.8, 0.8, 1);
        lut.addRGBPoint(3000, 1, 1, 0.8);
        
        mapper.setLookupTable(lut);
        actor.getProperty().setOpacity(0.7);
        
        // 添加到场景
        renderer.addActor(actor);
        segyVolume = actor;
        
        // 调整视图
        if (camera) {
            camera.setPosition(-n_traces * 0.2, -n_samples * 0.1, n_traces * 0.4);
            camera.setFocalPoint(0, 0, 0);
        }
        
        renderWindow.render();
        
    } catch (error) {
        console.error('创建SEGY三维体失败:', error);
        updateStatus('创建SEGY三维体失败: ' + error.message);
    }
}

// 全局导出
window.loadSEGY2D = loadSEGY2D;
window.loadSEGY3D = loadSEGY3D;
window.loadSEGY2DVisualization = loadSEGY2DVisualization;
window.loadSEGY3DVisualization = loadSEGY3DVisualization;