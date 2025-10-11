#!/bin/bash

FILE="$1"

echo "============================== KEYS: $1 =============================="
strings "$1" | rg --multiline --multiline-dotall "(BEGIN.*PRIVATE KEY.*END.*PRIVATE KEY)|(KEY)"

echo -e "\n============================== PASSWORDS: $1 =============================="
strings "$1" | rg "PASSWORD|password|Password"

