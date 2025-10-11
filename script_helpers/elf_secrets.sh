#!/bin/bash

# helper to scan elf binaries for password / private keys

# arg1: file target
FILE="$1"

# password scan
echo -e "\n============================== PASSWORDS: $FILE ==============================\n"
strings "$FILE" | rg "PASSWORD|password|Password"

# private key scan
echo -e "============================== KEYS: $FILE ==============================\n"
strings "$FILE" | rg --multiline --multiline-dotall "(BEGIN.*PRIVATE KEY.*END.*PRIVATE KEY)|(KEY)|(gho_)|(ghp_)"
