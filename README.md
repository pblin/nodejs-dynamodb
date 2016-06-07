Node.js version 6
DynamoDB
AWS-SDK

Publish reviewed product to the template store. 

curl -X PUT -H "Content-type: application/json" -H "Accept: application/json" --data @${templateName}.template http://${hostname}:8080/api/template/${templateName}

@${templateName}.template is AWS CloudFormation template file. 

curl -X PUT -H "Accept:application/json" -H "Content-type:application/json" --data @Windows_Single_Server_Active_Directory.template http://${hostname}:8080/api/template/Windows_Single_Server_Active_Director

Windows_Single_Server_Active_Directory.template is a CloudFormation template. 


insert template parameters:

curl -X PUT -H "Accept:application/json" -H "Content-type:application/json" --data paramObj http://${hosthame}:8080/api/parameters/template/21a52784d5d55f532d2e2bfc2ac34650?user=demo

paramObj= [
  {
    "ParameterKey":"KeyName",
    "ParameterValue":"blin-west",
    "UsePreviousValue": false
  },
  {
    "ParameterKey":"DBName",
    "ParameterValue":"mydevdb",
    "UsePreviousValue": false
   },
   {
    "ParameterKey":"DBUser",
    "ParameterValue":"demo1",
    "UsePreviousValue": false
    },
    {
     "ParameterKey":"DBPassword",
     "ParameterValue":"hello123",
     "UsePreviousValue": false
    }
]


Scan:

curl -X GET -H "Content-type: application/json" -H "Accept: application/json" http://${hostname}:8080/api/listTemplates?limit=5

return a list of template name and id (hash of template)
[
    {
        "name": "Rails_Single_Instance",
        "id": "6e7f04c80f6242695bcd17fd540db084"
    },
    {
        "name": "AutoScalingKeepAtNSample",
        "id": "f93e5d42494733cbac5931d3ea9154bc"
    },
]

Query examples:

To query with the hash id to retrieve the template.
curl -X GET -H "Content-type: application/json" -H "Accept: application/json" http://${hostname}:8080/api/template/47b7f524558df6648db8ce9112b59838 

parameters for tempalte given tempalte id
curl -X GET -H "Content-type: application/json" -H "Accept: application/json" http://${honstname}:8080/api/parameters/template/21a52784d5d55f532d2e2bfc2ac34650?user=demo

