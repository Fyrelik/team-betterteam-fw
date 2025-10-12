#!/bin/bash

# helper script to ensure dependency existence, and prompt for installation

# dependency names as expected by `apt`
DEPENDENCY_NAMES=(
    "binwalk"
    "ripgrep"
)

# dependency commands as expected by `which`
DEPENDENCY_COMMANDS=(
    "binwalk"
    "rg"
)

# tracks missing depencencies
MISSING=()

# check for dependency existence
for (( i=0; i<${#DEPENDENCY_NAMES[@]}; i++ )); do
    if ! (which "${DEPENDENCY_COMMANDS[i]}" >> /dev/null); then
        MISSING+=("${DEPENDENCY_NAMES[i]}")
    fi
done

# installs dependencies from apt
if [ ${#MISSING[@]} -gt 0 ]; then

  # prompt user to install
  IN=""
  while [ "$IN" != "y" ] && [ "$IN" != "n" ]; do
    echo -n "${#MISSING[@]} dependencies missing. Install them? (requires sudo) [Y/n]: "
    read -r IN
    IN=$(echo "$IN" | awk -F " " '{print tolower($0)}')
  done

  # act on user decision

  ## do installs
  if [ "$IN" == "y" ]; then

    if ! (which apt); then
        echo "ERR: apt not found, please install dependencies manually."
        echo "${MISSING[@]}"
        exit 1
    fi

    # activate sudo
    if ! (sudo echo -n ""); then
        echo ""
        echo "Sudo failed, try again"
        exit 1
    fi
    echo ""

    # begin installing dependencies
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

    # disable sudo
    sudo -k

  else

    # exit cleanly, dependencies not installed
    echo "Cannot run without dependencies, exiting..."
    exit 1

  fi
fi

echo ""
