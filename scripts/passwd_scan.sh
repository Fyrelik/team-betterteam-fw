#!/bin/bash

FILE="$1"

find "$FILE" | grep "passwd|shadow"
