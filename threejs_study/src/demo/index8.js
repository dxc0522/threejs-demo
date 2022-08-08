// gsap 动画
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
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
    // 阻尼器
    controls.enableDamping = true
    const animation1 = gsap.to(cube.position, {
        x: 5, duration: 5, ease: 'power1.inOut', repeat: -1, yoyo: true, delay: 2, onStart() {
            console.log('动画开始')
        }, onComplete() {
            console.log('动画完成')
        }
    })
    gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, ease: 'power1.inOut', repeat: 1 })

    window.addEventListener('dblclick', () => {
        document.fullscreenElement ? document.exitFullscreen() : renderer.domElement.requestFullscreen()

    })
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