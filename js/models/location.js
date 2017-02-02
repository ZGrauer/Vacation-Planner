/**
 * @description Model representing a location.
 * @param  {Object} data json with name, address, city, state, zip, country, location lat & lng
 * @returns {Object} location instance
 */
var Location = function(data) {
    var self = this;
    self.name = ko.observable(data.name);
    self.address = ko.observable(data.address);
    self.city = ko.observable(data.city);
    self.state = ko.observable(data.state);
    self.zip = ko.observable(data.zip);
    self.country = ko.observable(data.country);
    self.location = ko.observable(data.location);
    // Map marker for the location
    self.marker = new google.maps.Marker({
        map: gMaps.map,
        position: new google.maps.LatLng(self.location().lat, self.location().lng),
        animation: google.maps.Animation.DROP,
        title: self.name()
    });
    // Observables for Info Window data
    self.placeHtmlData = ko.observable('<div id="place-div"><h4>Google Place Details</h4>Getting Google info...<div class="loader"></div></div>');
    self.wikiHtmlData = ko.observable('<div id="wiki-div"><h4>Wiki Articles</h4><br>Getting articles...<div class="loader"></div></div>');
    self.streetViewData = ko.observable('<div id="streetview-img-div">Getting Google Streetview pic...<div class="loader"></div></div>');
    // Computed observable for all Info Window HTML
    self.infoWindowContent = ko.computed(function() {
        return '<h3>' + self.name() + '</h3>' +
            self.address() + '<br>' +
            self.city() + ', ' + self.state() + ' ' + self.zip() +
            self.placeHtmlData() +
            self.wikiHtmlData() +
            self.streetViewData();
    }, self);


    // Updates the Google Info Window when the computed observable updates
    self.infoWindowContent.subscribe(function() {
        self.setInfoWindowContent();
    });


    /**
     * @description Sets the content of the Google Info Window
     * to the computed observable 'infoWindowContent'
     */
    self.setInfoWindowContent = function() {
        gMaps.infowindow.setContent(self.infoWindowContent());
    };


    /**
     * @description Sets default data in the map's Info Window and opens it.
     * Calls functions to get Google Place & Streetview data async based on the location.
     * Calls wiki function to async get aritcles for location
     */
    self.getInfoWindowContent = function() {
        // Metadata URL for Google streetview
        var streetviewMetaDataUrl = 'https://maps.googleapis.com/maps/api/streetview/metadata?size=400x400&location=' +
            self.location().lat + ', ' +
            self.location().lng +
            '&key=' + gMaps.googleApiKey;

        // Set content for InfoWindow before ajax & open
        self.setInfoWindowContent();
        gMaps.infowindow.setAnchor(self.marker);
        gMaps.infowindow.open(self.marker.get('map'), self.marker);

        // Make selected marker bounce
        self.marker.setAnimation(google.maps.Animation.BOUNCE);

        // Get Google Place details & set observable
        gMaps.setPlaceDetails(self.marker, self.placeHtmlData);

        // Ajax call to get & set observable
        gMaps.setStreetviewImg(streetviewMetaDataUrl, self.streetViewData);

        // Ajax call to get Wiki articles and set observable
        new Wiki().getWikiData(self.name(), self.wikiHtmlData);
    };


    /**
     * @description Sets a click event listener on the location's marker.
     * When triggered opens the Info Window
     */
    self.addMarkerListener = function() {
        // Add a listener for a click on the new marker
        // Build and open an InfoWindow
        self.marker.addListener('click', function() {
            //Stop any previous marker from bouncing
            gMaps.stopCurrMarkerAnimation();
            // Set new active marker.  Used to track bouncing
            gMaps.currMarker = self.marker;
            self.getInfoWindowContent();
        });
    };


    /**
     * @description Sets the icon for the locations map marker.
     * If no URL was passed, it uses the default red icon.
     * @param  {type} iconUrl URL for icon image to use on Marker
     */
    self.setIcon = function(iconUrl) {
        iconUrl = iconUrl || {
            url: 'http://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png&amp;scale=1'
        };
        self.marker.setIcon(iconUrl);
    };
};
