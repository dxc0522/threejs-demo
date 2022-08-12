// 界面变量调整
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import * as dat from 'dat.gui'
export default function (dom) {
    // 1、创建场景
    const scene = new THREE.Scene();
    console.log(THREE)
    // 2、创建相机
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // 设置相机位置
    camera.position.set(0, 0, 10);
    scene.add(camera);
    // 设置坐标系
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper)
    // 添加物体
    // 创建几何体
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    // 根据几何体和材质创建物体
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // cube.position.set(1, 0, 0)
    // cube.position.y = 2
    // cube.rotation.set(Math.PI / 4, 0, 0,'XYZ')
    // 将几何体添加到场景中
    scene.add(cube);
    // 创建gui  界面参数调整
    const gui = new dat.GUI()
    gui.add(cube.position, 'x').min(0).max(5).step(0.01).name('移动x轴').onChange((value) => {
        console.log('onChange', value)
    }).onFinishChange(value => {
        console.log('onFinishChange', value)
    })
    // 修改物体颜色 
    const params = {
        color: "#FFFF00",
        fn() {
            console.log('执行函数')
            gsap.to(cube.position, { x: 5, duration: 2, yoyo: true, repeat: -1 })
        }
    }
    gui.addColor(params, "color").onFinishChange(value => {
        console.log('onFinishChange', value)
        cube.material.color.set(value)
    })
    gui.add(cube, "visible").name('是否显示')
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    // 设置渲染的尺寸大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    // console.log(renderer);
    // 点击触发某个事件 设置选项框
    gui.add(params, 'fn').name('开始动画')
    // 添加文件夹
    const folder = gui.addFolder("设置立方体")
    folder.add(cube.material, "wireframe")

    dom.current?.appendChild(renderer.domElement);


    const controls = new OrbitControls(camera, renderer.domElement)
    // 阻尼器
    controls.enableDamping = true
    //  设置动画
    function render() {
        controls.update()
        renderer.render(scene, camera);
        requestAnimationFrame(render)
    }

    render()
    // 监听窗口变化 更新
    window.addEventListener('resize', () => {
        console.log('画面变化了')
        // 更新摄像头
        camera.aspect = window.innerWidth / window.innerHeight
        // 更新摄像机的投影矩阵
        camera.updateProjectionMatrix()
        // 更新渲染器
        renderer.setSize(window.innerWidth, window.innerHeight)
        // 设置渲染器的像素比
        renderer.setPixelRatio(window.innerWidth / window.innerHeight)
    })
}