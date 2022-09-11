import * as THREE from 'three'
import { Sprite } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SpriteFlipbook } from './SpriteFlipbook';
import { SpriteCharacterController } from './SpriteCharacterControl';
// import * as AMMO from './node_modules/ammo-js/ammo-wasm.js';
// import * as ENABLE from 'enable3d'

const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 500, 1000 );
camera.position.set( 0, 0, 5);

const scene = new THREE.Scene();
scene.background = new THREE.Color( 'black' );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}
)

const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 1;
controls.maxDistance = 20;

const geometry = new THREE.BoxGeometry( 1, 2.5, -1 );
const material = new THREE.MeshBasicMaterial( { color: 'orange' });
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
cube.position.set(3,0,0);

const geometry1 = new THREE.BoxGeometry( 1, 2.5, -1 );
const material1 = new THREE.MeshBasicMaterial( { color: 'pink' });
const cube1 = new THREE.Mesh( geometry1, material1 );
scene.add( cube1 );
cube1.position.set(17.5,0,0);

const flipBook = []
var chat = new SpriteFlipbook('./assets/MeowKnight/Meow-Knight_Idle.png', 1, 6, scene);

chat.loop([0,1,2,3,4,5], 1);
flipBook.push(chat);
chat.setPosition(-2.5,-1,0);

// var charRun = new SpriteFlipbook('./assets/MeowKnight/Meow-Knight_Run.png', 1, 10, scene);
// charRun.loop([0,1,3,4,5,6,8,9], 1);
// flipBook.push(charRun);

// chat.position.set(0,5,0);
// const spriteController = new SpriteCharacterController(camera, controls, scene);

const clock = new THREE.Clock();

let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

let currentPositon;
let pageEnd = [false, false, false];
let currentPage = 1;

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

function onKeyDown(event) {
    // console.log('keypress');
    // debugger
    let keyCode = event.which;
    if (keyCode == 37) { // Left arrow key
        leftPressed = true;
    } else if (keyCode == 38) {
        upPressed = true;
    } else if (keyCode == 39) {
        rightPressed = true;
    } else if (keyCode == 40) { // Right arrow key
        downPressed = true;
    } 
}

function onKeyUp(event) {
    let keyCode = event.which;
    if (keyCode == 37) { // Left arrow ke
        leftPressed = false;
    } else if (keyCode == 38) {
        upPressed = false;
    }  else if (keyCode == 39) { // Right arrow key
        rightPressed = false;
    } else if (keyCode == 40) {
        downPressed = false;
    }   
}

function checkKeys() {
    if (leftPressed) {
        console.log("nice");
        chat.addPosition(-0.02,0,0); 
        currentPositon = Math.floor(chat.getPosition().x);
    }  else if (rightPressed) {
        console.log("not nice")
        chat.addPosition(+0.1,0,0);
        currentPositon = Math.floor(chat.getPosition().x);
    } else if (upPressed) {
        console.log("hotnice")
        chat.addPosition(0,0.02,0);
    } else if (downPressed) {
        console.log("LOPPPED")
        chat.addPosition(0, -0.02, 0);
    }
}


function checkPageEnd(currPosition, currPage) {
    // console.log(currPosition);
    if(currPosition > 2 && currPage == 1){
        // console.log("BOOM BOOM");
        pageEnd[0] = true;
    } else if (currPosition > 16 && currPage == 2){
        pageEnd[1] = true;
    }
}

function newPage() {
    if(pageEnd[0]){
        chat.setPosition(12,-1,0);
        controls.target = chat.getPosition();
        camera.position.x = chat.getPosition().x+2.5;
        cube.position.set(12,0,0);
        // camera.position.y = chat.getPosition().y;
        pageEnd[0] = false;
        currentPage = 2;
    } else if (pageEnd[1]){
        chat.setPosition(24,-1,0);
        controls.target = chat.getPosition();
        camera.position.x = chat.getPosition().x+2.5;
        cube1.position.set(24,0,0);
        // camera.position.y = chat.getPosition().y;
        pageEnd[1] = false;
        currentPage = 3;
    }
}


function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );

    let deltaTime = clock.getDelta();
    // spriteController.update(deltaTime);
    flipBook.forEach(s => s.update(deltaTime));

    checkKeys();
    checkPageEnd(currentPositon, currentPage);
    newPage();
    

    // controls.target = chat.getPosition();
    // camera.position.x = chat.getPosition().x+4;
    // camera.position.y = chat.getPosition().y;

    
};

animate();