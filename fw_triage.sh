#!/bin/bash

if ! [ -f "$1" ]; then
    echo "ERR: File '$1' not found."
    exit 1
fi

SCRIPT_DIR="$(readlink -f "$0" | xargs dirname)/scripts"

FILE_PATH="$(readlink -f "$1")"
FILE_NAME="$(basename "$FILE_PATH")"
DIR_PATH="$(dirname "$FILE_PATH")"
LOG_DIR="$DIR_PATH/script-logs"

if ! [ -f "$FILE_PATH" ]; then
  echo "File $FILE_PATH not found"
  exit 1
fi

if [ -d "$LOG_DIR" ]; then
    rm -rf "$LOG_DIR"
fi
mkdir -p "$LOG_DIR"


SCRIPT_DIR="$(readlink -f "$0" | xargs dirname)/scripts"
function source_script() {
  if ! [ -f "$SCRIPT_DIR/$1.sh" ]; then
    echo "'$SCRIPT_DIR/$1.sh' not found"
    exit 1
  fi
  source "$SCRIPT_DIR/$1.sh" "$2" "$3" "$4"
}

source_script header
source_script dependency_check

RAW_FILE=$(readlink -f "$1")
RAW_FILE_BASE=$(basename "$1")
RAW_FILE_DIR=$(readlink -f "$1" | xargs dirname)
RAW_FILE_EXTENSION=".${RAW_FILE_BASE##*.}"

if [[ "$RAW_FILE_EXTENSION" == ".bin" ]]; then

    EXTRACTED_FILE="$RAW_FILE_DIR/_$RAW_FILE_BASE.extracted"
    if [ -d "$EXTRACTED_FILE" ]; then
        rm -rf "$EXTRACTED_FILE"
    fi

    if ! binwalk_out=$(binwalk -Me "$RAW_FILE" 2>/dev/null); then
        echo "Binwalk failed :("
        binwalk_out="============================== BINWALK: ==============================$binwalk_out"
        echo "$binwalk_out" >> "$LOG_DIR"/binwalk.log
        exit 1
    fi
    binwalk_out="============================== BINWALK: ==============================$binwalk_out"
    echo "$binwalk_out" >> "$LOG_DIR"/binwalk.log
    source_script bin_secrets "$EXTRACTED_FILE" > "$LOG_DIR"/secrets.log 2>&1

elif [[ "$RAW_FILE_EXTENSION" == ".elf" ]]; then

    EXTRACTED_FILE="$RAW_FILE_DIR/_$RAW_FILE_BASE.extracted"
    if [ -d "$EXTRACTED_FILE" ]; then
        rm -rf "$EXTRACTED_FILE"
    fi

    if ! binwalk_out=$(binwalk -Me "$RAW_FILE" 2>/dev/null); then
        echo "Binwalk failed :("
        binwalk_out="============================== BINWALK: ==============================$binwalk_out"
        echo "$binwalk_out" >> "$LOG_DIR"/binwalk.log
        exit 1
    fi
    binwalk_out="============================== BINWALK: ==============================$binwalk_out"
    echo "$binwalk_out" >> "$LOG_DIR"/binwalk.log
    
    source_script elf_secrets "$RAW_FILE" > "$LOG_DIR"/secrets.log 2>&1

fi

cat "$LOG_DIR"/*

