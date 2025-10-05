# Initial Findings
- Boot loader: `U-Boot 2014.01-rc2-V1.01 (June 07 2017 - 17:44:09)`
- Chipset: `Realtek?`
- Something: TFTP
- DCS-8000LH





# command used 
grep -R --line-number -iE --exclude-dir=js "root:|:x:|:\!|BEGIN RSA PRIVATE KEY| BEGIN PRIVATE KEY|ssh-rsa" _dcs-8000lh.bin.extracted/| sed -n '1,200p'

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

# Command used
rg -i --hidden --no-mmap "BEGIN|BEGIN RSA|ssh-rsa|rsa_public|modulus| public key|pem" -n extracted/dlink/_dcs-8000lh.bin.extracted/ || true

# Findings:
extracted/dlink/_dcs-8000lh.bin.extracted/_160000.extracted/db/verify.key
1:-----BEGIN PUBLIC KEY-----
6:-----END PUBLIC KEY-----

extracted/dlink/_dcs-8000lh.bin.extracted/_160000.extracted/db/db.xml
899:<PemExist type="1" content="1" />
917:</CertificateReq> <HTTPSPem>
921:<pemData type="5"
922:content="-----BEGIN PRIVATE KEY-----
950:<pemData2 type="5"
951:content="-----BEGIN CERTIFICATE-----
969:Uz0GtbE2GVyL9nc+YyEVMJPeMq8l+ez64le05OFzwPHPLc5YTT+titnT0ZO1yxBq
974:</HTTPSPem> <TimeZone>
1315:<Target typem="3" content="TargetCShotSam" />

- Evidence of plain text keys

