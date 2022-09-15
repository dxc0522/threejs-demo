// 水天一色的小岛
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// 导入水面
import { Water } from 'three/examples/jsm/objects/Water2'
// 导入fltf 载入库
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
function getPath(path, baseUrl = '../assets/') {
    return new URL(baseUrl + path, import.meta.url).href
}
export default async function (dom) {
    // 1、创建场景
    const scene = new THREE.Scene();
    // 2、创建相机
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );

    // 设置相机位置
    camera.position.set(-50, 50, 500);
    //更新 摄像头款高比例
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新矩阵
    camera.updateProjectionMatrix()
    scene.add(camera);

    // 设置坐标系
    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper)
    // const textureLoad = new THREE.TextureLoader()

    /* 添加平面 */
    // const plane = new THREE.Mesh(
    //     new THREE.PlaneGeometry(100, 100),
    //     new THREE.MeshBasicMaterial({ color: 0xffffff })
    // )
    // scene.add(plane)
    /* 创建天空球 */
    const textureLoad = new THREE.TextureLoader()
    const sky = new THREE.Mesh(
        new THREE.SphereGeometry(1000, 60, 60),
        new THREE.MeshBasicMaterial({
            map: textureLoad.load(getPath('page1/sky.jpg'))
        })
    )
    // 将球的纹理翻到内侧
    sky.geometry.scale(1, 1, -1)
    // 视频纹理
    const video = document.createElement('video')
    video.src = getPath('page1/sky.mp4');
    video.loop = true
    video.muted = true
    video.play()
    video.onplay = () => {
        sky.material.map = new THREE.VideoTexture(video)
        sky.material.needsUpdate = true
    }
    window.addEventListener('click', () => {
        video.paused && video.play()
    })

    scene.add(sky)
    // 创建水面
    let waterGeometry = new THREE.CircleBufferGeometry(300, 64)
    const water = new Water(waterGeometry, {
        textureWidth: 1024,
        textureHeight: 1024,
        color: 0xeeeeff,
        flowDirection: new THREE.Vector2(1, 1),
        scale: 1
    })
    water.rotation.x = -Math.PI / 2
    scene.add(water)

    // 添加小岛模型
    // 实例话fltf载入库
    const loader = new GLTFLoader(),
        dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')

    loader.setDRACOLoader(dracoLoader)

    loader.load('/model/island2.glb', (gltf) => {
        scene.add(gltf.scene)
    })


    // 环境纹理
    const hdrLoader = new RGBELoader()
    hdrLoader.loadAsync(getPath('050.hdr')).then(texture => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
    })








    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({
        // 抗锯齿
        antialias: true
    });
    // 设置渲染的尺寸大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding
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