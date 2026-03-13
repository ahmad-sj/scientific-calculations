import * as THREE from "three";
import { updateAspect, DegRadHelper, StringToNumberHelper } from "~/helpers";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
camera.position.set(0, 0, 5);

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const objects = [];

const loader = new THREE.TextureLoader();
const texture = loader.load("resources/images/wall.jpg");
texture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshBasicMaterial({ map: texture });

const geometry = new THREE.BoxGeometry();

const cube1 = new THREE.Mesh(geometry, material);
scene.add(cube1);
objects.push(cube1);

function loadColorTexture(path) {
  const texture = loader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const materials = [];

for (let index = 1; index <= 6; index++) {
  materials.push(
    new THREE.MeshBasicMaterial({
      map: loadColorTexture(`resources/images/flower-${index}.jpg`),
    }),
  );
}

const cube2 = new THREE.Mesh(geometry, materials);
cube2.position.x = 2;
scene.add(cube2);
objects.push(cube2);

const texture2 = loader.load("resources/images/triangles.jpg");
texture2.colorSpace = THREE.SRGBColorSpace;

texture2.wrapS = THREE.RepeatWrapping;
// texture2.wrapT = THREE.RepeatWrapping;
// texture2.wrapT = THREE.ClampToEdgeWrapping;
texture2.wrapT = THREE.MirroredRepeatWrapping;

const timesToRepeatHorizontally = 3;
const timesToRepeatVertically = 3;

texture2.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);

const xOffset = 0.5; // offset by half the texture
const yOffset = 0.25; // offset by 1/4 the texture
texture2.offset.set(xOffset, yOffset);

texture2.center.set(0.5, 0.5);
texture2.rotation = THREE.MathUtils.degToRad(45);

const material2 = new THREE.MeshBasicMaterial({ map: texture2 });

const cube3 = new THREE.Mesh(geometry, material2);
cube3.position.x = -2;
scene.add(cube3);
objects.push(cube3);

const wrapModes = {
  ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
  RepeatWrapping: THREE.RepeatWrapping,
  MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
};

function updateTexture() {
  texture.needsUpdate = true;
}

const gui = new GUI();
gui
  .add(new StringToNumberHelper(texture, "wrapS"), "value", wrapModes)
  .name("texture.wrapS")
  .onChange(updateTexture);
gui
  .add(new StringToNumberHelper(texture, "wrapT"), "value", wrapModes)
  .name("texture.wrapT")
  .onChange(updateTexture);
gui.add(texture.repeat, "x", 0, 5, 0.01).name("texture.repeat.x");
gui.add(texture.repeat, "y", 0, 5, 0.01).name("texture.repeat.y");
gui.add(texture.offset, "x", -2, 2, 0.01).name("texture.offset.x");
gui.add(texture.offset, "y", -2, 2, 0.01).name("texture.offset.y");
gui.add(texture.center, "x", -0.5, 1.5, 0.01).name("texture.center.x");
gui.add(texture.center, "y", -0.5, 1.5, 0.01).name("texture.center.y");
gui
  .add(new DegRadHelper(texture, "rotation"), "value", -360, 360)
  .name("texture.rotation");

function animate(time) {
  // converting from milliseconds to seconds
  time *= 0.001;

  updateAspect(renderer, camera);

  objects.forEach((cube) => {
    cube.rotation.x = time;
    cube.rotation.y = time;

    renderer.render(scene, camera);
  });
}

renderer.setAnimationLoop(animate);
