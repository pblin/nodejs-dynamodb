#!/bin/bash
case "$(pidof node | wc -w)" in

0)  echo "Restarting server.js:"
    $1/run_api.sh
    ;;
1)  echo "server.js ok"
    ;;
esac
