/**
 * @description Represents a Google Maps API instance, including Streetview and Places data
 */
var GoogleMaps = function() {
    var self = this;
    this.map;
    this.infowindow;
    this.geocoder;
    this.placeService;
    this.currMarker;
    // Enter your personal Google API key here
    // https://developers.google.com/maps/documentation/javascript/get-api-key
    this.googleApiKey = "AIzaSyB_AMvD-EHQYqW9nSE-0MXaKSVCi64ri94"

    var wiki = new Wiki();

    /**
     * @description Initializes the Map in the #map div, Places service, and infoWindow.  This is run as a callback on the google <script> tag
     */
    this.initMap = function() {
        map = new google.maps.Map($('#map')[0], {
            zoom: 13,
            center: {
                lat: 36.1213,
                lng: -115.1712
            }
        });
        placeService = new google.maps.places.PlacesService(map);
        infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(map, 'click', function() {
            infowindow.close();
            self.stopCurrMarkerAnimation();
        });
    };

    /**
     * @description Creates a Marker instance for the Location.
     * Adds a click listener on the new marker to open an info window.
     * The listener builds content for the infowindow.
     * @summary Adds a Marker to the map
     * @param {Object} Location instance from the model. Passed from ViewModel
     * @returns {Object} a new google.maps.Marker instance.
     */
    this.addMarker = function(location) {
        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(location.location().lat, location.location().lng),
            animation: google.maps.Animation.DROP,
            title: location.name()
        });
        marker.name = location.name();
        marker.address = location.address() + ', ' + location.city() + ', ' + location.state() + ' ' + location.zip() + ', ' + location.country();

        // Add a listener for a click on the new marker
        // Build and open an InfoWindow
        google.maps.event.addListener(marker, 'click', (function(marker, map) {
            return function() {
                //Stop any previous marker from bouncing
                self.stopCurrMarkerAnimation();
                // Set new active marker.  Used to track bouncing
                self.currMarker = marker;
                // Metadata URL for Google streetview
                var streetviewMetaDataUrl = 'https://maps.googleapis.com/maps/api/streetview/metadata?size=400x400&location=' +
                    marker.position.lat() + ', ' +
                    marker.position.lng() +
                    '&key=' + self.googleApiKey;


                // Set default InfoWindow data. This will be displated even if call to google isn't finished
                var InfoWindowContent = '<h3>' + marker.name + '</h3>' +
                    marker.address +
                    '<div id="place-div"><h4>Google Place Details</h4>Getting Google info...<div class="loader"></div></div>' +
                    '<div id="wiki-div"><h4>Wiki Articles</h4><br>Getting articles...<div class="loader"></div></div>' +
                    '<div id="streetview-img-div">Getting Google Streetview pic...<div class="loader"></div></div>';
                // Set standard content for InfoWindow before ajax & open
                infowindow.setContent(InfoWindowContent);
                infowindow.setAnchor(marker);
                infowindow.open(map, marker);
                // Make selected marker bounce
                marker.setAnimation(google.maps.Animation.BOUNCE);
                // Add listener for InfoWindow close to stop bounce
                google.maps.event.addListener(infowindow, 'closeclick', (function(marker) {
                    return function() {
                        self.stopCurrMarkerAnimation();
                    };
                })(marker));

                // Get Google Place details & add to info window
                self.setPlaceDetails(marker);

                // Ajax call to get & set Streetview img
                self.setStreetviewImg(streetviewMetaDataUrl);

                // Ajax call to get Wiki articles and set in Info window
                wiki.getWikiData(marker.name);
            }
        })(marker, map));
        return marker;
    };


    /**
     * @description Triggers a 'click' event on the map marker passed to it.
     * @param  {Object} marker google.maps.Marker instance
     */
    this.clickMarker = function(marker) {
        google.maps.event.trigger(marker, 'click');
    };



    /**
     * @description Sets visibility property to false on all markers passed to it.
     * @param  {Array.Object} markers google.maps.Marker instances
     */
    this.hideMarkers = function(markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(false);
        }
    };


    /**
     * @description Sets visibility property to true on all markers passed to it.
     * @param  {Array.Object} markers google.maps.Marker instances
     */
    this.showMarkers = function(markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(true);
        }
    };


    /**
     * @description Stops any animation on the marker passed to it.
     * @param  {Object} markers google.maps.Marker instance
     */
    this.stopCurrMarkerAnimation = function(marker) {
        if (self.currMarker) {
            self.currMarker.setAnimation(null);
        }
    };


    /**
     * @description Closes the InfoWindow instance
     */
    this.closeInfoWindow = function() {
        infowindow.close();
    };


    /**
     * @description Gets and sets the Google Streetview image using ajax in
     * the info Window for the active marker. Sets a Bootstrap alert if the ajax call fails.
     * When data is returned the DOM is appended to #streetview-img-div.
     * @param  {string} streetviewMetaDataUrl URL for the Streetview ajax call containing the size, location, and key params.
     */
    this.setStreetviewImg = function(streetviewMetaDataUrl) {
        $.getJSON(streetviewMetaDataUrl)
            // If ajax is done, check returned status
            .done(function(json) {
                // Google has valid image for address.
                // Get image and update InfoWindow
                if (json.status === 'OK') {
                    // Get image based on metadata lat and lng
                    var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=300x300&location=' +
                        json.location.lat + ', ' +
                        json.location.lng +
                        '&key=' + self.googleApiKey;
                    $('#streetview-img-div').html('<img class="img-fluid" src="' + streetviewUrl + '">');
                    console.log('Got Streetview image.  Updating InfoWindow...');
                } else {
                    // Status is an error.  https://developers.google.com/maps/documentation/streetview/metadata#status-codes
                    console.log('Streetview status: ' + json.status);
                    console.log('Streetview error: ' + json.error_message);

                    $('#streetview-img-div').attr('role', 'alert').addClass('alert alert-danger').html('' +
                        '<strong>ERROR!</strong> Unable to get Streetview image.<br>' +
                        json.status + ' </div>');
                }
            })
            .fail(function() {
                // Ajax for Streetview metadata failed.
                console.log('ERROR! Unable to get streetview image.');
                $('#streetview-img-div').attr('role', 'alert').addClass('alert alert-danger').html('' +
                    '<strong>ERROR!</strong> Failed to get Streetview data. </div>');
            });
    };


    /**
     * @description Gets and sets the Google Place details using an ajax call.
     * The data is appended to the DOM in the active Info Window to element #place-div.
     * @param  {Object} marker google.maps.Marker instance. Used for lat and lng.
     */
    this.setPlaceDetails = function(marker) {
        // Setup places request
        var request = {
            location: {
                'lat': marker.position.lat(),
                'lng': marker.position.lng()
            },
            radius: '500',
            query: marker.name
        };

        // Get Place ID for future Places data query
        placeService.textSearch(request, idSearchCallback);


        /**
         *@description Callback function for the Google Places textsearch function to find Place ID.
         * If a valid place ID is found, it requests place details using the getDetails function.
         * If the status isn't OK, appends a Bootstrap alert to #streetview-img-div in the Info Window.
         *
         * @param  {Object} results json containg query results
         * @param  {Object} status  metadata on the request
         */
        function idSearchCallback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var currPlace = {
                    placeId: results[0].place_id
                };
                placeService.getDetails(currPlace, detailsCallback);
            } else {
                $('#streetview-img-div').attr('role', 'alert').addClass('alert alert-danger').html('' +
                    '<strong>ERROR!</strong> Failed to get Google Place ID </div>');
            }
        }


        /**
         * @description Callback function for the Google Places getDetails function.
         * Appends all data to #place-div within the Info Window.
         * @param  {Object} place  json containing all PLace details.
         */
        function detailsCallback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                $('#place-div').html('');
                if (place.icon) {
                    $('#place-div').append('<h4>Google Place Details <img src="' + place.icon +
                        '"height="15" width="15" /></h4>');
                } else {
                    $('#place-div').append('<h4>Google Place Details</h4>');
                }
                if (place.website) {
                    // RegExp match used to display URL.  Some were causing scolling InfoWindow
                    // Displayed link only shows 'https://www.example.com', href is full path
                    $('#place-div').append('<br><b><span class="glyphicon glyphicon-link"></span>: </b><a target="_blank" href="' + place.website + '">' +
                        place.website.match(/^(http[s]?:\/)?\/?([^:\/\s]+)/g) + '</a>');
                }
                if (place.formatted_phone_number) {
                    $('#place-div').append('<br><b><span class="glyphicon glyphicon-phone-alt"></span>: </b>' + place.formatted_phone_number);
                }
                if (place.rating) {
                    $('#place-div').append('<br><b><span class="glyphicon glyphicon-star"></span>: </b>' + place.rating);
                }

                // See if the place is open or closed now
                if (typeof(place.opening_hours.open_now) === 'boolean' && place.opening_hours.open_now === false) {
                    $('#place-div').append('<br><b><span class="glyphicon glyphicon-time"></span></span>: </b>Closed now');

                } else if (place.opening_hours.open_now === true) {
                    $('#place-div').append('<br><b><span class="glyphicon glyphicon-time"></span></span>: </b>Open now');
                }
                // Get the place's hours of business today.
                var hoursToday = getOpenHours(place.opening_hours.weekday_text);
                if (hoursToday) {
                    $('#place-div').append('<br>' + hoursToday);
                }
            } else {
                $('#place-div').attr('role', 'alert').addClass('alert alert-danger').html('' +
                    '<strong>ERROR!</strong> Failed to get Google Place details </div>');
            }


            /**
             * @description Gets today's open hours.
             * @param  {Array.string} placeHours Array of strings containing the place open hours each day of the week.
             * @return {string} Place hours of business today.
             */
            function getOpenHours(placeHours) {
                var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var weekday = weekdays[new Date().getDay()];
                if (placeHours) {
                    for (var i = 0; i < placeHours.length; i++) {
                        if (placeHours[i].includes(weekday)) {
                            return placeHours[i].slice(placeHours[i].indexOf(':') + 1);
                        }
                    }
                }
            }
        }
    };
};


/**
 * @description Is called by Google for Auth on map API err.
 * Appends a Bootstrap alert to the #map div on any auth errors.
 */
function gm_authFailure() {
    alert('Unable to load Google Maps API. Authentication error');
    $('#map').append('<div class="alert alert-danger" style="margin-top:200px;" role="alert"><strong>ERROR!</strong> Unable to load Google Maps.</div>');
};
