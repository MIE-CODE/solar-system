import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";

// initialize pane
const pane = new Pane({
  title: "Parameters",
  expanded: true,
});
// initialize the scene
const scene = new THREE.Scene();

// initialize the loader

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath("/cubeMap/");
const sunTexture = textureLoader.load("/textures/suntexture.jpg");
const moonTexture = textureLoader.load("/textures/moon.jpg");
const venusTexture = textureLoader.load("/textures/8k_venus_surface.jpg");
const marsTexture = textureLoader.load("/textures/8k_mars.jpg");
const mecuryTexture = textureLoader.load("/textures/8k_jupiter.jpg");
const saturnTexture = textureLoader.load("/textures/8k_saturn.jpg");
const earthTexture = textureLoader.load("/textures/8k_earth_daymap.jpg");
const backgroundCubeMap = cubeTextureLoader.load([
  "px.png",
  "nx.png",
  "py.png",
  "ny.png",
  "pz.png",
  "nz.png",
]);
// const earthTexture = textureLoader.load();
//initialize group

const group = new THREE.Group();

// object in the scene
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// initialize material
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const mecuryMaterial = new THREE.MeshStandardMaterial({ map: mecuryTexture });
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const earthMaterail = new THREE.MeshStandardMaterial({ map: earthTexture });
scene.background = backgroundCubeMap;
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);

const planets = [
  {
    name: "Earth",
    radius: 1,
    distance: 10,
    speed: 0.005,
    material: earthMaterail,
    moons: [{ name: "Moon", radius: 0.2, distance: 2, speed: 0.015 }],
  },
  {
    name: "Mecury",
    radius: 1,
    distance: 15,
    speed: 0.025,
    material: mecuryMaterial,
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 20,
    speed: 0.015,
    material: venusMaterial,
  },
  {
    name: "Saturn",
    radius: 1.3,
    distance: 25,
    speed: 0.002,
    material: saturnMaterial,
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 30,
    speed: 0.009,
    material: marsMaterial,
    moons: [
      { name: "Moon", radius: 0.1, distance: 2, speed: 0.015 },
      { name: "Moon", radius: 0.3, distance: 3, speed: 0.015 },
    ],
  },
];

const createPlanet = (planet) => {
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;
  return planetMesh;
};
const createMoon = (moon) => {
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;
  return moonMesh;
};
const planetMeshes = planets.map((planet) => {
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);
  planet.moons?.forEach((moon) => {
    const moonMesh = createMoon(moon);
    planetMesh.add(moonMesh);
  });
  return planetMesh;
});

const light = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(light);
const pointLight = new THREE.PointLight(0xffffff, 100);
// pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// cubeMesh.position.set(0.8, 0.8, 0.8);
// cubeMesh.scale.setScalar(2);
// cubeMesh.rotation.x = THREE.MathUtils.degToRad(45);
// console.log(cubeMesh);
// const axesHepler = new THREE.AxesHelper(2);
// scene.add(axesHepler);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
// const aspectRatio = window.innerWidth / window.innerHeight;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   200
// );

camera.position.z = 100;
camera.position.y = 5;
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// initialize controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
//controls.autoRotate = true;
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// initialize the clock

const renderLoop = () => {
  planetMeshes.forEach((planet, index) => {
    planet.rotation.y += planets[index].speed;
    planet.position.x = Math.sin(planet.rotation.y) * planets[index].distance;
    planet.position.z = Math.cos(planet.rotation.y) * planets[index].distance;
    planet.children.forEach((moon, idx) => {
      moon.rotation.y += planets[index].moons[idx].speed;
      moon.position.x =
        Math.sin(moon.rotation.y) * planets[index].moons[idx].distance;
      moon.position.z =
        Math.cos(moon.rotation.y) * planets[index].moons[idx].distance;
    });
  });
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};

renderLoop();
