var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/meanfirst');         //meanfirst is a Database
var Bear = require('./app/models/bear.js');               //Bear is a Collection ,In Analogy To SQL ,Bear is a Table

app.use(bodyParser.urlencoded({                         // use Body-parser ,to parse incoming data -for url encoding
    extended: true
}));
app.use(bodyParser.json());                             // use Body-parser ,to parse incoming data  - For JSON data

var port = process.env.PORT || 8080; //port
var router = express.Router();                          //Intializing router Instance

router.use(function(req, res, next) {                   //This Function is called everytime an api is called , usefull for retrict the apis based on user
    console.log('call is Logged');
    next();                                             //Program proceeds further only if next() function is called
});

router.route('/bears')                                  //Route is declared first , this We can handle multiple routes with same URI
                                                        //We can chain together different Routes.
.post(function(req, res) {
        var bear = new Bear();                          //Bear is an instance , which intantiates name ,in this case.
        bear.name = req.body.name;                      // POST PARAMETERS   is available in  req.body

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
        Bear.findById(req.params.bear_id, function(err, bear) {   // GET PARAMETERS   is available in  req.params
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



        app.get('/home', function(req, res) {                               //This creates page routes
            res.send('This is the home page.I can set up a html here');
        });

        app.use('/api', router); //To prefix all routes with 'api'
        app.listen(port); // Starting server
        console.log("Sever started at port :" + port);
