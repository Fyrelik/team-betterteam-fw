# Automated Firmware Triage
This is an extensible and robust bash script to assist in extracting and scanning firmware binaries. It ropes in helper scripts to keep the main workflow simple and modular.

---

## Features
- **Auto-dispatch by file type:** Different flows for `.bin` vs `.elf`
- **Customizable helpers:** Each step is a `script_helpers/*.sh` module that you yourself can edit or replace
- **Structured logs:** All output is captured to a per-run logs directory

---

## Folder Layout
```
repo/
├── fw_triage.sh                # Main script
└── script_helpers/             # Helper scripts (sourced at runtime)
    ├── bin_secrets.sh
    ├── binwalk.sh
    ├── dependency_check.sh
    ├── elf_secrets.sh
    ├── header.sh
    └── help.sh
```
> The main script expects all helper modules to be in the `script_helpers` directory

---

## Quick Start
### Basic Usage
```bash
./fw_triage.sh <firmware_file>
```
This will:
- Detect the file type (`.bin` vs `.elf`)
- Run the appropriate analysis workflow
- Save all output logs to a folder named `triage_<firmware_file>` next to your file
- If file is a `.bin`, extracted contents will be saved to `extracted_<firmware_file>`

Example:
```bash
./fw_triage.sh dcs-8000lh.bin
```
Output:
```
dcs-8000lh.bin
triage_dcs-8000lh.bin
 ├── binwalk.log
 └── secrets.log
extracted_dcs_8000lh.bin/
 └── *
```

---

### Specify an Output Directory
```bash
./fw_triage.sh <firmware_file> <output_directory>
```
Example:
```bash
./fw_triage.sh bare-metal-takehome.elf /temp/output/
```
**Output stored in:**
`/temp/output/triage_bare-metal-takehome.elf/*`

---

### Get Help
```bash
./fw_triage.sh -h
```
Displays all options and supported file types

---

## Supported File Types
| File Type | Workflow |
| :--: | :--: |
| `.bin` | Extracted using Binwalk, then scanned for hardcoded secrets and patterns |
| `.elf` | Scanned directly for embedded secrets and metadata |

If the file type is unsupported, you'll get:
```bash
Filetype .<ext> not supported
```

--- 

## Output Files
| File | Description | 
| :--: | :--: |
| `binwalk.log` | Results of firmware extraction |
| `secrets.log` | Discovered strings, keys, credentials, etc. | 
| `extracted_filename` | Extracted data for `.bin` images (if applicable) |

All logs are stored under:
`<output_directory>/triage_<firmware_file>/`


---

## Example Workflow
```bash
# Step 1 - Triage a binary file
./fw_triage.sh firmware.bin

# Step 2 - Review binwalk extraction results
cat triage_firmware.bin/binwalk.log

# Step 3 - Review found secrets
cat triage_firmware.bin/secrets.log

# Step 4 - Manually inspect extracted files
cd triage_firmware.bin/
ls
```

---

## Dependencies
This tool expects the following dependencies to be installed:
- binwalk
- ripgrep
*If these are not found you will be prompted for installation*

Everything else falls under pre-installed coreutils.

---

## Safety Note
Always run firmware triage inside a **sandboxed environment** (VM or container). Extracted firmware files can contain malicious binaries or scripts.

Recommended environments:
- Ubuntu VM
- Docker container with limited privileges

---

## Tips
- You can extend support by adding new or modifying existing helper scripts inside `script_helpers/`
- Logs are automatically rotated per run, meaning you can safely re-run the same command multiple times
- This tool works well for static analysis before deeper dives into triaged results
