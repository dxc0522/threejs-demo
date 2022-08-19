// PBR 物理渲染. 各种贴图. 进度管理
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
function getPath(path) {
    return new URL(path, import.meta.url).href
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
    camera.position.set(0, 0, 5);
    scene.add(camera);
    // 设置坐标系
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper)

    // 添加灯光
    // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(light);
    // 直射光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-10, 10, 10)
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
    const textureLoad = new THREE.TextureLoader(loadingManager)

    // 单张纹理加载管理
    const doorImage = textureLoad.load(getPath('../assets/door/color.jpg'),
        // () => {
        //     console.log('onload')
        // }, () => {
        //     console.log('onProgress')
        // }, () => {
        //     console.log('onError')
        // }
    )

    // 设置放大滤镜为与纹理最接近的一种
    doorImage.magFilter = THREE.NearestFilter
    doorImage.minFilter = THREE.LinearFilter
    const doorAplhaTexture = textureLoad.load(getPath('../assets/door/alpha.jpg'))
    const doorAoTexture = textureLoad.load(getPath('../assets/door/ambientOcclusion.jpg'))
    // 导入置换贴图
    const doomHeightTexture = textureLoad.load(getPath('../assets/door/height.jpg'))
    // 导入粗糙度贴图
    const doorRoughnessTexture = textureLoad.load(getPath('../assets/door/roughness.jpg'))
    // 导入金属贴图
    const metalnessTexture = textureLoad.load(getPath('../assets/door/metalness.jpg'))
    // 法线贴图
    const normalTexture = textureLoad.load(getPath('../assets/door/normal.jpg'))
    // 创建几何体
    const material = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        map: doorImage,
        alphaMap: doorAplhaTexture,// 覆盖图
        aoMap: doorAoTexture,
        aoMapIntensity: 1,
        transparent: true,//透明
        displacementMap: doomHeightTexture,
        displacementScale: 0.05,
        roughness: 1,//粗糙程度决定反射光效果
        roughnessMap: doorRoughnessTexture,
        metalness: 1,
        metalnessMap: metalnessTexture,
        normalMap: normalTexture
        // side: THREE.DoubleSide,//渲染那些面
    })

    const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 100, 100, 100)
    cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2))

    const cube = new THREE.Mesh(cubeGeometry, material)
    scene.add(cube)

    // 添加平面
    const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 200, 200)
    const plane = new THREE.Mesh(planeGeometry, material)
    plane.position.set(2, 0, 0)
    scene.add(plane)



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