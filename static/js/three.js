import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

let scene, camera, renderer;
let particles = [];
const particleCount = 1000; // Idadi ya chembe

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.getElementById('vr-container').appendChild(renderer.domElement);

    document.body.appendChild(VRButton.createButton(renderer));

    // Unda mazingira ya maabara
    createLabEnvironment();

    // Unda chembe
    createParticles();

    camera.position.z = 10;

    // Fungua kitufe cha simulation
    document.getElementById('run-simulation').addEventListener('click', runSimulation);
}

function createLabEnvironment() {
    scene.background = new THREE.Color(0x000000);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = Math.random() * 10 - 5;
        positions[i * 3 + 1] = Math.random() * 10 - 5;
        positions[i * 3 + 2] = Math.random() * 10 - 5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 });
    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    particles.push(particlesMesh);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    particles.forEach(particle => {
        particle.rotation.y += 0.01;
    });
    renderer.render(scene, camera);
}

function runSimulation() {
    const chemical1 = prompt("Enter first chemical (e.g., H2O, HCl, C2H5OH):");
    const chemical2 = prompt("Enter second chemical (e.g., Na, NaOH, O2):");

    fetch('/simulate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chemical1: chemical1, chemical2: chemical2 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            createReactionEffect(data.reaction, data.color, data.smoke);
        } else {
            alert("No visible reaction!");
        }
    });
}

function createReactionEffect(reaction, color, smoke) {
    const vrContainer = document.getElementById('vr-container');
    vrContainer.style.backgroundColor = color;
    vrContainer.innerHTML = `<div class='reaction'>Reaction: ${reaction}</div>`;
    
    if (smoke) {
        vrContainer.innerHTML += "<div class='smoke'>💨 Smoke effect</div>";
    }

    // Ongeza athari za particle
    particles.forEach(particle => {
        particle.material.color.set(color); // Badilisha rangi ya chembe
    });
}
