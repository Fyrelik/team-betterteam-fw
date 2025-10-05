# Initial Findings
- Boot loader: `U-Boot 2014.01-rc2-V1.01 (June 07 2017 - 17:44:09)`
- Chipset: `Realtek?`
- Something: TFTP
- DCS-8000LH





# command used 
grep -R --line-number -iE "root:|:x:|:\!|BEGIN RSA PRIVATE KEY| BEGIN PRIVATE KEY|ssh-rsa" _dcs-8000lh.bin.extracted/| sed -n '1,200p'

# found
grep: _dcs-8000lh.bin.extracted/squashfs-root-0/etc/rc.d/rcK.d/K01local:19:	#echo 'root:x:0:' > /etc/group
_dcs-8000lh.bin.extracted/4E0000.squashfs: binary file matches
grep: _dcs-8000lh.bin.extracted/squashfs-root-0/etc/rc.d/rcK.d/K01local:20:	#echo 'root:x:0:0:Linux User,,,:/:/bin/sh' > /etc/passwd
_dcs-8000lh.bin.extracted/squashfs-root-0/etc/rc.d/rcK.d/K01local:21:	#echo 'root:$1$gmEGnzIX$bFqGa1xIsjGupHyfeHXWR/:20:0:99999:7:::' > /etc/shadow
_dcs-8000lh.bin.extracted/squashfs-root-0/etc/rc.d/rc.local:19:	#echo 'root:x:0:' > /etc/group
_dcs-8000lh.bin.extracted/squashfs-root-0/etc/rc.d/rc.local:20:	#echo 'root:x:0:0:Linux User,,,:/:/bin/sh' > /etc/passwd
_dcs-8000lh.bin.extracted/squashfs-root-0/etc/rc.d/rc.local:21:	#echo 'root:$1$gmEGnzIX$bFqGa1xIsjGupHyfeHXWR/:20:0:99999:7:::' > /etc/shadow
_dcs-8000lh.bin.extracted/squashfs-root-0/etc/rc.d/rcK_mfg.d/K01local:19:	#echo 'root:x:0:' > /etc/group
_dcs-8000lh.bin.extracted/squashfs-root-0/etc/rc.d/rcK_mfg.d/K01local:20:	#echo 'root:x:0:0:Linux User,,,:/:/bin/sh' > /etc/passwd
_dcs-8000lh.bin.extracted/squashfs-root-0/etc/rc.d/rcK_mfg.d/K01local:21:	#echo 'root:$1$gmEGnzIX$bFqGa1xIsjGupHyfeHXWR/:20:0:99999:7:::' > /etc/shadow


# Command used
sha256sum bins/dcs-8000lh.bin

# Found
deff89f315dc7449a6d093a5b57a5f4926c495f7b27a7bf6a9c40f7e0c6aef88
