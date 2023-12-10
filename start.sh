#!/bin/bash

node server.js &
server_pid=$!
node bot.js
wait $server_pid