922:content="-----BEGIN PRIVATE KEY-----
923-MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC03Dn068+mvF3x
924-MPIqO/TjqpBphazNHWnDKP7sdtX7mr7RBWsVVPAqSjXl5FiuhIq9i/rjNvrwPL1e
925-2v3U3z7g07SkK4e2Y3c2LV++ThJPcqjopA53/UBTmVPUJ04mrEKB211XWSZ/4VEO
926-RMuO7/JPJ1OPYaMN8URBwBl7ON7oWoW3q5yP912Lgq/KkP7/KK9O4xso3BgyVwWd
927-CDAM75x+zNVhzXjFqmr3xGu+YwiGLqaN2kPPpl5S2zYdFlmV+bbz7Xmmic66cSTW
928-wKmzNnxPyKl1wfuiLyMyEAZ9w9U0lQXysrO9s80z68v9ik8pyTV61UEIIbanPk2E
929-zteWEz5zAgMBAAECggEBAKgMxXF1NzIHbwawYyOpKEfu8VaLVeAVB3PGgPB5DyVF
930-SS5w6WodzTaOU/xzq48lKsEq8wjyykI1PgSIWTjV4tgG/p9YrzZiv59Ak+kBI/Rc
931-ZuQbpDILyBylqIXFq9E1WGrOyLFj7ej/FFC8zaPYAn9X3EWrBFXtK24or8SWOFEO
932-U6qeO6Xycf4uu8z+zWdEQpm97bqASvj2kbbKYaXTJMvaxbpnPxIFkfxsu9kCQP5H
933-UxOjXZAcD7+Trmp4WhPVFUQP+QPUI6ihXBUKxdEwKQbWKIvEayYmuLfZF2HYg5Es
934-rDKO1PoSNhZV8i1d6z28ctxhPh5GEHf3U6A849MyILkCgYEA2psXs4StUN6lHxWp
935-Q+S17VuQInAOm1bTJ2I6dil2n08frauIFUEwaXN1nWiFllyn6zUmVKyLgf2d/fuN
936-dOPBIhT7KfNx32nvDMF4p+ex/+uNWsS1l0qqfujGt9bEzO0TiC+SMx8kH9byA+AE
937-4Fj4OVERd203zTWSGzDoCJaPGK8CgYEA08w6W0POjvp+Iq+fW6ou2PI1NKBgqpH7
938-PaZNeE5TUrljIjMqofy3KkHlF5YUfhhShoyVATh2bXwKNErKBeCSvCgAfJtqiU1e
939-JJ4d0zlFNP/7urVZZW2k5A7TsTBsjVcQTFKcs69tPe5H+jRDpIBt+Ixn8QpQSaoB
940-rFUm9wT5H30CgYAUQ4on5uWV+H1/6ycclwfSL8mll5OTDLJYFT/sEh3f2JrMI3li
941-1v8g10YQyE6RyJb8M5oRAUmRTCwoDfhn3HDbsuwxUFK+7ffty8VecxjJ61DYGCHp
942-G0/Aod1Bz1PA1z0XQ6meuYVEuk0G1O4+yaCA16Xx1xr0F8IqaRcpLKOpGwKBgHba
943-b5ERjxOrPCdo2IuPB/UUjoj2yuhNPWkOLwEpKxcME7Z4ch8u+vaKve2redp8+aqp
944-r2Bc+BBegDdyFMaRjKZr6EIE0Rc1xHPWCzSiOdURJYlUBVOm4NZd/6u6WeBDEFFU
945-Nr2a3znWwquEssTYkV3eJOIeAIomDgRQUKpkLwzdAoGANgeyqPWYyZirigJVpzkw
946-Vkp1EaPOExIZ3bBNdXpCGPW3qKySnGTA5M9TOtRAxYC769XvFTZ1YQfTdlypT33G
947-uumEXaV+LNn9H3VK1U4MR1hP5yuWb0wzauPQhLWWrkH05bWElng9CuT8zmvd1HLf
948-V1c6clJiKhyWl3FYYquXxX4=
949:-----END PRIVATE KEY-----" />
951-content="-----BEGIN CERTIFICATE-----
952-MIIDzTCCArWgAwIBAgIJAO1egRVfJA40MA0GCSqGSIb3DQEBCwUAMH0xCzAJBgNV
953-BAYTAlRXMQ0wCwYDVQQIDARBc2lhMQ0wCwYDVQQHDARBc2lhMRswGQYDVQQKDBJE
954-LUxpbmsgQ29ycG9yYXRpb24xGzAZBgNVBAsMEkQtTGluayBDb3Jwb3JhdGlvbjEW
955-MBQGA1UEAwwNd3d3LmRsaW5rLmNvbTAeFw0xNzA2MDcwMDAwMTRaFw0yNzA2MDUw
956-MDAwMTRaMH0xCzAJBgNVBAYTAlRXMQ0wCwYDVQQIDARBc2lhMQ0wCwYDVQQHDARB
957-c2lhMRswGQYDVQQKDBJELUxpbmsgQ29ycG9yYXRpb24xGzAZBgNVBAsMEkQtTGlu
958-ayBDb3Jwb3JhdGlvbjEWMBQGA1UEAwwNd3d3LmRsaW5rLmNvbTCCASIwDQYJKoZI
959-hvcNAQEBBQADggEPADCCAQoCggEBALTcOfTrz6a8XfEw8io79OOqkGmFrM0dacMo
960-/ux21fuavtEFaxVU8CpKNeXkWK6Eir2L+uM2+vA8vV7a/dTfPuDTtKQrh7ZjdzYt
961-X75OEk9yqOikDnf9QFOZU9QnTiasQoHbXVdZJn/hUQ5Ey47v8k8nU49how3xREHA
962-GXs43uhahbernI/3XYuCr8qQ/v8or07jGyjcGDJXBZ0IMAzvnH7M1WHNeMWqavfE
963-a75jCIYupo3aQ8+mXlLbNh0WWZX5tvPteaaJzrpxJNbAqbM2fE/IqXXB+6IvIzIQ
964-Bn3D1TSVBfKys72zzTPry/2KTynJNXrVQQghtqc+TYTO15YTPnMCAwEAAaNQME4w
965-HQYDVR0OBBYEFHChWLt+cWZsPh1CTM3mAfcQoSFDMB8GA1UdIwQYMBaAFHChWLt+
966-cWZsPh1CTM3mAfcQoSFDMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEB
967-AIAQjBeldbyrGaeTcdJFBQExfxow/eaIT0cLrI0z49/OTLJ/TQVYLXSI72Qa94ar
968-sQSQZwIyOm4aqznZCNC8ELODw2wNoTLpKPH1VBSwl53pgC1jwMKhJ5kc2EZ0YzWf
969-Uz0GtbE2GVyL9nc+YyEVMJPeMq8l+ez64le05OFzwPHPLc5YTT+titnT0ZO1yxBq
970-tOAq+o827nsEynC4LgOo0JrSm8o4PUXA0cP/VUxyb0xbLvEGnY1Sha61uyQ5Z2i8
971-iIBabm8vdO2/hPuWphO90bD+j4CwuXRnHhDs1nsq1/bLO2PS9p+bGnwEmWAazTjT
972-MZaKfSH7xFZvxCjbsVjZQWA=
973------END CERTIFICATE-----" />

## extraction

`binwalk -me <FILE>`

- Boot Vulns:
    - Versions 2013.07-rc1 to 2014.07-rc2 - Verified boot bypass
        - Improper enforcement of Flattened Image Tree (FIT) image signatures allows a local attacker to supply a legacy image and execute an unsigned kernel
            - FIT: Single, unified file format for storing and booting multiple software components, such as a kernel, initramfs, and device tree blob.

    - Network booting vulns:
        - Versions that support network booting protocols like TFTP
        - NFS Overflows (CVE-2019-14192)
            - Attackers in the same network/controlling malicious NFS server can gain code execution by exploiting network packet parsing bugs, like buffer overlow.
            - 2014.01 has very similar network boot vulns

