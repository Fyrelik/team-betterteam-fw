# General Recon

~/Desktop/team-betterteam-fw/elfs$ file bare-metal-takehome.elf 
bare-metal-takehome.elf: ELF 32-bit LSB executable, ARM, EABI5 version 1 (SYSV), statically linked, stripped

~/Desktop/team-betterteam-fw/elfs$ readelf -h bare-metal-takehome.elf 
ELF Header:
  Magic:   7f 45 4c 46 01 01 01 00 00 00 00 00 00 00 00 00 
  Class:                             ELF32
  Data:                              2's complement, little endian
  Version:                           1 (current)
  OS/ABI:                            UNIX - System V
  ABI Version:                       0
  Type:                              EXEC (Executable file)
  Machine:                           ARM
  Version:                           0x1
  Entry point address:               0x29
  Start of program headers:          52 (bytes into file)
  Start of section headers:          6564 (bytes into file)
  Flags:                             0x5000200, Version5 EABI, soft-float ABI
  Size of this header:               52 (bytes)
  Size of program headers:           32 (bytes)
  Number of program headers:         1
  Size of section headers:           40 (bytes)
  Number of section headers:         7
  Section header string table index: 6

~/Desktop/team-betterteam-fw/elfs$ readelf -S bare-metal-takehome.elf | tee elf_sections.txt
There are 7 section headers, starting at offset 0x19a4:

Section Headers:
  [Nr] Name              Type            Addr     Off    Size   ES Flg Lk Inf Al
  [ 0]                   NULL            00000000 000000 000000 00      0   0  0
  [ 1] .text             PROGBITS        00000000 001000 0008fd 00  AX  0   0  4
  [ 2] .data             PROGBITS        000008fd 0018fd 000000 00  WA  0   0  1
  [ 3] .bss              NOBITS          00000900 0018fd 000018 00  WA  0   0  4
  [ 4] .comment          PROGBITS        00000000 0018fd 000045 01  MS  0   0  1
  [ 5] .ARM.attributes   ARM_ATTRIBUTES  00000000 001942 00002d 00      0   0  1
  [ 6] .shstrtab         STRTAB          00000000 00196f 000035 00      0   0  1
Key to Flags:
  W (write), A (alloc), X (execute), M (merge), S (strings), I (info),
  L (link order), O (extra OS processing required), G (group), T (TLS),
  C (compressed), x (unknown), o (OS specific), E (exclude),
  D (mbind), y (purecode), p (processor specific)

