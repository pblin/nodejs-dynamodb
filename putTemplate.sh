#!/bin/bash

export host=localhost
export templateDir="./cf-templates"

COUNTER=0
while [  $COUNTER -lt 10 ]; do
    let COUNTER=COUNTER+1
    code=$(curl -sL http://localhost:8080/api -w "%{http_code}\\n" "URL" -o /dev/null)
    status=$(echo $code | awk -F' ' '{print $1}')
    if [ $status -eq 200 ]; then
        let COUNTER=11
    fi
    echo $COUNTER
    sleep 1
done

if [ $status -ne 200 ]; then
  echo "give up after 10 tries;"
  exit
fi

cd $templateDir
for data in `ls *.template | awk -F. '{print $1}'`; do
  echo "put template $data"
  curl -X PUT -H "Content-type: application/json" -H "Accept: application/json" --data @${data}.template http://${host}:8080/api/template/${data}
done
