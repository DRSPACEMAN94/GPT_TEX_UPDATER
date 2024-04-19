import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.137.0/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.137.0/examples/jsm/loaders/FBXLoader.js';

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
const loader = new FBXLoader();
let modelMesh;

loader.load(
    'Models/boombox.fbx', // Make sure this path points to your FBX file
    function (fbx) {
        modelMesh = fbx;
        scene.add(modelMesh);
        camera.position.z = 5;

        // FBX files might include their own textures and materials
        modelMesh.traverse((child) => {
            if (child.isMesh && child.material.map) {
                // Material and texture are applied automatically
            }
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
