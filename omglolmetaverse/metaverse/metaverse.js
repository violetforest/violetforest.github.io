const fullscreen = document.getElementsByTagName("body")[0];

let cursortext = null;
document.addEventListener("DOMContentLoaded", () => {
  new cursoreffects.trailingCursor({ element: fullscreen });
});

import * as THREE from "./three.module.js";
import { GLTFLoader } from "./GLTFLoader.js";

// Array of .glb file names
const emojiModels = [
  './../metaverse/heart.gltf',
  './../metaverse/omg.gltf',
  './../metaverse/lol.gltf',
  './../metaverse/sad.gltf',
  './../metaverse/angry.gltf',
  './../metaverse/like.gltf'
]

// Declare everything we know we're going to need (or eventually need);
let canvas,
  scene,
  perspectiveCamera,
  perspectiveLayer,
  renderer,
  emojiModel,
  emojiModel2,
  window_innerWidth,
  window_innerHeight,
  clock;

let lastTime = 0;
let frameCount = 0;

let mouse = {
  x: 0,
  y: 0,
  z: 0
};

let currentLookAt = new THREE.Vector3(0, 0, 0);
let targetLookAt = new THREE.Vector3(0, 0, 0);
let particles = [];

let plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const waterGeometry = new THREE.PlaneGeometry(24, 24, 512, 512);

const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
  transparent: true,
  fog: true,
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(1, 1) },
    uBigWaveSpeed: { value: 1.75 },
    // Small Waves
    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 1.3 },
    uSmallWavesSpeed: { value: 2.2 },
    uSmallWavesIterations: { value: 2 },
    // Colorwater
    uDepthColor: { value: new THREE.Color(0x58c4f6) },
    uSurfaceColor: { value: new THREE.Color(0xfeb0fe) },
    uColorOffset: { value: 0.2 },
    uColorMultiplier: { value: 8 },

    // Fog, contains fogColor, fogDensity, fogFar and fogNear
    ...THREE.UniformsLib["fog"] } 
  });

const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * -15.5;

// This will grab the postion of the mouse in 3D space
function getMousePositionIn3D(mouseX, mouseY, camera) {
  let vector = new THREE.Vector3(mouseX, mouseY, 0.5).unproject(camera);
  let ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
  let intersectionPoint = new THREE.Vector3();
  ray.ray.intersectPlane(plane, intersectionPoint);
  return intersectionPoint;
}

const emoji = getRandomGlbFile();
// Load an initial model of an emoji (the one for the particles)
function loademojiModel() {
  const loader = new GLTFLoader();
  const newModel = getRandomGlbFile(); // Get a new random GLB file
  console.log(newModel + ' emoji'); // Log which model is being loaded

  loader.load(
    newModel,
    (gltf) => {
      emojiModel = gltf.scene; 
      emojiModel.scale.set(0.1, 0.1, 0.1);
      emojiModel.position.set(0, 0, 0);
      scene.add(emojiModel); 
      
      console.log("emoji model loaded successfully!");
    },
    undefined,
    (error) => {
      console.error("Error loading the emoji model:", error);
    }
  );
}

function getRandomGlbFile() {
  const index = Math.floor(Math.random() * emojiModels.length); // Generate a random index
  return emojiModels[index]; // Return the randomly selected .glb file name
}

// Load a second instance of the emoji model (the one in the center of the screen)
function loadSecondemoji() {
  const loader = new GLTFLoader();
  let emoji2 = getRandomGlbFile();
  console.log(emoji2 + 'emoji2');
  loader.load(
    emoji2, 
    (gltf) => {

      emojiModel2 = gltf.scene;

      emojiModel2.scale.set(2, 2, 2);
      
        emojiModel2.position.set(1, 1, 0);  
        emojiModel2.layers.set(perspectiveLayer);
        scene.add(emojiModel2);
        console.log("Second emoji loaded!");
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );
}

setInterval(function switchModelMouse() {
  if (emojiModel) {
    scene.remove(emojiModel);
  }

  loademojiModel();
}, 5000);


setInterval(function switchModelCenter() {
  if (emojiModel2) {
    scene.remove(emojiModel2);
  }

  loadSecondemoji();
}, 10000);

setInterval(function switchCursorText() {
  //cursortext.destroy()
  //cursortext = new cursoreffects.textFlag({ text: "Like & Subscribe!"});
}, 3000);


// This will set up the canvas element
function setup_Canvas() {
  canvas = document.querySelector('.web-gl');
}

// This will set up the scene
function setup_Scene() {
  scene = new THREE.Scene();
  clock = new THREE.Clock();
  scene.fog = new THREE.Fog( 0xe1f664, 1, 8 );
  scene.add(water);
}

// Set up different layers
function setUp_Layers() {
 perspectiveLayer = 0;
}

// This will set up our camera rigging system (we can always add more)
function setup_PerspectiveCamera() {
  window_innerWidth = window.innerWidth;
  window_innerHeight = window.innerHeight;
  perspectiveCamera= new THREE.PerspectiveCamera(75, window_innerWidth / window_innerHeight, 0.1, 100);
  perspectiveCamera.position.set(1, 1, 1);
  perspectiveCamera.layers.set(perspectiveLayer);
}

// Lighting Rigs. (You need light to seem right?)
function setup_Lights() {
  // Add a directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 8); // The color and intensity
  directionalLight.position.set(50, 50, 90); // Coming from above
  scene.add(directionalLight);
}

// No point in having a massive production if you're not going to render it.
function setup_Renderer() {

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: "high-performance",
    antialias: true,
    alpha: true
  });

  renderer.setSize(window_innerWidth, window_innerHeight);
  renderer.setClearColor(0x000000, 0); // Optional: explicitly set clear color with 0 opacity if needed
}

