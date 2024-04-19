// Import Three.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// Import GLTFLoader (matching the Three.js version)
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Model loader
const loader = new GLTFLoader();
let modelMesh;

loader.load(
    'Models/boombox.gltf', // Path to your 3D model
    function (gltf) {
        modelMesh = gltf.scene;
        scene.add(modelMesh);
        camera.position.z = 5;

        // Apply the default texture
        const defaultTexture = new THREE.TextureLoader().load('Textures/UV_TILES.png', function (texture) {
            modelMesh.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = texture;
                    child.material.needsUpdate = true;
                }
            });
        });
    },
    undefined,
    function (error) {
        console.error('An error happened', error);
    }
);

camera.position.z = 5;

// Adding lighting
const light = new THREE.AmbientLight(0xffffff); // Soft white light
scene.add(light);

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();
