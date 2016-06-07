Publish reviewed product to the catalog:

curl -X PUT -H "Content-type: application/json" -H "Accept: application/json" --data @${templateName}.template http://52.90.208.252:8080/api/template/${templateName}

@${templateName}.template is AWS CloudFormation template file. 

curl -X PUT -H "Accept:application/json" -H "Content-type:application/json" --data @Windows_Single_Server_Active_Directory.template http://52.90.208.252:8080/api/template/Windows_Single_Server_Active_Director

Windows_Single_Server_Active_Directory.template is a CloudFormation template. 

Scan:

curl -X GET -H "Content-type: application/json" -H "Accept: application/json" http://52.90.208.252:8080/api/listTemplates?limit=5

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

Query:

To query with the hash id to retrieve the template.
AWS CloudFormation:
curl -X GET -H "Content-type: application/json" -H "Accept: application/json" http://52.90.208.252:8080/api/template/47b7f524558df6648db8ce9112b59838 <- click

Kubernetes:
curl -X GET -H "Content-type: application/json" -H "Accept: application/json" http://52.90.208.252:8080/api/template/19d651427856341f2519198b6fb5cad7

