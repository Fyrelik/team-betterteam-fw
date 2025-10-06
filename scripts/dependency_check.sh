#!/bin/bash

DEPENDENCIES=(
    "tree"
    "binwalk"
)

MISSING=()

for dep in "${DEPENDENCIES[@]}"; do
    if ! (which "$dep" >> /dev/null); then
        MISSING+=("$dep")
    fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
  IN=""
  while [ "${IN,,}" != "y" ] && [ "${IN,,}" != "n" ]; do
    echo -n "${#MISSING[@]} dependencies missing. Install them? (requires sudo) [Y/n]: "
    read -r IN
  done
  if [ "${IN,,}" == "y" ]; then
    if ! (sudo echo -n ""); then
        echo ""
        echo "Sudo failed, try again"
        exit 1
    fi
    echo ""
    for dep in "${MISSING[@]}"; do
      if ! OUTPUT=$(sudo apt install -y "$dep" 2>&1); then
        echo "Failed to install '$dep'"
        echo "apt output:"
        echo "$OUTPUT"
        exit 1
      else
        echo "Installed '$dep'"
    fi
    done
    sudo -k
  else
    echo "Cannot run without dependencies, exiting..."
    exit 1
  fi
fi
