mapboxgl.accessToken =
  "pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w";

const map = new mapboxgl.Map({
  container: "map-container",
  style: "mapbox://styles/noclue4u/cjth43b7477qe1foa6s1n76wv",
  center: [4.6727, 52.5453],
  zoom: 12
});

const container = map.getCanvasContainer();
