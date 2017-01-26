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
            hideMarkers(self.locations());
            showMarkers(filteredList);
            return filteredList;
        }
    });
    self.clearFilter = function(locations) {
        console.dir(locations);
        self.currentFilter("");
        showMarkers(locations());
    }
};

var koViewmodel = new ViewModel();
ko.applyBindings(koViewmodel);

function loadMap() {
    if (typeof google === 'object' && typeof google.maps === 'object') {
        for (var i = 0; i < mapAddresses.length; i++) {
            koViewmodel.locations.push(addMarker(mapAddresses[i]));
        }
    }
};
