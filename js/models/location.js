var Location = function(data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.city = ko.observable(data.city);
    this.state = ko.observable(data.state);
    this.zip = ko.observable(data.zip);
    this.country = ko.observable(data.country);
    this.location = ko.observable(data.location);
};

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
