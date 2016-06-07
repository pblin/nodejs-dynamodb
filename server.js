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
                    region: "us-west-2"};

var response = request('GET', 'http://169.254.169.254/latest/meta-data/iam/security-credentials/dynamoDBAccess');
var jsonData = JSON.parse(response.body.toString('utf-8'));
credentials.accessKeyId = jsonData.AccessKeyId;
credentials.secretKey = jsonData.SecretAccessKey;

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
            res.json({ message: 'Hi! welcome to our api!' });
  });

router.put('/template/:name',function(req, res) {
    var templateName=req.params.name;
    var templateBody=req.body;

    //console.log(req.body);
    if (templateName == undefined || templateBody == undefined )
      res.send ("undefined template name or template");

    var templateStr = JSON.stringify(templateBody,null,2);
    var jsonObj = JSON.parse(templateStr);
    var hash = crypto.createHash('md5').update(templateStr).digest('hex');


    var item = {
                TableName: "service-templates",
                Item: {
                  "template_name": templateName,
                  "id": hash,
                  "template": templateStr
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
              res.send(hash);
            }
      });
});

router.put('/parameters/template/:templateid',function(req, res) {
    var templateId=req.params.templateid;
    var userId=req.query.user;
    var parameterBody=req.body;

    //console.log(req.body);
    if (templateId == undefined || userId == undefined )
      res.send ("undefined templateId or userId");

    var  jsonStr = JSON.stringify(parameterBody, null,2);
    var hash = crypto.createHash('md5').update(jsonStr).digest('hex');

    var item = {
                TableName: "service-parameters",
                Item: {
                  "id": userId,
                  "template_id": templateId,
                  "paramsHash": hash,
                  "params": parameterBody
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
              console.log("saved");
              res.send(JSON.stringify(item,null,2));
            }
      });
});

router.get('/listTemplates', function(req, res) {
  var myLimit = Number(req.query.limit);
  if (myLimit == undefined)
    myLimit = 5;

  var params = {
       TableName : "service-templates",
       Limit: myLimit
     };

  var docClient = new AWS.DynamoDB.DocumentClient();
  docClient.scan (params, function(err,result) {
          if (err) {
              console.log(err);
              res.send(err);
            } else {
              //console.log(result.Items);
              var templateList = [];
              i=0;
              for (var ii in result.Items) {
                    aa = result.Items[ii];
                    var jsonData = JSON.parse(aa.template);
                    var elem = {name:aa.template_name, id:aa.id, descrption:jsonData.Description };
                    templateList[i] = elem;
                    i++;
              }
              res.send(templateList)
            }
    });
});

router.get('/template/:id', function(req, res) {
  var tId=req.params.id;

  var docClient = new AWS.DynamoDB.DocumentClient();

  console.log("Querying template " + tId);

  var params = {
      TableName : "service-templates",
      KeyConditionExpression: "#id = :xxxx",
      ExpressionAttributeNames:{
          "#id": "id"
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
        console.log(result.Items);
        res.send (result.Items[0].template);
      }
  });
});

router.get('/parameters/template/:id', function(req, res) {
  var tId=req.params.id;
  var uId=req.query.user;

  if (tId == undefined || uId == undefined )
    res.send ("undefined templateId or userId");

  var docClient = new AWS.DynamoDB.DocumentClient();

  console.log("Querying parameters of template " + tId + " for user id" + uId);

  var params = {
      TableName : "service-parameters",
      KeyConditionExpression: "#id = :xxxx",
      FilterExpression: "#tid = :yyyy",
      ExpressionAttributeNames: {
        "#id": "id",
        "#tid":"template_id"
      },
      ExpressionAttributeValues: {
          ":xxxx": uId,
          ":yyyy": tId
      }
  };

  docClient.query(params, function(err, result) {
        if(err) {
          console.log(err);
          res.send (err);
        }
      else {
        console.log(result.Items);
        res.send (result.Items[0].params);
      }
  });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
