// 目标：3D物体的移动
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    // 设置渲染的尺寸大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    // console.log(renderer);
    console.log(dom.current)
    // 将webgl渲染的canvas内容添加到body


    dom.current?.appendChild(renderer.domElement);


    const controls = new OrbitControls(camera, renderer.domElement)
    let itemStep = 0.1
    function render() {
        // 定位
        cube.position.x += itemStep
        // 缩放
        // cube.scale.y += itemStep
        // 旋转
        cube.rotation.y += itemStep
        if (Math.abs(cube.position.x) > 5) {
            itemStep = -itemStep
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render)
    }

    render()

}