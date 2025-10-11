#!/bin/bash

# An extensible script for extracting and scanning firmware binaries
# Supported binaries:
#  - .elf
#  - .bin

set -eou pipefail

# helper for sourcing helper modules
SCRIPT_DIR="$(readlink -f "$0" | xargs dirname)/script_helpers"
function run_script() {
  SCRIPT="$1"
  if ! [ -f "$SCRIPT_DIR/$SCRIPT.sh" ]; then
    echo "'$SCRIPT_DIR/$SCRIPT.sh' not found"
    exit 1
  fi
  shift
  source "$SCRIPT_DIR/$SCRIPT.sh" "$@"
}

# arg check
if (( $# != 1 )); then
    echo "Expected 1 argument"
    exit 1
fi

# help message 
if [[ "$1" == "-h" ]]; then
    run_script help "$0"
    exit 0
fi

# location parsing
FILE_PATH="$(readlink -f "$1")"
FILE_NAME="$(basename "$FILE_PATH")"
DIR_PATH="$(dirname "$FILE_PATH")"
LOG_DIR="$DIR_PATH/triage-out"
LOG_DIR_BASE=$(basename "$LOG_DIR")

# file checks
if ! [ -f "$FILE_PATH" ]; then
  echo "File not found: $FILE_PATH"
  exit 1
fi

if [ -d "$LOG_DIR" ]; then
    rm -rf "$LOG_DIR"
fi
mkdir -p "$LOG_DIR"

# header & dependencies

run_script header

run_script dependency_check

# filename parsing
RAW_FILE=$(readlink -f "$1")
RAW_FILE_BASE=$(basename "$RAW_FILE")
RAW_FILE_DIR=$(readlink -f "$1" | xargs dirname)
RAW_FILE_EXTENSION=".${RAW_FILE_BASE##*.}"


if [[ "$RAW_FILE_EXTENSION" == ".bin" ]]; then

    # actions for .bin targets

    EXTRACTED_FILE="$RAW_FILE_DIR/_$RAW_FILE_BASE.extracted"
    if [ -d "$EXTRACTED_FILE" ]; then
        rm -rf "$EXTRACTED_FILE"
    fi
    
    run_script binwalk "$RAW_FILE" 1 > "$LOG_DIR"/binwalk.log 2>&1
    echo -e "Binwalk executed on $RAW_FILE_BASE, see $LOG_DIR_BASE/binwalk.log\n"

    run_script bin_secrets "$EXTRACTED_FILE" > "$LOG_DIR"/secrets.log 2>&1
    echo -e "Secret sweep executed on $RAW_FILE_BASE, see $LOG_DIR_BASE/secrets.log\n"

elif [[ "$RAW_FILE_EXTENSION" == ".elf" ]]; then

    # actions for .elf targets

    EXTRACTED_FILE="$RAW_FILE_DIR/_$RAW_FILE_BASE.extracted"
    if [ -d "$EXTRACTED_FILE" ]; then
        rm -rf "$EXTRACTED_FILE"
    fi

    run_script binwalk "$RAW_FILE" 1 > "$LOG_DIR"/binwalk.log 2>&1
    echo -e "Binwalk executed on $RAW_FILE_BASE, see $LOG_DIR_BASE/binwalk.log\n"
    
    run_script elf_secrets "$RAW_FILE" > "$LOG_DIR"/secrets.log 2>&1
    echo -e "Secret sweep executed on $RAW_FILE_BASE, see $LOG_DIR_BASE/secrets.log\n"

else

    # catchall

    echo "Filetype $RAW_FILE_EXTENSION not supported"
    exit 1

fi
