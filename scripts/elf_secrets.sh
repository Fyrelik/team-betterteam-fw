#!/bin/bash

FILE="$1"

echo -e "============================== KEYS: $1 ==============================\n"
strings "$1" | rg --multiline --multiline-dotall "(BEGIN.*PRIVATE KEY.*END.*PRIVATE KEY)|(KEY)|(gho_)|(ghp_)"

echo -e "\n============================== PASSWORDS: $1 ==============================\n"
strings "$1" | rg "PASSWORD|password|Password"

