## Binary Extraction

`binwalk -me <FILE>` -> extracted to `_wr-841n.bin.extracted`


## System information

> ![TODO]: this

## YAFFS exploration

### Identification

in `_wr-841n.bin.extracted/_10200.extracted`
```
file -z -- 2AF818.yaffs
```

```output
2AF818.yaffs: YAFFS filesystem root entry (little endian), type file, v1 root directory
```

### Extraction

```command
binwalk -e --dd='.*' 2AF818.yaffs
```

```output
DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
165864        0x287E8         ASCII cpio archive (SVR4 with no CRC), file name: "/dev", file name length: "0x00000005", file size: "0x00000000"
165980        0x2885C         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/console", file name length: "0x0000000D", file size: "0x00000000"
166104        0x288D8         ASCII cpio archive (SVR4 with no CRC), file name: "/root", file name length: "0x00000006", file size: "0x00000000"
166220        0x2894C         ASCII cpio archive (SVR4 with no CRC), file name: "TRAILER!!!", file name length: "0x0000000B", file size: "0x00000000"
```

Also generated a `_2AF818.yaffs.extracted` directory

### Exploration

this was a dead end, the yaffs file system appears to by entirely empty

## squashfs exporation

## passwd.bak

```command
cat squashfs-root/etc/passwd.bak
```

```output
admin:$1$$iC.dUsGpxNNJGeOm1dFio/:0:0:root:/:/bin/sh
dropbear:x:500:500:dropbear:/var/dropbear:/bin/sh
nobody:*:0:0:nobody:/:/bin/sh
```

This is an MD5-crypt hashed password, which is considered deprecated and most likely crackable

