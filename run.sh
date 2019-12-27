#!/bin/bash
echo "run.sh monitor $(DATE)" >> monitor.txt
node index.js >> log.txt
