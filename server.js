var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/meanfirst');         //meanfirst is a Database
var Bear = require('./app/models/bear.js');               //Bear is a Collection ,In Analogy To SQL ,Bear is a Table
// use Body-parser ,tO parse incoming data
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; //port
var router = express.Router(); //Intializing router Instance

router.use(function(req, res, next) {
    console.log('call is Logged');
    next();
});

router.route('/bears')

.post(function(req, res) {
        var bear = new Bear();
        bear.name = req.body.name;

        bear.save(function(err) {
            if (err) res.send(err);

            res.json({
                message: 'Bear Created!'
            });
        });
    })
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err) res.send(err);
            res.json(bears);
        })

    });

router.route('/bears/:bear_id')
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err) res.send(err);
            res.json(bear);
        });

    })
    .put(function(req, res) {
            Bear.findById(req.params.bear_id, function(err, bear) {
                if (err) res.send(err);

                bear.name = req.body.name;
                bear.save(function(err) {
                    if (err) res.send(err);

                    res.json({
                        message: 'Bear Updated!'
                    });
                });
            });
        })
      .delete(function(req,res){
        Bear.remove({_id:req.params.bear_id},function (err,bear) {
          if(err) res.send(err);
          res.json({msg:'SuccessFully Deleted'})
        });
      });

        router.get('/sd', function(req, res) {
            res.json({
                message: 'Wow Welcome to MY First Api'
            });
            // res.send("Api Hello");
        });



        app.get('/home', function(req, res) {
            res.send('This is the home page.I can set up a html here');
        });

        app.use('/api', router); //To prefix all routes with 'api'
        app.listen(port); // Starting server
        console.log("Sever started at port :" + port);
