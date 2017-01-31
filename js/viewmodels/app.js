/**
 * @description Represents a Knockoutjs ViewModel instance
 */
var ViewModel = function() {
    var self = this;

    self.locations = ko.observableArray([]); // Array of location
    self.currentFilter = ko.observable(''); // Current filter on UI
    self.pageTitle = ko.observable('Vacation Planner Map'); //Header title
    self.locationsTitle = ko.observable('Locations'); //Locations div heading


    /**
     * @description Loads locations from the Model and adds them as markers.
     * Locations are all saved to the locations observableArray
     */
    self.loadLocations = function() {
        if (typeof google === 'object' && typeof google.maps === 'object') {
            for (var i = 0; i < mapAddresses.length; i++) {
                var currLocation = new Location(mapAddresses[i]);
                currLocation.marker.name = currLocation.name();
                currLocation.addMarkerListener();
                self.locations.push(currLocation);
            }
            console.log('Markers added to map.  Ready...');
        }
    };


    /**
     * @description calls a google function to click a map marker, which
     * opens an Info Window
     */
    self.clickMarker = function(location) {
        gMaps.clickMarker(location.marker);
    };


    /**
     * @description Generates a list of locations to display in the UI list-group.
     * If a filter isn't used, then returns all locations.
     * If a filter is used, then returns a new locations list based on location name.
     * Also hides and shows map markers based on filter.
     * @returns {Object} List of locations based on filtered name
     */
    self.filterLocations = ko.computed(function() {
        if (!self.currentFilter()) {
            return self.locations();
        } else {
            var filteredList = ko.utils.arrayFilter(self.locations(), function(location) {
                return (location.name().toLowerCase().indexOf(self.currentFilter().toLowerCase()) >= 0) ||
                    (location.city().toLowerCase().indexOf(self.currentFilter().toLowerCase()) >= 0) ||
                    (location.zip().toLowerCase().indexOf(self.currentFilter().toLowerCase()) >= 0);
            });
            gMaps.hideMarkers(self.getMarkers(self.locations()));
            gMaps.closeInfoWindow();
            gMaps.showMarkers(self.getMarkers(filteredList));
            return filteredList;
        }
    });


    /**
     * @description Gets an array of map markers from the passed locations.
     * @param  {Array.Object} locationList Array of location objects.  Each contains a marker.
     * @returns {Array.Object} Array of map Markers
     */
    self.getMarkers = function(locationList) {
        var markers = [];
        for (var i = 0; i < locationList.length; i++) {
            markers.push(locationList[i].marker);
        }
        return markers;
    };


    /**
     * @description Clears the filter on the UI and shows all map markers.
     * @param  {Array.Object} locations Array of all locations to display
     */
    self.clearFilter = function(locations) {
        self.currentFilter("");
        gMaps.showMarkers(self.getMarkers(locations()));
    };

    // Enable Bootstrap tooltips
    $('[data-toggle="tooltip"]').tooltip();
    // Toggle the collapse button text on Bootstrap events
    $('#location-div').on('hide.bs.collapse', function() {
        $('#collapse-btn').html('<span class="glyphicon glyphicon-collapse-down"></span> Open');
    });
    $('#location-div').on('show.bs.collapse', function() {
        $('#collapse-btn').html('<span class="glyphicon glyphicon-collapse-up"></span> Close');
    });

    // Set a listener on the width for small screens
    if (matchMedia) {
        var mediaQuery = window.matchMedia('(max-width: 768px)');
        mediaQuery.addListener(WidthChange);
        WidthChange(mediaQuery);
    }
    // Hide the locations div when the screen is 768px or less
    function WidthChange(mediaQuery) {
        if (mediaQuery.matches) {
            $('#location-div').removeClass('in');
        }
    }


    // Get the Google Maps script. The callback initializes the #map div
    $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyB_AMvD-EHQYqW9nSE-0MXaKSVCi64ri94&libraries=places&callback=gMaps.initMap')
        // If successfull then map is initialized.  Load locations & add markers.
        .done(function(script, textStatus) {
            console.log('Google Maps API loaded. Adding markers');
            self.loadLocations();
        })
        // Failed to initialize map. Add Bootstrap alert to page.
        .fail(function(jqxhr, settings, exception) {
            console.log('Error loading Google Maps API! Exception: ' +
                exception + ' Status: ' + jqxhr.status);
            $('#map').append('<div class="alert alert-danger" style="margin-top:200px;" role="alert"><strong>ERROR!</strong> Unable to load Google Maps.</div>');
            $('.location-list').hide();
        });


};


var gMaps = new GoogleMaps();
ko.applyBindings(new ViewModel());
