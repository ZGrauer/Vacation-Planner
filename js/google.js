var map;
var infowindow;
var geocoder;


function initMap() {
    map = new google.maps.Map($("#map")[0], {
        zoom: 13,
        center: {
            lat: 36.1147,
            lng: -115.1728
        }
    });

    infowindow = new google.maps.InfoWindow();


    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();

    });
    google.maps.event.addListenerOnce(map, 'idle', function() {
        loadMap();
    });
}


function addMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(place.location.lat, place.location.lng),
        animation: google.maps.Animation.DROP,
        title: place.name
    });
    marker.name = place.name;
    marker.address = place.address;

    google.maps.event.addListener(marker, 'click', (function(marker) {
        return function() {
            infowindow.setContent(marker.name + "<br>" + marker.address);
            infowindow.open(map, marker);
        }
    })(marker));
    return marker;

    //var markerCluster = new MarkerClusterer(map, markers);
}

function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(false);
    }
}

function showMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(true);
    }
}
