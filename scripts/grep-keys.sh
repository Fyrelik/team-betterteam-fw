grep -R --line-number --exclude-dir=js  -iE "root:|:x|:\!|BEGIN RSA PRIVATE KEY|BEGIN PRIVATE KEY|ssh-rsa" "$1" | sed -n '1,200p'
