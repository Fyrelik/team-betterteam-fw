#!/bin/bash

# helper to scan bin extracts for passwords / private keys

# arg1: target directory
FILE="$1"

# password scan
echo -e "============================== PASSWORDS: $FILE ==============================\n"
find "$FILE" | rg "passwd|shadow"

# private key scan
echo -e "\n============================== KEYS: $FILE ==============================\n"
find "$FILE" | rg ".*\.pem|.*\.crt|.*\.key"
echo ""
rg --multiline --multiline-dotall --no-binary --no-filename -oP ".{0,10}(BEGIN.*PRIVATE KEY.*END.*PRIVATE KEY)|(KEY.{0,20}:).{0,10}" "$FILE"
