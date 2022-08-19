// 阴影
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

    // 添加灯光
    // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(light);
    // 直射光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 5, 5)
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 500
    directionalLight.shadow.camera.top = 5
    directionalLight.shadow.camera.bottom = -5
    directionalLight.shadow.camera.left = -5
    directionalLight.shadow.camera.right = 5

    // 调试光源距离
    const gui = new dat.GUI()
    gui.add(directionalLight.shadow.camera, "near").min(5).max(10).step(0.1).name('距离').onChange(() => {
        directionalLight.shadow.camera.updateProjectionMatrix()
    })
    // 开启光源阴影
    directionalLight.castShadow = true
    // 阴影模糊度
    directionalLight.shadow.radius = 20
    // 设置阴影贴图模糊度分辨率
    directionalLight.shadow.mapSize.set(4096, 4096)
    scene.add(directionalLight);

    // 创建圆
    const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)
    const material = new THREE.MeshStandardMaterial()
    const sphere = new THREE.Mesh(sphereGeometry, material)
    // 球开启阴影
    sphere.castShadow = true
    scene.add(sphere);

    // 创建平面
    const planeGeometry = new THREE.PlaneBufferGeometry(10, 10)
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
    //  设置动画
    function render() {
        controls.update()
        renderer.render(scene, camera);
        requestAnimationFrame(render)
    }

    render()
}