import * as THREE from 'three';
import gsap from 'gsap';

const sizes = {
    width: 800,
    height: 600
}

const cursor = {
    x: 0,
    y: 0
}

window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.height - 0.5);
});

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();
const group = new THREE.Group();
group.position.y = 1;
scene.add(group);


const cub1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "blue" })
)
group.add(cub1);

const cub2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "red" })
)
cub2.position.x = -2;
group.add(cub2);

const cub3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "gray" })
)
cub3.position.x = 2;
group.add(cub3);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);




const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();

// gsap.to(group.position, { delay: 1, duration: 1, x: 2 })

const tick = () => {

    const elapsedTime = clock.getElapsedTime();

    // group.rotation.y = elapsedTime;
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 6;
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 6;
    camera.position.y = cursor.y * 6;

    camera.lookAt(group.position);

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}
tick();

