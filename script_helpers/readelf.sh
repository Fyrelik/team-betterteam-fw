#!/bin/bash

# script to readelf a binary for information

FILE="$1"

readelf -hlA "$FILE"
