// AOT环境遮挡
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
    // 添加纹理
    const textureLoad = new THREE.TextureLoader()
    const doorImage = await textureLoad.load('/door.jpg')
    // 设置放大滤镜为与纹理最接近的一种
    doorImage.magFilter = THREE.NearestFilter
    doorImage.minFilter = THREE.LinearFilter
    const doorAplhaTexture = await textureLoad.load('/hives_icon_decline.png')
    const doorAoTexture = await textureLoad.load('/zhalan.jpeg')
    // 创建几何体
    const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
    const basicMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        map: doorImage,
        alphaMap: doorAplhaTexture,// 覆盖图
        aoMap: doorAoTexture,
        aoMapIntensity: 1,
        transparent: true,//透明
        // side: THREE.DoubleSide,//渲染那些面
    })
    cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2))

    const cube = new THREE.Mesh(cubeGeometry, basicMaterial)
    scene.add(cube)

    // 添加平面
    const planeGeometry = new THREE.PlaneBufferGeometry(1, 1)
    const plane = new THREE.Mesh(planeGeometry, basicMaterial)
    plane.position.set(3, 0, 0)
    planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2))
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