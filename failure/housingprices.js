var map2 = L.map('map2').setView([37.8, -96], 4);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map2);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map2) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  var contents = props
    ? `<b>${props.Name}</b><br />Housing Value: $${props.medianhousingValue}`
    : 'Hover over a state';
  this._div.innerHTML = `<h4>US Housing Value</h4>${contents}`;
};

info.addTo(map2);

// get color depending on housing value
function getColor(d) {
    return d > 600000 ? '#084081' :
           d > 500000 ? '#0868ac' :
           d > 400000 ? '#2b8cbe' :
           d > 300000 ? '#4eb3d3' :
           d > 200000 ? '#7bccc4' :
           d > 100000 ? '#a8ddb5' :
                        '#ccebc5';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.medianhousingValue)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();

    info.update(layer.feature.properties);
}

/* global statesData */
var geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

map.attributionControl.addAttribution('Housing Value data &copy; <a href="https://worldpopulationreview.com/state-rankings/median-home-price-by-state">World Population Review</a>');

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map2) {

    var div = L.DomUtil.create('div', 'info legend');
    var grades = [100000, 200000, 300000, 400000, 500000, 600000, 700000];
    var labels = [];

    for (let i = 0; i < grades.length; i++) {
        labels.push(
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            '$' + grades[i] + (grades[i + 1] ? '&ndash;$' + grades[i + 1] + '<br>' : '+'));
    }

    div.innerHTML = labels.join('');
    return div;
};

legend.addTo(map2);
