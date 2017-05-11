var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser');
    db              = require('./db');

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var vehicles = db.getInitVehicles();
var loggedInUser = [];
var bids = [];

app.get('/vehicle', function (req, res) {
    response = {
        data: []
    };

    for(var i = 0; i < vehicles.length; i++) {
        var v = vehicles[i];
        v.leadingBid = db.getLeadingBid(bids, v.vehicleMovementId);
        response.data.push(v);
    }

    console.log("Got a GET list request for vehicles");
    res.end(JSON.stringify(response));
});

app.get('/vehicle1k', function (req, res) {
    response = {
        data: []
    };

    for(var j = 0; j < 2; j++){
        for(var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            v.leadingBid = db.getLeadingBid(bids, v.vehicleMovementId);
            response.data.push(v);
        }
    }

    console.log("Got a GET list ver.1k request for vehicles");
    res.end(JSON.stringify(response));
});

app.get('/vehicle2k', function (req, res) {
    response = {
        data: []
    };

    for(var j = 0; j < 4; j++){
        for(var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            v.leadingBid = db.getLeadingBid(bids, v.vehicleMovementId);
            response.data.push(v);
        }
    }

    console.log("Got a GET list ver.2k request for vehicles");
    res.end(JSON.stringify(response));
});

app.get('/vehicle5k', function (req, res) {
    response = {
        data: []
    };

    for(var j = 0; j < 10; j++){
        for(var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            v.leadingBid = db.getLeadingBid(bids, v.vehicleMovementId);
            response.data.push(v);
        }
    }

    console.log("Got a GET list ver.5k request for vehicles");
    res.end(JSON.stringify(response));
});

app.get('/vehicle30k', function (req, res) {
    response = {
        data: []
    };

    for(var j = 0; j < 60; j++){
        for(var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            v.leadingBid = db.getLeadingBid(bids, v.vehicleMovementId);
            response.data.push(v);
        }
    }

    console.log("Got a GET list ver.30k request for vehicles");
    res.end(JSON.stringify(response));
});

app.get('/vehicle50k', function (req, res) {
    response = {
        data: []
    };

    for(var j = 0; j < 100; j++){
        for(var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            v.leadingBid = db.getLeadingBid(bids, v.vehicleMovementId);
            response.data.push(v);
        }
    }

    console.log("Got a GET list ver.50k request for vehicles");
    res.end(JSON.stringify(response));
});

app.get('/vehicle/:id', function (req, res) {
    var id = req.params.id;

    response = {
        data: {}
    };
    if(id){
        for(var i = 0; i < vehicles.length; i++) {
            if (vehicles[i].vehicleMovementId == id) {
                var v = vehicles[i];
                v.leadingBid = db.getLeadingBid(bids, v.vehicleMovementId);
                response.data = v;
                break;
            }
        }
    }

    console.log("Got a GET request for vehicles with ID: " + id);
    res.end(JSON.stringify(response));
});

app.get('/bids/', function (req, res) {
    var name = req.params.name;

    console.log("Got a GET bids request");
    res.end(JSON.stringify(bids));
});

app.get('/bids/:user', function (req, res) {
    var user = req.params.user;

    console.log("Got a GET bids request of user: " + user);
    res.end(JSON.stringify(db.getUserBids(bids, user)));
});

app.post('/bids', function (req, res) {
    var input = req.body;
    var newBid = {
        bidId: 10000 + bids.length,
        vehicleMovementId: input.vehicleMovementId,
        user: input.user,
        amount: input.amount
    }

    var found = false;
    for(var i = 0; i < vehicles.length; i++) {
        if (vehicles[i].vehicleMovementId == input.vehicleMovementId) {
            found = true;
            break;
        }
    }

    if(found){
        var currentBid = db.getLeadingBid(bids, input.vehicleMovementId);
        if( !currentBid || !currentBid.amount ||
            (currentBid && currentBid.amount && currentBid.amount < input.amount) ){
            bids.push(newBid);
            console.log("Post New Bid Request: New high bid: " + JSON.stringify(newBid));
            res.end(JSON.stringify(newBid));
        } else {
            console.log("Post New Bid Request: There is already a higher bid: " + JSON.stringify(currentBid));
            res.end(JSON.stringify(currentBid));
        }
    } else {
        var error = {
            message: "Vehicle not found!"
        };

        console.log("Post New Bid Request: Vehicle not found! " + JSON.stringify(input));
        res.end(JSON.stringify(error));
    }
});

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});