~/Desktop/team-betterteam-fw/elfs$ strings -n 8 bare-metal-takehome.elf | head -n 60
gho_8oN6PENOTQx4y00M5ow86V4PaeG8l2zvGk8z
ghp_qhfNsKzF6bnfrLDnwoFoXT1edGpUVsZb0RFu
AWS_ACCESS_KEY_ID=AROA8OSUGYZIZ7LGP7BX\nAWS_SECRET_ACCESS_KEY=I3QjGERpxISUFXF9x2ZJ=KrF=tCvvZJl+u3dTVi1\n
[default]\naws_access_key_id = AROA8OSUGYZIZ7LGP7BX\naws_secret_access_key = I3QjGERpxISUFXF9x2ZJ=KrF=tCvvZJl+u3dTVi1\n
I3QjGERpxISUFXF9x2ZJ=KrF=tCvvZJl+u3dTVi1
AROA8OSUGYZIZ7LGP7BX
-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCiWlYqOGr9KnIN
BsKfmHYO456Gw6BkyYGpSyg+dTiqgmz4FbB+XkmwKcMgXidArpOEr3wDuJJN2n0p
8UCxMdrk1aEtRQ/5+/ai6uaZEsTVgTcoh9yUl5Xr6JGQxGukX4J+3enN0xQ1NHUs
+D+QFZk9vLF46/U9syouenn2ykr3FsyVuPy5NOxHzgYgiDB3WZ7SI2m++ia6c3Q2
e8dTAutEIGG74bY8HLyV1HErRnWxqSwe5sYxSxZ3yhUEDSqVE9cRJgwDS0XDxVQ6
KbYsfBPAFF1ltU7hwTEroJuGC5yiG45x7z1PiNL8W+Ulbt5dsTWj22hNFB0SpaMU
Al35tuQRAgMBAAECggEALD8cfpMzrV2VCbHO9vnxKuuj96x3GSDF4qKmDCecUvQK
yK34lOgTgxxOnpKqdfleIOpGjSkPToJ+XCDw9ZnVw0npjFHnIcUmmY4VXKB93oZB
xx0H48NQS6PtkBvIDlstUHAgWUTum/V4/dGGWTlZszaq037TLoaWt2YPuU+2kJJJ
/UqGck0GEXJ4fm/2IUNlw94Ruy5Sh6Kpr09OJrr6vjTF6kEvsbhGRi+Sm2e3QAgk
6Y6rpdOmd3I214gUF79WcmZQf1z/tDn4KhztCEoLq99wgmuR6w6bkm1XXTkl37i8
yuVwM4s8iNOycAK/WW/00BYCrTyJO4AnonfDXkMKhQKBgQDNMkxz5qgGMtSOcuEb
s+AeqClUKAVc2jLz6GobcM0cVHAaltJpYn2LMA9wTmbf3nuxVienpjS3o8ou9OF9
b67h1MMCGCT85dZOjU2ciTFG2GfZf/gE/SNZI0/efKHDD1LMNAXSt6JRvYMuxr4/
ZWNL3CSn8Mfc2EVXQxHlZhYhQwKBgQDKjIml+mOdXUa5Ak+DZWLIVzbC4p5sMlzG
ggakjxsryDyuabaCMtDingdEcVfi4dlRTxvzWeSAhf18kp5qqIFvRR54uxk59R1a
1xVM+alBO2QK5qt/JSZtbIDtu10MmbLAGN9Lw3dWdftdlOxIoDlp32igS1bHYwTK
/1f0+Ln2GwKBgB/0e095ViVQ+SUN4tyLkJV1nqoKaXtiR5kQUqXfVTHaPHMHldDv
k5l/bIgSzZaDcUPWpOpIyeDnUu8pF4yPPe7RUWUcGXaA3HTzMGj2PIRJ4zJN6XPt
b/nLs/5z7kUQN9axK077Zf3Qw4MfVDVPNr1zlQnKR3WvAG1sdncBBOU9AoGAOcQ5
Ibg2ntPSbsNk8AGDWcXd3VkKe6slYIwG3vndcvAptkh5/8oEXw1Y30FAInntI85f
F1lk3O7Z66RZP+wM9jINTbt2p1vr4lODRK/TgMIydxVwhdOPkRen8aVFFWnkW/r7
/DykFWmSpg7qEJB5r2NDEKxL9JOd81M9v6UMTE8CgYAbalNVfPhE82vk0EwBDw8z
w6AFUdQ9uRi8XOcaRcxC/vGOIWT7tgift3q67XEL505hyHuY45MXUTwv342Mn7h1
Z0KN9o53048GnWe/CD9akBjrprRFJWsEyKhgJPPPw2D6DzJx8R1tiqeBuACWWJuc
glTNI2/5VH20x2ADoqnUXQ==
-----END PRIVATE KEY-----
-----BEGIN RSA PRIVATE KEY-----
DEMO_ACTIVE
GCC: (Arm GNU Toolchain 14.2.Rel1 (Build arm-14.52)) 14.2.1 20241119
.shstrtab
.comment
.ARM.attributes

# Credential/keysearch

~/Desktop/team-betterteam-fw/elfs$ strings -n 8 bare-metal-takehome.elf | rg -n "BEGIN (RSA|PRIVATE|OPENSSH|EC) PRIVATE KEY|ssh-(rsa|ed25519)|BEGIN CERTIFICATE|password|passwd|admin|token|secret|apikey|api_key"
4:[default]\naws_access_key_id = AROA8OSUGYZIZ7LGP7BX\naws_secret_access_key = I3QjGERpxISUFXF9x2ZJ=KrF=tCvvZJl+u3dTVi1\n
35:-----BEGIN RSA PRIVATE KEY-----

# Network intel

/Desktop/team-betterteam-fw/elfs$ strings -n 8 bare-metal-takehome.elf | rg -n "(https?://|ftp://|mqtt://|tcp://|udp://)[A-Za-z0-9\.\-_:]+"

~/Desktop/team-betterteam-fw/elfs$ strings -n 8 bare-metal-takehome.elf | rg -n "([0-9]{1,3}\.){3}[0-9]{1,3}"

# Build metadata & versioning

/Desktop/team-betterteam-fw/elfs$ strings -n 8 bare-metal-takehome.elf | rg -n "gcc|clang|buildroot|jenkins|git|svn|make|cmake|sdk|toolchain"

~/Desktop/team-betterteam-fw/elfs$ strings -n 8 bare-metal-takehome.elf | rg -n "version|ver_|v[0-9]+\.[0-9]+" | head -n 200

# Command and service names

~/Desktop/team-betterteam-fw/elfs$ strings -n 8 bare-metal-takehome.elf | rg -n "(telnetd|dropbear|lighttpd|httpd|sshd|ntpd|dnsmasq|udhcpd|busybox|systemd)"

# Filesystem and path discovery

/Desktop/team-betterteam-fw/elfs$ strings -n 8 bare-metal-takehome.elf | rg -n "/(etc|bin|usr|home|mnt|tmp|var|root)/[A-Za-z0-9_\-/\.]+"


