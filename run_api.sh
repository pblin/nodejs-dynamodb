#!/bin/bash
crontab -u ubuntu cron-schedule-ubuntu.txt
node server.js > out.txt &
