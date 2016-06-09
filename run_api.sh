#!/bin/bash
rm /home/ec2-user/dynamoDBAPI/out.txt
node server.js &> out.txt &

~
