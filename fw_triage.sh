#!/bin/bash

SCRIPT_DIR="$(readlink -f "$0" | xargs dirname)/scripts"

function source_script() {
  if ! [ -f "$SCRIPT_DIR/$1.sh" ]; then
    echo "'$SCRIPT_DIR/$1.sh' not found"
    exit 1
  fi
  source "$SCRIPT_DIR/$1.sh"
}

source_script header
source_script dependency_check

