/* eslint-disable */
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
    projection: 'globe', // display the map as a 3D globe
});

map.addControl(new mapboxgl.NavigationControl());


const markerHeight = 50;
const markerRadius = 10;
const linearOffset = 25;
const popupOffsets = {
    'top': [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    'bottom': [0, -markerHeight],
    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'left': [markerRadius, (markerHeight - markerRadius) * -1],
    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
};

const popup = new mapboxgl.Popup({offset: popupOffsets, className: 'mapbox-popup' })
    .setLngLat(campground.geometry.coordinates)
    .setHTML(`<h6>${campground.title}</h6><p>${campground.location}</p>`)
    .setMaxWidth("300px")
    .addTo(map);

const el = document.createElement('div');
el.id = 'marker';
const marker = new mapboxgl.Marker(el)
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});
