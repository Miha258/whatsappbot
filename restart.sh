#!/bin/bash

# Find and kill Node.js processes for bot.js
pkill -f "node.*bot.js"
pkill -f "node.*server.js"

node bot.js