// 环境贴图
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
    directionalLight.position.set(10, 10, 10)
    scene.add(directionalLight);

    // 设置加载管理器
    const loadingManager = new THREE.LoadingManager(
        (url, num, total) => {
            console.log('onload：' + url)
        }, (url, num, total) => {
            console.log('onProgress：' + url)
            console.log('num：' + num)
            console.log('total：' + total)
        }, (url, num, total) => {
            console.log('onError：' + url)
        }
    )
    // 添加纹理
    const cubeTextureLoader = new THREE.CubeTextureLoader()
    // 多张图加载环境贴图
    const envMapTexture = cubeTextureLoader.load([
        getPath('environmentMaps/1/px.jpg'),
        getPath('environmentMaps/1/nx.jpg'),
        getPath('environmentMaps/1/py.jpg'),
        getPath('environmentMaps/1/ny.jpg'),
        getPath('environmentMaps/1/pz.jpg'),
        getPath('environmentMaps/1/nz.jpg'),
    ])
    // HDR资源加载
    const rgbeLoader = new RGBELoader()
    rgbeLoader.loadAsync(getPath('hdr/002.hdr')).then(texture => {
        // EquirectangularReflectionMapping 和 EquirectangularRefractionMapping 用于等距圆柱投影的环境贴图，
        // 也被叫做经纬线映射贴图。等距圆柱投影贴图表示沿着其水平中线360°的视角，以及沿着其垂直轴向180°的视角。
        // 贴图顶部和底部的边缘分别对应于它所映射的球体的北极和南极。
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture

    })


    const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)
    const material = new THREE.MeshStandardMaterial({
        metalness: 0.7,
        roughness: 0.1,
        // envMap: envMapTexture
    })
    const sphere = new THREE.Mesh(sphereGeometry, material)

    scene.add(sphere)
    // 给环境添加背景
    scene.background = envMapTexture
    // 给所有的物体添加默认的环境贴图
    scene.environment = envMapTexture

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