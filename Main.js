import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.137.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.137.0/examples/jsm/loaders/GLTFLoader.js';



// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adding lighting
const light = new THREE.AmbientLight(0xffffff); // Soft white light
scene.add(light);

// Model loader
const loader = new GLTFLoader();
let modelMesh;

loader.load(
    'Models/shirt.gltf', // Path to your 3D model
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

// WebSocket setup
const socket = new WebSocket('ws://e18f-2603-8000-d300-d1e-d8b1-f422-a7fa-252a.ngrok-free.app');

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.textureUrl) {
        updateTexture(data.textureUrl);
    }
};

function updateTexture(url) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(url, function (texture) {
        modelMesh.traverse((child) => {
            if (child.isMesh) {
                child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (modelMesh) {
        modelMesh.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
}

animate();
