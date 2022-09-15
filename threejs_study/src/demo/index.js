// 点光源
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'

function getPath(path) {
    return new URL('../assets/' + path, import.meta.url).href
}
export default async function (dom) {
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
    // const pointLightHelper = new THREE.pointLightHelper(5);
    // scene.add(pointLightHelper)
    // 添加灯光
    // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(light);
    // 聚光灯光线
    const pointLight = new THREE.PointLight(0xff0000, 1)
    // pointLight.position.set(2, 2, 2)
    // 开启光源阴影
    pointLight.castShadow = true
    // 阴影模糊度
    pointLight.shadow.radius = 20
    // 设置阴影贴图模糊度分辨率
    pointLight.shadow.mapSize.set(4096, 4096)
    pointLight.distance = 10
    scene.add(pointLight);
    // 调试光源距离
    const gui = new dat.GUI()

    pointLight.intensity = 2
    // 点光源
    gui.add(pointLight, "distance").min(0).max(10).step(0.01).name('distance')
    // gui.add(pointLight, "penumbra").min(0).max(1).step(0.01).name('penumbra')
    gui.add(pointLight, "decay").min(0).max(1).step(0.01).name('decay')
    // 创建圆
    const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)
    const material = new THREE.MeshStandardMaterial()
    const sphere = new THREE.Mesh(sphereGeometry, material)
    gui.add(sphere.position, "x").min(-5).max(5).step(0.1).name('X轴')
    gui.add(pointLight.position, "x").min(-5).max(5).step(0.1).name('XpointLight')
    // 球开启阴影
    sphere.castShadow = true
    scene.add(sphere);

    // 创建平面
    const planeGeometry = new THREE.PlaneBufferGeometry(50, 50)
    const plane = new THREE.Mesh(planeGeometry, material)
    plane.position.set(0, -1, 0)
    plane.rotation.x = -Math.PI / 2
    // 平面开启接收阴影
    plane.receiveShadow = true
    scene.add(plane)

    const smallBall = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.1, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )
    smallBall.position.set(Math.PI, 2, Math.PI)
    smallBall.add(pointLight)
    scene.add(smallBall)


    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    // 开启阴影
    renderer.shadowMap.enabled = true
    // 设置渲染的尺寸大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    dom.current?.appendChild(renderer.domElement);
    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    // 阻尼器
    controls.enableDamping = true
    // 开启物理渲染
    renderer.physicallyCorrectLights = true

    gsap.to(smallBall.position, { x: - Math.PI, z: - Math.PI, duration: 5, ease: 'power1.inOut', repeat: -1, reversed: true })

    const clock = new THREE.Clock()
    //  设置动画
    function render() {
        let time = clock.getElapsedTime()
        console.log(time, Math.sin(time))
        smallBall.position.x = Math.sin(time) * 3
        smallBall.position.z = Math.cos(time) * 3
        smallBall.position.y = 2 + Math.sin(time * 10) / 2
        controls.update()
        renderer.render(scene, camera);
        requestAnimationFrame(render)
    }

    render()
}