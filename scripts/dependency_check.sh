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
  while [ "$IN" != "Y" ] && [ "$IN" != "n" ]; do
    echo -n "${#MISSING[@]} dependencies missing. Install them? (requires sudo) [Y/n]: "
    read -r IN
  done
  if [ "$IN" == "Y" ]; then
    for dep in "${MISSING[@]}"; do
      if ! (sudo apt install -y "$dep"); then
        echo "Failed to install $dep"
        exit 1
      fi
    done
  else
    echo "Cannot run without dependencies, exiting..."
    exit 1
  fi
fi
