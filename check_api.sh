#!/bin/bash
while true; do
case "$(pidof node | wc -w)" in

0)  echo "Restarting server.js:"
    /home/ec2-user/dynamoDBAPI/run_api.sh
    ;;
1)  echo "server.js already running"
    sleep 5000
    ;;
esac
done
