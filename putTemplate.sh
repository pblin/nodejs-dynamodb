#!/bin/bash

export host=52.90.208.252
export templateDir="$HOME/kubernetes/examples/storm/"
cd $templateDir
for data in `ls *.json | awk -F. '{print $1}'`; do
  echo "put template $data"
  curl -X PUT -H "Content-type: application/json" -H "Accept: application/json" --data @${data}.json http://${host}:8080/api/template/kub_${data}
done
