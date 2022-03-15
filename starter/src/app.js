// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Loader } from '@googlemaps/js-api-loader';

const apiOptions = {
  "apiKey": "YOUR_API_KEY",
  "version": "beta"
};

const mapOptions = {
  "zoom": 18,
  "center": { lat: 35.6594945, lng: 139.6999859 },
  "mapId": "YOUR_MAP_ID"
}

async function initMap() {    
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load()      
  return new google.maps.Map(mapDiv, mapOptions);
}

function initWebGLOverlayView (map) {
  let scene, renderer, camera, loader;
  // WebGLOverlayView code goes here
}

(async () => {        
  const map = await initMap();
})();