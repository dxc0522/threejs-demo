// 添加纹理
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
    camera.position.set(0, 0, 3);
    scene.add(camera);
    // 设置坐标系
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper)
    // 添加纹理
    const textureLoad = new THREE.TextureLoader()
    const doorImage = await textureLoad.load('/hives_icon_decline.png')
    // // 纹理设置
    // doorImage.offset.x = 0.2
    // doorImage.offset.y = 0.2
    // doorImage.rotation = 0.25 * Math.PI
    // doorImage.center.set(0.5, 0.5)
    // // 同一面2v重复次数
    // doorImage.repeat.set(2, 3)
    // // 坐标轴重复模式
    // doorImage.wrapS = THREE.RepeatWrapping
    // doorImage.wrapT = THREE.MirroredRepeatWrapping
    // console.log(doorImage)
    // 设置放大滤镜为与纹理最接近的一种
    doorImage.magFilter = THREE.NearestFilter
    doorImage.minFilter = THREE.LinearFilter
    // 创建几何体
    const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
    const basicMaterial = new THREE.MeshBasicMaterial({
        // color: 0xffff00,
        map: doorImage
    })
    const cube = new THREE.Mesh(cubeGeometry, basicMaterial)
    scene.add(cube)




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