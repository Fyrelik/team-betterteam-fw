#!/bin.bash

# arg1: target file
# arg2: dir to extract to
# arg3: toggle stderr

FILE="$1"
TARGET_PATH="$2" # extraction output dir
HIDE_ERR="$3"

# filepath parsing
FILE_BASE=$(basename "$FILE")
FILE_DIR=$(readlink -f "$FILE" | xargs dirname)
EXTRACTED_LOC="$FILE_DIR/_$FILE_BASE.extracted"                                                                             
if [ -d "$EXTRACTED_LOC" ] || [ -f "$EXTRACTED_LOC" ]; then
    rm -rf "$EXTRACTED_LOC"
fi

# execution
if [[ "$HIDE_ERR" == "1" ]]; then
    OUTPUT=$(binwalk -Me "$FILE" --directory="$TARGET_PATH" 2>/dev/null)
else
    OUTPUT=$(binwalk -Me "$FILE" --directory="$TARGET_PATH" )
fi

echo "============================== BINWALK: $FILE =============================="
echo "$OUTPUT"
echo ""
