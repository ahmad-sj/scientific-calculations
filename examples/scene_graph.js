import * as THREE from "three";
import { updateAspect, AxisGridHelper } from "~/helpers";
import GUI from "lil-gui";

const gui = new GUI();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

// =======================================================

// an array of objects whose rotation to update
const objects = [];

// use just one sphere for everything
const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
const sphereGeometry = new THREE.SphereGeometry(
  radius,
  widthSegments,
  heightSegments,
);

const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5); // make the sun large
objects.push(sunMesh);

const color = 0xffffff;
const intensity = 500;
const light = new THREE.PointLight(color, intensity);
scene.add(light);

const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
objects.push(earthOrbit);

const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x2233ff,
  emissive: 0x112244,
});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);

const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
solarSystem.add(sunMesh);
solarSystem.add(earthOrbit);
objects.push(solarSystem);

const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);

const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0x888888,
  emissive: 0x222222,
});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(0.5, 0.5, 0.5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);

// add an AxesHelper to each node
function makeAxisGrid(node, label, units) {
  const helper = new AxisGridHelper(node, units);
  gui.add(helper, "visible").name(label);
}

makeAxisGrid(solarSystem, "solarSystem", 25);
makeAxisGrid(sunMesh, "sunMesh");
makeAxisGrid(earthOrbit, "earthOrbit");
makeAxisGrid(earthMesh, "earthMesh");
makeAxisGrid(moonOrbit, "moonOrbit");
makeAxisGrid(moonMesh, "moonMesh");

// =======================================================

function animate(time) {
  // converting from milliseconds to seconds
  time *= 0.001;

  updateAspect(renderer, camera);

  objects.forEach((obj) => {
    obj.rotation.y = time;
  });

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
