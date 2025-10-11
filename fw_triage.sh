#!/bin/bash

<<<<<<< HEAD
if ! [ -f "$1" ]; then
    echo "ERR: File '$1' not found."
    exit 1
fi

SCRIPT_DIR="$(readlink -f "$0" | xargs dirname)/scripts"
||||||| ea057db
SCRIPT_DIR="$(readlink -f "$0" | xargs dirname)/scripts"
=======
FILE_PATH="$(readlink -f "$1")"
FILE_NAME="$(basename "$FILE_PATH")"
DIR_PATH="$(dirname "$FILE_PATH")"
if ! [ -f "$FILE_PATH" ]; then
  echo "File $FILE_PATH not found"
  exit 1
fi
>>>>>>> ad28190a8e6bc8c91b37759ac071cb5df7c218c4

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

<<<<<<< HEAD
RAW_FILE=$(readlink -f "$1")
RAW_FILE_BASE=$(basename "$1")
RAW_FILE_DIR=$(readlink -f "$1" | xargs dirname)
RAW_FILE_EXTENSION=".${RAW_FILE_BASE##*.}"

||||||| ea057db
=======
# TODO:
# output to files
>>>>>>> ad28190a8e6bc8c91b37759ac071cb5df7c218c4

