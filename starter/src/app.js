import { Loader } from '@googlemaps/js-api-loader';

const apiOptions = {
  "apiKey": "YOUR_API_KEY",
  "version": "beta",
  "map_ids": "YOUR_MAP_ID"
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

async function initWebglOverlayView (map) {

  // WebGLOverlayView code goes here

}

(async () => {        
  const map = await initMap();
})();