// Controls the center eye as it follows the mouse location in 3d space.
function setup_eyeRotation() {
  const sensitivity = 50; // Increase or decrease this value to change the sensitivity.

  if (emojiModel2) {
    targetLookAt.set(-mouse.x * sensitivity, -mouse.y * sensitivity, 4.25);
    targetLookAt.unproject(perspectiveCamera);

    const vector = new THREE.Vector3(mouse.x * sensitivity, mouse.y * sensitivity, 0.25);
    vector.unproject(perspectiveCamera);

    currentLookAt.lerp(targetLookAt, 0); // Adjust the lerp value as needed
    emojiModel2.lookAt(currentLookAt);
  }
}

// Setup the Mouse movement.
document.addEventListener('mousemove', setup_MouseMove, false);

function setup_MouseMove(event) {

  mouse = {
    x: 0,
    y: 0
  };

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const RADIUS = 10; // You can adjust this to change the effective radius
  const SCALING_FACTOR = 10; // You can adjust this value to your liking

  const r = RADIUS * Math.sqrt(Math.random()); // Random distance within the circle

  let position3D = getMousePositionIn3D(mouse.x, mouse.y, perspectiveCamera);

  const offset = randomPointInCircle(0 / window.innerWidth); // Convert px to normalized device coordinates

  position3D.x += offset.x * SCALING_FACTOR;
  position3D.y -= offset.y * SCALING_FACTOR;

  createParticle(position3D.x, position3D.y, position3D.z);
}

// Set up a random placement around the mouse in specified radius
function randomPointInCircle(radius) {
  const angle = Math.random() * 2 * Math.PI;

  // The following ensures a more uniform distribution in the circle:
  const r = radius * Math.sqrt(Math.random());

  const x = r * Math.cos(angle);
  const y = r * Math.sin(angle);

  return {
    x: x,
    y: y
  };
}

// This Creates the general attributes for the particles as they are generatate by the mouse movements.
function createParticle(x, y, z) {
  if (emojiModel) {
    const particle = emojiModel.clone(); // Change this line to clone emojiModel

    // Set initial properties for the particle
    particle.x = x;
    particle.y = y;
    particle.z = z;
    particle.directionX = Math.random() * 2 - 1;
    particle.directionY = Math.random() * 2 - 1;
    particle.directionZ = Math.random() * 2 - 1;
    particle.speedX = (Math.random() * 2) + 0.045;
    particle.speedY = (Math.random() * 2) + 0.045;
    particle.speedZ = (Math.random() * 2) + 0.0045;
    particle.radius = 60; // Adjust this as needed
    particle.size = 1; // Example value, adjust as needed
    particle.frameX = Math.floor(Math.random() * 4);
    particle.frameY = Math.floor(Math.random() * 4);

    const initialScale = Math.random() * 0.1 + 0.1;
    particle.scale.set(initialScale, initialScale, initialScale);

    // Ensure emojiModel is defined before attempting to look at it
    if (emojiModel.position) {
      particle.lookAt(emojiModel.position); // Look at the center emoji
    }

    particle.position.set(x, y, z);

    particle.growing = false;
    particle.scaleTarget = Math.random();

    particle.lifespan = Math.random() * 5 + 3; // lifespan between 3 to 8 seconds

    particle.age = 0; // Initialize age to track particle's age

    // Add update method
    particle.update = function () {
      // Movement logic adapted from your second code snippet
      if (particle.x + particle.radius * 10 > window.innerWidth || particle.x - particle.radius * 10 < 0) {
        particle.directionX = -particle.directionX;
      }
      if (particle.y + particle.radius * 10 > window.innerHeight || particle.y - particle.radius * 10 < 0) {
        particle.directionY = -particle.directionY;
      }

      particle.x += particle.directionX * particle.speedX;
      particle.y += particle.directionY * particle.speedY;
      particle.z += particle.directionZ * particle.speedZ;

      // Update the Three.js particle's position
      particle.position.set(particle.x, particle.y, particle.z);

      // Example mouse interaction logic (adjust as needed)
      if (mouse && (Math.abs(mouse.x - particle.x) < 60 && Math.abs(mouse.y - particle.y) < 10)) {
        if (particle.radius < 1000) { // Example max radius, adjust as needed
          particle.radius += 1;
        }
      } else if (particle.radius > 0.1) { // Example min radius, adjust as needed
        particle.radius -= 0.85;
      }
      if (particle.radius < 0) {
        particle.radius = 0;
      }
    };

    particles.push(particle);
    scene.add(particle);
  }
}

