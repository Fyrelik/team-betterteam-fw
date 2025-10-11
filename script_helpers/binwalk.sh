#!/bin.bash

# arg1: target file
# arg2: toggle stderr

FILE="$1"
HIDE_ERR="$2"

RAW_FILE_BASE=$(basename "$FILE")
RAW_FILE_DIR=$(readlink -f "$FILE" | xargs dirname)
EXTRACTED_FILE="$RAW_FILE_DIR/_$RAW_FILE_BASE.extracted"                                                                             
if [ -d "$EXTRACTED_FILE" ]; then
    rm -rf "$EXTRACTED_FILE"
fi

if [[ "$HIDE_ERR" == "1" ]]; then
    OUTPUT=$(binwalk -Me "$FILE" 2>/dev/null)
else
    OUTPUT=$(binwalk -Me "$FILE")
fi

echo "============================== BINWALK: $FILE =============================="
echo "$OUTPUT"
echo ""
