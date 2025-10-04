# Initial Findings
- Boot loader: `U-Boot 2014.01-rc2-V1.01 (June 07 2017 - 17:44:09)`
- Chipset: `Realtek?`
- Something: TFTP
- DCS-8000LH

- Boot Vulns:
    - Versions 2013.07-rc1 to 2014.07-rc2 - Verified boot bypass
        - Improper enforcement of Flattened Image Tree (FIT) image signatures allows a local attacker to supply a legacy image and execute an unsigned kernel
            - FIT: Single, unified file format for storing and booting multiple software components, such as a kernel, initramfs, and device tree blob.

    - Network booting vulns:
        - Versions that support network booting protocols like TFTP
        - NFS Overflows (CVE-2019-14192)
            - Attackers in the same network/controlling malicious NFS server can gain code execution by exploiting network packet parsing bugs, like buffer overlow.
            - 2014.01 has very similar network boot vulns
