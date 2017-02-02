/**
 * @description Represents a Knockoutjs ViewModel instance
 */
var ViewModel = function() {
    var self = this;

    self.locations = ko.observableArray([]); // Array of location
    self.currentFilter = ko.observable(''); // Current filter on UI
    self.pageTitle = ko.observable('Vacation Planner Map'); //Header title
    self.locationsTitle = ko.observable('Locations'); //Locations div heading
    self.sortedlocations = ko.computed(function() {
        return self.locations().sort(function(l, r) {
            return (l.city() === r.city()) ? (l.name() > r.name() ? 1 : -1) : (l.name() > r.name() ? 1 : -1);
        });
    });



    /**
     * @description Loads locations from 'locations.json' file
     * Creates Location instances in the Model and adds them as markers.
     * Locations are all saved to the locations observableArray
     */
    self.loadLocations = function() {
        if (typeof google === 'object' && typeof google.maps === 'object') {
            // Read location data from json file
            $.getJSON("locations.json")
                .done(
                    function(json) {
                        for (var i = 0; i < json.locations.length; i++) {
                            var currLocation = new Location(json.locations[i]);
                            currLocation.marker.name = currLocation.name();
                            currLocation.addMarkerListener();
                            self.locations.push(currLocation);
                        }
                        console.log('Markers added to map.  Ready...');
                    }
                )
                .fail(function() {
                    $('#map').append('<div class="alert alert-danger" style="margin-top:200px;" role="alert"><strong>ERROR!</strong> Unable to load location data.</div>');
                    $('.location-list').hide();
                });

        }
    };


    /**
     * @description calls a google function to click a map marker, which
     * opens an Info Window
     */
    self.clickMarker = function(location) {
        gMaps.clickMarker(location.marker);
    };


    var panMap;
    /**
     * @description Changes the marker icon to blue when hovering on the list item
     * @param  {Object} location Location being hovered from list group
     * @param  {Object} data     Knockout event data
     */
    self.hoverLocationLink = function(location, data) {
        if (data.type == "mouseover") {
            panMap = setTimeout(function() {
                gMaps.map.panTo(location.marker.getPosition());
            }, 500)
            location.setIcon("http://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png");
        } else {
            clearTimeout(panMap);
            location.setIcon();
        }
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
            return self.sortedlocations();
        } else {
            var filteredList = ko.utils.arrayFilter(self.sortedlocations(), function(location) {
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
     * @description Generates a list of locations to display in the UI list-group.
     * @returns {Array.Array} array of location objects arrays.
     * The nested array has locations sorted by city so they can be displayed sorted on the UI.
     */
    self.distinctCities = ko.computed(function() {
        var cities = ko.utils.arrayMap(self.filterLocations(), function(location) {
            return location.city();
        });

        cities = ko.utils.arrayGetDistinctValues(cities);

        var cityLocationArray = [];
        for (var i = 0; i < cities.length; i++) {
            var cityLocations = ko.utils.arrayFilter(self.filterLocations(), function(location) {
                return (location.city().toLowerCase().indexOf(cities[i].toLowerCase()) >= 0);
            });
            cityLocationArray.push(cityLocations);
        }
        return cityLocationArray;
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
