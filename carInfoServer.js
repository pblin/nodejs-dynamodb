// server.js
// BASE SETUP
// =============================================================================
// call the packages we need

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
//var dynamoDB = require('./app/models/dynamoDB').DynamoDB(credentials)
//var attr = require('dynamodb-data-types').AttributeValue;
//var dynamoDB = require('dynamodb').ddb(credentials);

var AWS = require("aws-sdk");
var request = require('sync-request');
var credentials = { accessKeyId : "",
                    secretKey   : "",
                    region: ""};

var response = request('GET', 'http://169.254.169.254/latest/meta-data/iam/security-credentials/dynamoDBAccess');
var instanceInfo = request('GET', 'http://169.254.169.254/latest/dynamic/instance-identity/document');
var jsonData = JSON.parse(response.body.toString('utf-8'));
var jsonInstanceInfo = JSON.parse(instanceInfo.body.toString('utf-8'));

console.log("region="+jsonInstanceInfo.region);

credentials.accessKeyId = jsonData.AccessKeyId;
credentials.secretKey = jsonData.SecretAccessKey;
credentials.region = jsonInstanceInfo.region;

AWS.config.update(credentials);
var dynamoDB = new AWS.DynamoDB();

AWS.config.update(credentials);
var dynamoDB = new AWS.DynamoDB();
var crypto = require ('crypto');
//var step = require('step');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ limit:"10mb", extended: true }));
app.use(bodyParser.json({limit:"10mb"}));
//app.use(bodyParser());


var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
            res.json({ message: 'api is live' });
  });

router.put('/incident/:hashkey',function(req, res) {
    var hashkey=req.params.hashkey;
    var incidentInfo=req.body;

    //console.log(req.body);
    if (haskey == undefined || incidentInfo == undefined )
      res.send ("undefined hashkey or incidentInfo");

    var incidentInfoStr = JSON.stringify(incidentInfo,null,2);
    var jsonObj = JSON.parse(incidentInfoStr);
    //var hash = crypto.createHash('md5').update(templateStr).digest('hex');


    var item = {
                TableName: "car_info",
                Item: {
                  "hashkey": hashkey,
                  "incidentInfo": incidentInfoStr
                }
    };
    console.log(item);

    var docClient = new AWS.DynamoDB.DocumentClient();

    docClient.put(item, function(err, result) {
        if(err) {
            console.log(err);
            res.send(err);
          }
        else {
              //var jsonStr = JSON.stringify(result, null, 2);
              //console.log(result);
              res.send("saved");
            }
      });
});


router.get('/incident/:hashkey', function(req, res) {
  var tId=req.params.hashkey;

  var docClient = new AWS.DynamoDB.DocumentClient();

  console.log("Querying incident info " + tId);

  var params = {
      TableName : "car_info",
      KeyConditionExpression: "#hashkey = :xxxx",
      ExpressionAttributeNames:{
          "#hashkey": "hashkey"
      },
      ExpressionAttributeValues: {
          ":xxxx":tId
      }
  };
  docClient.query(params, function(err, result) {
        if(err) {
          console.log(err);
          res.send (err);
        }
      else {
        //console.log(result.Items);
        res.send (result.Items[0].incidentInfo);
      }
  });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
