var ViewModel = function() {
    var self = this;

    self.locations = ko.observableArray([]);
    self.currentFilter = ko.observable("");
    self.pageTitle = ko.observable("Vacation Planner Map");
    self.locationsTitle = ko.observable("Locations");

    self.clickMarker = function(marker) {
        gMaps.clickMarker(marker);
    };

    self.filterLocations = ko.computed(function() {
        if (!self.currentFilter()) {
            return self.locations();
        } else {
            var filteredList = ko.utils.arrayFilter(self.locations(), function(location) {
                return location.name.toLowerCase().indexOf(self.currentFilter().toLowerCase()) >= 0;
            });
            gMaps.hideMarkers(self.locations());
            gMaps.closeInfoWindow();
            gMaps.showMarkers(filteredList);
            return filteredList;
        }
    });

    self.clearFilter = function(locations) {
        console.dir(locations);
        self.currentFilter("");
        gMaps.showMarkers(locations());
    }

    $('[data-toggle="tooltip"]').tooltip();
    $("#location-div").on("hide.bs.collapse", function() {
        $("#collapse-btn").html('<span class="glyphicon glyphicon-collapse-down"></span> Open');
    });
    $("#location-div").on("show.bs.collapse", function() {
        $("#collapse-btn").html('<span class="glyphicon glyphicon-collapse-up"></span> Close');
    });

    // Set a listener on the width for small
    if (matchMedia) {
        var mediaQuery = window.matchMedia("(max-width: 768px)");
        mediaQuery.addListener(WidthChange);
        WidthChange(mediaQuery);
    }
    // Hide the locations div when the screen is 768px or less
    function WidthChange(mediaQuery) {
        if (mediaQuery.matches) {
            $("#location-div").removeClass("in");
        }
    }


    // Get the Google Maps script which callback initializes the #map div
    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyB_AMvD-EHQYqW9nSE-0MXaKSVCi64ri94&libraries=places&callback=gMaps.initMap")
        // If successfull then map is initializes.  Load locations. Add markers
        .done(function(script, textStatus) {
            console.log("Google Maps API loaded. Adding markers");
            loadLocations();
        })
        // Failed to initialize map. Add alert to page
        .fail(function(jqxhr, settings, exception) {
            console.log("Error loading Google Maps API! Exception: " +
                exception + " Status: " + jqxhr.status);
            $("#map").append('<div class="alert alert-danger" style="margin-top:200px;" role="alert"><strong>ERROR!</strong> Unable to load Google Maps.</div>');
            $(".location-list").hide();
        });

    // Load locations from the Model. Add them as markers. Add to array.
    function loadLocations() {
        if (typeof google === 'object' && typeof google.maps === 'object') {
            for (var i = 0; i < mapAddresses.length; i++) {
                koViewmodel.locations.push(gMaps.addMarker(mapAddresses[i]));
            }
        }
    };
};


var gMaps = new GoogleMaps();
var koViewmodel = new ViewModel();
ko.applyBindings(koViewmodel);
