var ViewModel = function() {
    var self = this;

    self.locations = ko.observableArray([]);
    self.currentFilter = ko.observable("");
    self.pageTitle = ko.observable("Neighboorhood Map");

    self.clickMarker = function(marker) {
        google.maps.event.trigger(marker, 'click');
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
};

var gMaps = new GoogleMaps();
var koViewmodel = new ViewModel();
ko.applyBindings(koViewmodel);


$.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyB_AMvD-EHQYqW9nSE-0MXaKSVCi64ri94&callback=gMaps.initMap")
    .done(function(script, textStatus) {
        console.log("Google Maps API loaded. Adding markers");
        loadLocations();
    })
    .fail(function(jqxhr, settings, exception) {
        console.log("Error loading Google Maps API! Exception: " +
            exception + " Status: " + jqxhr.status);
        $("#map").append('<div class="alert alert-danger" style="margin-top:200px;" role="alert"><strong>ERROR!</strong> Unable to load Google Maps.</div>');
        $(".location-list").hide();
    });

function loadLocations() {
    if (typeof google === 'object' && typeof google.maps === 'object') {
        for (var i = 0; i < mapAddresses.length; i++) {
            koViewmodel.locations.push(gMaps.addMarker(mapAddresses[i]));
        }
    }
};
