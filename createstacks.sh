#!/bin/bash
aws cloudformation create-stack --stack-name dev-lamp-autoscale-multi --parameters "`cat ./lampParameters.json`" --template-url https://s3-us-west-2.amazonaws.com/cloudformation-templates-us-west-2/LAMP_Multi_AZ.template

aws cloudformation create-stack --stack-name ${stack_name} --parameters "`curl -X Get http://${hostname}:8080/api/parameters/template/${templateid}?user=${userid}`" --template-body "`curl -X GET http://${hostname}:8080/api/template/${templateid)`"
