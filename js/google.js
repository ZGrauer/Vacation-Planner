var GoogleMaps = function() {
    this.map;
    this.infowindow;
    this.geocoder;


    this.initMap = function() {
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

    }


    this.addMarker = function(place) {
        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(place.location.lat, place.location.lng),
            animation: google.maps.Animation.DROP,
            title: place.name
        });
        marker.name = place.name;
        marker.address = place.address;

        // Add a listener for a click on the new marker
        // Build and open an InfoWindow
        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
                // Metadata URL for Google streetview
                var streetviewMetaDataUrl = 'https://maps.googleapis.com/maps/api/streetview/metadata?size=400x400&location=' +
                    marker.address +
                    '&key=AIzaSyB_AMvD-EHQYqW9nSE-0MXaKSVCi64ri94';
                // Set default InfoWindow data. This will be displated even if call to google isn't finished
                var InfoWindowContent = marker.name + '<br>' + marker.address;
                // Ajax call to get Streetview metadata
                $.getJSON(streetviewMetaDataUrl)
                    // If ajax is done, check returned status
                    .done(function(json) {
                        // Google has valid image for address.
                        // Get image and update InfoWindow
                        if (json.status === "OK") {
                            var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=400x400&location=' +
                                marker.address +
                                '&key=AIzaSyB_AMvD-EHQYqW9nSE-0MXaKSVCi64ri94';
                            InfoWindowContent += '<br><img class="img-fluid" src="' + streetviewUrl + '">';
                            console.log("Got Streetview image.  Updating InfoWindow...");
                            infowindow.setContent(InfoWindowContent);
                        } else {
                            // Status is an error.  https://developers.google.com/maps/documentation/streetview/metadata#status-codes
                            console.log("Streetview status: " + json.status);
                            console.log("Streetview error: " + json.error_message);
                            InfoWindowContent += '<div class="alert alert-danger" role="alert"><strong>ERROR!</strong> Unable to get Streetview image.<br>' +
                                json.status + ' </div>';
                            infowindow.setContent(InfoWindowContent);
                        }
                    })
                    .fail(function() {
                        // Ajax for Streetview metadata failed.
                        console.log("ERROR! Unable to get streetview image.");
                        InfoWindowContent += '<div class="alert alert-danger" role="alert"><strong>ERROR!</strong> Failed to get Streetview data. </div>';
                        infowindow.setContent(InfoWindowContent);
                    });

                infowindow.setContent(InfoWindowContent);
                infowindow.open(map, marker);
            }
        })(marker));
        return marker;
    }

    this.hideMarkers = function(markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(false);
        }
    }

    this.showMarkers = function(markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(true);
        }
    }

    this.closeInfoWindow = function() {
        infowindow.close();
    };
};

function gm_authFailure() {
    alert("Unable to load Google Maps API. Authentication error");
};
