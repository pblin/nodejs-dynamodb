#!/bin/bash
aws cloudformation create-stack --stack-name dev-lamp-autoscale-multi --parameters "`cat ./lampParameters.json`" --template-url https://s3-us-west-2.amazonaws.com/cloudformation-templates-us-west-2/LAMP_Multi_AZ.template
