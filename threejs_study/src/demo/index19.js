// 聚光灯光线
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
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
    // const spotLightHelper = new THREE.SpotLightHelper(5);
    // scene.add(spotLightHelper)
    // 添加灯光
    // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(light);
    // 聚光灯光线
    const spotLight = new THREE.SpotLight(0xffffff, 0.5)
    spotLight.position.set(5, 5, 5)
    spotLight.angle = Math.PI / 6;
    // spotLight.shadow.camera.near = 0.5
    // spotLight.shadow.camera.far = 500
    // spotLight.shadow.camera.top = 5
    // spotLight.shadow.camera.bottom = -5
    // spotLight.shadow.camera.left = -5
    // spotLight.shadow.camera.right = 5
    // 开启光源阴影
    spotLight.castShadow = true
    // 阴影模糊度
    spotLight.shadow.radius = 20
    // 设置阴影贴图模糊度分辨率
    spotLight.shadow.mapSize.set(4096, 4096)
    scene.add(spotLight);
    // 调试光源距离
    const gui = new dat.GUI()
    gui.add(spotLight.shadow.camera, "near").min(5).max(10).step(0.1).name('距离').onChange(() => {
        spotLight.shadow.camera.updateProjectionMatrix()
    })
    spotLight.intensity = 2
    // 聚光灯，射入光线角度
    gui.add(spotLight, "angle").min(0).max(Math.PI / 2).step(0.01).name('angle')
    gui.add(spotLight, "distance").min(0).max(10).step(0.01).name('distance')
    gui.add(spotLight, "penumbra").min(0).max(1).step(0.01).name('penumbra')
    gui.add(spotLight, "decay").min(0).max(1).step(0.01).name('decay')
    // 创建圆
    const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)
    const material = new THREE.MeshStandardMaterial()
    const sphere = new THREE.Mesh(sphereGeometry, material)
    gui.add(sphere.position, "x").min(-5).max(5).step(0.1).name('X轴')
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
    //  设置动画
    function render() {
        controls.update()
        renderer.render(scene, camera);
        requestAnimationFrame(render)
    }

    render()
}