// This updates the particles AFTER they're generated.
function updateParticles() {
  const GROWTH_SPEED = 0.05; // This defines how fast particles grow each frame.
  const MAX_SIZE = 1; // Corresponds to 100px
  const ONE_SECOND = 120; // Assuming 60fps
  const SHRINK_SPEED = MAX_SIZE / ONE_SECOND / 2; // Ensure it shrinks from 1.0 to 0 in 1 second.

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];

    particle.position.x += (particle.directionX * particle.speedX) * 0.03;
    particle.position.y += (particle.directionY * particle.speedY) * 0.03;
    particle.position.z += (particle.directionZ * particle.speedZ) * 0.03;

    // Mouse Interaction
    const distanceToMouse = new THREE.Vector3().subVectors(targetLookAt, particle.position).length();

    // If particle hasn't started shrinking and hasn't reached max size, let it grow.
    if (!particle.shrinking && particle.scale.x < MAX_SIZE) {
      particle.scale.x += GROWTH_SPEED;
      particle.scale.y += GROWTH_SPEED;
      particle.scale.z += GROWTH_SPEED;
    }

    // If particle reaches or surpasses max size and hasn't started shrinking, set shrinking to true.
    if (particle.scale.x >= MAX_SIZE && !particle.shrinking) {
      particle.shrinking = true;
    }

    // If particle is shrinking, reduce its size.
    if (particle.shrinking) {
      particle.scale.x -= SHRINK_SPEED;
      particle.scale.y -= SHRINK_SPEED;
      particle.scale.z -= SHRINK_SPEED;
    }

    // Remove Particle if Shrunk Completely
    if (particle.scale.x <= 0) {
      scene.remove(particle);
      particles.splice(i, 1);
      continue;
    }

    // Particle Aging
    particle.age += 1 / ONE_SECOND;
    if (particle.age >= particle.lifespan) {
      particle.shrinking = true;
    }

    if (emojiModel2) {
      particle.lookAt(emojiModel2.position);
    }
  }
}

function animate() {
  currentLookAt.lerp(targetLookAt, 1);
  setup_eyeRotation();
  updateParticles();
  const elapsedTime = clock.getElapsedTime();

  // Update time
  waterMaterial.uniforms.uTime.value = elapsedTime;
  
   // FSP Counter  
  const now = performance.now();
  const delta = now - lastTime;
  const dt = clock.getDelta();

  frameCount++;

  // Particle Animation
  const MAX_AGE = 6; // Define the maximum age of particles (in seconds)

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];

    // Particle removal based on age
    if (particle.age >= MAX_AGE) {
      scene.remove(particle);
      particles.splice(i, 1);
      i--; // Adjust index due to splice
      continue;
    }
  }

  requestAnimationFrame(animate);
  renderer.render(scene, perspectiveCamera);
}

window.addEventListener('resize', () => {
  window_innerWidth = window.innerWidth;
  window_innerHeight = window.innerHeight;
  renderer.setSize(window_innerWidth, window_innerHeight);
  perspectiveCamera.aspect = window_innerWidth / window_innerHeight;
  perspectiveCamera.updateProjectionMatrix();
});

setup_Canvas();
setup_Scene();
setUp_Layers();
setup_PerspectiveCamera();
setup_Lights();
setup_Renderer();
loademojiModel();
loadSecondemoji();
setup_eyeRotation();

animate();