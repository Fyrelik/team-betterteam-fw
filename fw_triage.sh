#!/bin/bash

# An extensible script for extracting and scanning firmware binaries
# Supported binaries:
#  - .elf
#  - .bin

# helper for sourcing helper modules
SCRIPT_DIR="$(readlink -f "$0" | xargs dirname)/script_helpers"
LOG_EXTENSION=".log"

function run_script() {
  SCRIPT="$1"
  LOG_NAME="$2"
  shift; shift

  if ! [ -f "$SCRIPT_DIR/$SCRIPT.sh" ]; then
    echo "'$SCRIPT_DIR/$SCRIPT.sh' not found"
    exit 1
  fi
  if [[ "$LOG_NAME" == "" ]]; then
    source "$SCRIPT_DIR/$SCRIPT.sh" "$@"
  else
    source "$SCRIPT_DIR/$SCRIPT.sh" "$@" > "$LOG_DIR/$LOG_NAME$LOG_EXTENSION" 2>&1
  fi
}

# argument parsing
OUTPUT_DIR=""

# help message
if (( $# == 1 )) && [[ "$1" == "-h" ]]; then
    source "$SCRIPT_DIR/help.sh"
    exit 0

# just target
elif (( $# == 1 )); then
    RAW_FILE=$(readlink -f "$1")
    if ! [ -f "$RAW_FILE" ]; then
          echo "File not found: $RAW_FILE"
          exit 1
    fi

# target + output target
elif (( $# == 2 )); then
    RAW_FILE=$(readlink -f "$1")
    OUTPUT_DIR="$2"
    if ! [ -f "$RAW_FILE" ]; then
          echo "File not found: $RAW_FILE"
          exit 1
    fi
    if ! [ -d "$2" ]; then
        echo "Output directory not found: $2"
        exit 1
    fi

# bad input
else
    echo "Input malformed."
    run_script help ""
fi


# filename parsing
RAW_FILE_BASE=$(basename "$RAW_FILE")
RAW_FILE_DIR=$(readlink -f "$1" | xargs dirname)
RAW_FILE_EXTENSION=".${RAW_FILE_BASE##*.}"

if [[ "$OUTPUT_DIR" == "" ]]; then
    OUTPUT_DIR="$(dirname "$RAW_FILE")"
fi

# location parsing
FILE_PATH="$(readlink -f "$RAW_FILE")"
FILE_NAME="$(basename "$FILE_PATH")"
DIR_PATH="$(dirname "$FILE_PATH")"
LOG_DIR="$OUTPUT_DIR/triage_$RAW_FILE_BASE"
LOG_DIR_BASE=$(basename "$LOG_DIR")

# output staging
if [ -d "$LOG_DIR" ]; then
    rm -rf "$LOG_DIR/*"
else
    mkdir -p "$LOG_DIR"
fi

# header & dependencies

#run_script header ""
source "$SCRIPT_DIR"/header.sh

source "$SCRIPT_DIR"/dependency_check.sh

#run_script dependency_check ""

if [[ "$RAW_FILE_EXTENSION" == ".bin" ]]; then

    # actions for .bin targets

    EXTRACTED_FILE="$OUTPUT_DIR/extracted_$RAW_FILE_BASE"

    run_script binwalk "binwalk" "$RAW_FILE" "$EXTRACTED_FILE" 1
    echo -e "Binwalk executed on $RAW_FILE_BASE, see $LOG_DIR_BASE/binwalk.log\n"

    run_script bin_secrets "secrets" "$EXTRACTED_FILE"
    echo -e "Secret sweep executed on $EXTRCTED_FILE, see $LOG_DIR_BASE/secrets.log\n"

elif [[ "$RAW_FILE_EXTENSION" == ".elf" ]]; then

    # actions for .elf targets

    run_script binwalk binwalk "$RAW_FILE" "" 1
    echo -e "Binwalk executed on $RAW_FILE_BASE, see $LOG_DIR_BASE/binwalk.log\n"
    
    run_script elf_secrets "secrets" "$RAW_FILE"
    echo -e "Secret sweep executed on $RAW_FILE_BASE, see $LOG_DIR_BASE/secrets.log\n"

else

    # catchall

    echo "Filetype $RAW_FILE_EXTENSION not supported"
    exit 1

fi
