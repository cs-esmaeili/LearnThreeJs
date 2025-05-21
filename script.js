// 1. Imports
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import GUI from 'lil-gui';


const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/textures/door/color.jpg');


const gui = new GUI({
    width: 300,
    title: 'Nice ui',
    closeFolders: true
});
gui.close();
gui.hide();

const debugObject = {}

// 2. DOM & Sizes
const canvas = document.querySelector("canvas.webgl");
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const cursor = {
    x: 0,
    y: 0
};

// 3. Scene
const scene = new THREE.Scene();


debugObject.color = '#d26256';
// const matrial = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true });
const matrial = new THREE.MeshBasicMaterial({ map: texture });
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const mesh = new THREE.Mesh(geometry, matrial);
scene.add(mesh);

const cubTweaks = gui.addFolder('Cube Folder');
cubTweaks.close();

cubTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.01).name("y axis");
cubTweaks.add(mesh, 'visible');
cubTweaks.add(matrial, 'wireframe');
cubTweaks.addColor(debugObject, 'color').onChange((color) => {
    matrial.color.set(debugObject.color);
});

debugObject.spin = () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 })
}
cubTweaks.add(debugObject, 'spin');


debugObject.subdivision = 2;
cubTweaks.add(debugObject, 'subdivision').min(1).max(20).step(1).onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
        1, 1, 1,
        debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
    );
});


// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// 5. Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

// 6. Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// 7. Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 8. Event Listeners
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.height - 0.5);
});

// window.addEventListener("dblclick", () => {
//     if (!document.fullscreenElement) {
//         canvas.requestFullscreen();
//     } else {
//         document.exitFullscreen();
//     }
// });

window.addEventListener('keydown', (event) => {
    if (event.key == 'h') {
        if (gui._hidden) {
            gui.show();
        } else {
            gui.hide();
        }
    }
})


// 9. Animation Loop
const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};
tick();
