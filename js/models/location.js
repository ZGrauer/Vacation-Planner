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
            self.address() +
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
};


/**
 * Source json for app.
 */
var mapAddresses = [{
    "address": "4510 Paradise Rd",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89169",
    "country": "USA",
    "name": "Hofbrauhaus",
    "location": {
        "lat": 36.107736,
        "lng": -115.151616
    }
}, {
    "address": "2771 S Industrial Rd",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89109",
    "country": "USA",
    "name": "Battlefield Vegas",
    "location": {
        "lat": 36.139171,
        "lng": -115.168682
    }
}, {
    "address": "6405 Ensworth S",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89119",
    "country": "USA",
    "name": "Carroll Shelby Museum",
    "location": {
        "lat": 36.072177,
        "lng": -115.179944
    }
}, {
    "address": "3377 S Las Vegas Blvd",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89109",
    "country": "USA",
    "name": "Madame Tussauds Las Vegas",
    "location": {
        "lat": 36.121336,
        "lng": -115.171110
    }
}, {
    "address": "3300 S Las Vegas Blvd",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89109",
    "country": "USA",
    "name": "Treasure Island",
    "location": {
        "lat": 36.124647,
        "lng": -115.170851
    }
}, {
    "address": "2000 S Las Vegas Blvd",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89104",
    "country": "USA",
    "name": "Stratosphere",
    "location": {
        "lat": 36.147316,
        "lng": -115.155822
    }
}, {
    "address": "129 Fremont Street Experience",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89101",
    "country": "USA",
    "name": "Fremont Street Experience",
    "location": {
        "lat": 36.1708,
        "lng": -115.1443
    }
}, {
    "address": "1610 E Tropicana Ave",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89119",
    "country": "USA",
    "name": "Pinball Hall of Fame",
    "location": {
        "lat": 36.101349,
        "lng": -115.130567
    }
}, {
    "address": "3600 S Las Vegas Blvd",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89109",
    "country": "USA",
    "name": "Bellagio Hotel and Casino",
    "location": {
        "lat": 36.112972,
        "lng": -115.174151
    }
}, {
    "address": "3655 S Las Vegas Blvd",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89109",
    "country": "USA",
    "name": "Eiffel Tower Experience",
    "location": {
        "lat": 36.112668,
        "lng": -115.171834
    }
}, {
    "address": "3411 S Las Vegas Blvd",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89109",
    "country": "USA",
    "name": "White Castle",
    "location": {
        "lat": 36.120871,
        "lng": -115.171890
    }
}, {
    "address": "3377 S Las Vegas Blvd #2120",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89109",
    "country": "USA",
    "name": "Sin City Brewing Co.",
    "location": {
        "lat": 36.121469,
        "lng": -115.169103
    }
}, {
    "address": "770 N Las Vegas Blvd",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "89101",
    "country": "USA",
    "name": "Neon Museum",
    "location": {
        "lat": 36.176942,
        "lng": -115.135276
    }
}];
