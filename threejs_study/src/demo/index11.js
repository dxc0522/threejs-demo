// 创建一个酷炫三角形科技物体
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export default function (dom) {
    // 1、创建场景
    const scene = new THREE.Scene();
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

    for (let i = 0; i < 50; i++) {
        const geometry = new THREE.BufferGeometry();
        // 提前告诉Float32Array有9个值
        const positionArray = new Float32Array(9)
        // 每一个三角形需要三个顶点，需要三个值
        for (let j = 0; j < 9; j++) {
            positionArray[j] = Math.random() * 10 - 5
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
        let color = new THREE.Color(Math.random(), Math.random(), Math.random())
        const material = new THREE.MeshBasicMaterial({
            color: color, transparent: true,
            opacity: Math.random()
        });
        // 根据几何体和材质创建物体
        const mesh = new THREE.Mesh(geometry, material);
        // 将几何体添加到场景中
        scene.add(mesh);
    }




    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    // 设置渲染的尺寸大小
    renderer.setSize(window.innerWidth, window.innerHeight);

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
}