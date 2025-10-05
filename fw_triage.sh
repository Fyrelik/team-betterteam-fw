#!/bin/bash

SCRIPT_DIR="$(readlink -f "$0" | xargs dirname)/scripts"
echo $SCRIPT_DIR
