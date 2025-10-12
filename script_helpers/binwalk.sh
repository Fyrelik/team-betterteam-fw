#!/bin.bash

# arg1: target file
# arg2: dir to extract to
# arg3: toggle stderr

FILE="$1"
TARGET_PATH="$2" # extraction output dir
HIDE_ERR="$3"

if [ -d "$TARGET_PATH" ] || [ -f "$TARGET_PATH" ]; then
  rm -rf "$TARGET_PATH"
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
