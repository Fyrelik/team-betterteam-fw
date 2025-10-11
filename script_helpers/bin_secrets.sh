#!/bin/bash

FILE="$1"

echo -e "============================== PASSWORDS: $1 ==============================\n"
find "$FILE" | rg "passwd|shadow"

echo -e "\n============================== KEYS: $1 ==============================\n"
find "$FILE" | rg ".*\.pem|.*\.crt|.*\.key"
echo ""
rg --multiline --multiline-dotall --no-binary --no-filename -oP ".{0,10}(BEGIN.*PRIVATE KEY.*END.*PRIVATE KEY)|(KEY.{0,20}:).{0,10}" "$1"
