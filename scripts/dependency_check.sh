DEPENDENCIES=(
    "tree"
)

DEP_MISSING=0

for dep in "${DEPENDENCIES[@]}"; do
    if ! (which "$dep" >> /dev/null); then
        echo "DEPENDANCY MISSING: $dep"
        DEP_MISSING=1
    fi
done

if (( DEP_MISSING = 1 )); then
    exit 1
fi
