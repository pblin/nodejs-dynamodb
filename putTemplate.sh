#!/bin/bash

export host=localhost
export templateDir="./cf-templates"
cd $templateDir
for data in `ls *.template | awk -F. '{print $1}'`; do
  echo "put template $data"
  curl -X PUT -H "Content-type: application/json" -H "Accept: application/json" --data @${data}.template http://${host}:8080/api/template/${data}
done
