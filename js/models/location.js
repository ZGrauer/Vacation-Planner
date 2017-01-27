var Location = function(data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.formatted_address = ko.observable(data.formatted_address);
    this.lat = ko.observable(data.location.lat);
    this.lat = ko.observable(data.location.lng);
};

var mapAddresses = [{
    "address": "4510 Paradise Rd, Las Vegas, NV 89169, USA",
    "name": "Hofbrauhaus Las Vegas",
    "location": {
        "lat": 36.1077,
        "lng": -115.1513
    }
}, {
    "address": "2771 S Industrial Rd, Las Vegas, NV 89109, USA",
    "name": "Battlefield Vegas",
    "location": {
        "lat": 36.1390,
        "lng": -115.1685
    }
}, {
    "address": "6405 Ensworth St, Las Vegas, NV 89119, USA",
    "name": "Carroll Shelby Museum",
    "location": {
        "lat": 36.0719,
        "lng": -115.1791
    }
}, {
    "address": "3377 S Las Vegas Blvd, Las Vegas, NV 89109, USA",
    "name": "Madame Tussauds Las Vegas",
    "location": {
        "lat": 36.1213,
        "lng": -115.1712
    }
}, {
    "address": "3300 S Las Vegas Blvd, Las Vegas, NV 89109, USA",
    "name": "Treasure Island",
    "location": {
        "lat": 36.1247,
        "lng": -115.1721
    }
}, {
    "address": "2000 S Las Vegas Blvd, Las Vegas, NV 89104, USA",
    "name": "Stratosphere",
    "location": {
        "lat": 36.1472,
        "lng": -115.1560
    }
}, {
    "address": "Fremont St, Las Vegas, NV 89101, NV 89109, USA",
    "name": "Fremont Street Experience",
    "location": {
        "lat": 36.1708,
        "lng": -115.1443
    }
}];
