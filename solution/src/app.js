import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const apiOptions = {
  "apiKey": 'YOUR_API_KEY',
  "version": "beta",
  "map_ids": "15431d2b469f209e"
};

const mapOptions = {
  "tilt": 0,
  "heading": 0,
  "zoom": 18,
  "center": { lat: 35.6594945, lng: 139.6999859 },
  "mapId": "15431d2b469f209e"    
}

async function initMap() {    
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load()      
  return new google.maps.Map(mapDiv, mapOptions);
}


async function initWebglOverlayView (map) {  
  let scene, renderer, camera, loader;
  const webglOverlayView = new google.maps.WebglOverlayView();
  
  webglOverlayView.onAdd = () => {   
    // set up the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
    scene.add( ambientLight );
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);
    
    const helper = new THREE.DirectionalLightHelper( directionalLight, 50, 0x000000 );    
    scene.add( helper );

    // load the model    
    loader = new GLTFLoader();               
    loader.load(
      "pin.gltf",
      gltf => {      
        gltf.scene.scale.set(25,25,25);
        gltf.scene.rotation.x = 180 * Math.PI/180; // rotations are in radians
        scene.add(gltf.scene);           
      }
    );
  }
  
  webglOverlayView.onContextRestored = (gl) => {        
    // create the three.js renderer, using the
    // maps's WebGL rendering context.
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });

    renderer.autoClear = false;
    renderer.autoClearDepth = false;
    renderer.shadowMap.enabled = true;

    // provide the renderer with information about the viewport
    const { width, height, clientWidth } = gl.canvas;
    renderer.setPixelRatio(width / clientWidth);
    renderer.setSize(width, height, false);      

    // wait to move the camera until the 3D model loads
    
    loader.manager.onLoad = () => {        
      renderer.setAnimationLoop(() => {
        webglOverlayView.requestRedraw();
          map.moveCamera({
            "tilt": mapOptions.tilt,
            "heading": mapOptions.heading,
            "zoom": mapOptions.zoom
          });            
          
          // rotate the map 360 degrees 
          if (mapOptions.tilt < 67.5) {
            mapOptions.tilt += 0.5
          } else if (mapOptions.heading <= 360) {
            mapOptions.heading += 0.2;              
            mapOptions.zoom -= 0.0005;
          } else {
            renderer.setAnimationLoop(null)
          }
      });        
    }
  }

  webglOverlayView.onDraw = (gl, transformer) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map     
    const matrix = transformer.fromLatLngAltitude(mapOptions.center, 120);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
    
    webglOverlayView.requestRedraw();      
    renderer.render(scene, camera);                  

    // always reset the GL state
    renderer.state.reset();
  }
  webglOverlayView.setMap(map);
  return webglOverlayView;
}

(async () => {        
  const map = await initMap();
  const webglOverlayView = await initWebglOverlayView(map);  
})();