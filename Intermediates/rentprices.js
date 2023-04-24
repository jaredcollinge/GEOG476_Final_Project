const map = L.map('map').setView([37.8, -96], 5);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// control that shows state info on hover
const info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  const contents = props
    ? `<b>${props.Name}</b><br />Housing Value: $${props.medianRent}`
    : 'Hover over a state';
  this._div.innerHTML = `<h4>US Housing Value</h4>${contents}`;
};

info.addTo(map);

// get color depending on housing value
function getColor(d) {
    return d > 1400 ? '#084081' :
           d > 1200 ? '#0868ac' :
           d > 1000 ? '#2b8cbe' :
           d > 800 ? '#4eb3d3' :
           d > 700 ? '#7bccc4' :
           d > 600 ? '#a8ddb5' :
                     '#ccebc5';
  }

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.medianRent)
    };
}

function highlightFeature(e) {
    const layer = e.target;

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
const geojson = L.geoJson(statesData, {
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

const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    const div = L.DomUtil.create('div', 'info legend');
    const grades = [600, 700, 800, 1000, 1200, 1400];
    const labels = [];

    for (let i = 0; i < grades.length; i++) {
        labels.push(
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            '$' + grades[i] + (grades[i + 1] ? '&ndash;$' + grades[i + 1] + '<br>' : '+'));
    }

    div.innerHTML = labels.join('');
    return div;
};

legend.addTo(map);
