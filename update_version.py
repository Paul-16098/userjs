#!/usr/bin/env python3
"""
Userscript Version & Conditional Require Processor

This script processes Tampermonkey userscript .user.ts files to:
1. Clean @version tags (remove -beta suffixes)
2. Process conditional @require blocks based on F.json configuration

Conditional blocks follow this pattern:
    //#if debug
    // #@require file://C:\\path\\to\\local\\file.js
    //#else
    // @require https://github.com/user/repo/raw/branch/file.js
    //#endif

When debug=true in F.json, the local file:// line becomes active.
When debug=false, the remote https:// line becomes active.
"""

from glob import glob
from pathlib import Path
import json
import re
import sys
from typing import Dict, Tuple

# Load configuration
CONFIG_FILE = Path("./F.json")
with open(CONFIG_FILE, "rt", encoding="utf-8") as f:
    F: Dict[str, bool] = json.load(f)
    CONDITIONS: Dict[str, bool] = {"True": True, "False": False}
    CONDITIONS.update(F)

    # parse cli args into CONDITIONS
    def _parse_bool(v: str):
        v = v.strip().lower()
        if v in ("1", "true", "t", "yes", "y", "on"):
            return True
        if v in ("0", "false", "f", "no", "n", "off"):
            return False
        return None

    args = sys.argv[1:]
    for arg in args:
        if arg in ("-h", "--help"):
            print("Usage: update_version.py [key[=value] ...]")
            print("Examples: debug, debug=false, feature=True")
            sys.exit(0)
        if arg.startswith("--"):
            arg = arg[2:]
        if not arg:
            continue
        if "=" in arg:
            key, val = arg.split("=", 1)
        else:
            key, val = arg, "true"
        b = _parse_bool(val)
        if b is None:
            # ignore non-boolean values
            continue
        CONDITIONS[key] = b


def clean_version_tag(text: str) -> str:
    """
    Remove -beta suffix from @version tags, keeping only the numeric version.

    Example:
        // @version 3.5.13.0-beta1 → // @version      3.5.13.0
    """
    return re.sub(
        r"// @version\s+((?:\d+\.?)+)(?:-beta\d*)?", r"// @version      \1", text
    )


def process_require_blocks(text: str) -> str:
    """
    Process conditional @require blocks based on CONDITIONS.

    Handles #if/#else/#endif directives to toggle between local and remote requires.
    Active lines: // @require
    Inactive lines: // #@require
    """
    lines = text.split("\n")
    result = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Match #if directive
        if_match = re.match(r"^//#if\s+(\w+)\s*$", line)
        if if_match:
            condition = if_match.group(1)
            is_active = CONDITIONS.get(condition, False)

            # Collect the entire conditional block
            block_lines = [line]
            i += 1

            # Track nesting and find matching #endif
            nesting = 1
            in_else = False

            while i < len(lines) and nesting > 0:
                current = lines[i]

                if re.match(r"^//#if\s+\w+\s*$", current):
                    nesting += 1
                elif re.match(r"^//#endif\s*$", current):
                    nesting -= 1
                    if nesting == 0:
                        block_lines.append(current)
                        break
                elif nesting == 1 and re.match(r"^//#else\s*$", current):
                    in_else = True
                    block_lines.append(current)
                    i += 1
                    continue

                # Process @require lines based on condition
                require_match = re.match(r"^//\s?(#?)@require\s+(.+)$", current)
                if require_match:
                    url = require_match.group(2)

                    # Determine if this line should be active
                    should_activate = (is_active and not in_else) or (
                        not is_active and in_else
                    )

                    if should_activate:
                        block_lines.append(f"// @require {url}")
                    else:
                        block_lines.append(f"// #@require {url}")
                else:
                    block_lines.append(current)

                i += 1

            result.extend(block_lines)
            i += 1
            continue

        result.append(line)
        i += 1

    return "\n".join(result)


def update_user_ts_file(file_path: str) -> Tuple[bool, str]:
    """
    Process a single .user.ts file.

    Returns:
        (changed: bool, message: str)
    """
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            original = f.read()

        updated = clean_version_tag(original)
        updated = process_require_blocks(updated)

        if updated != original:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(updated)
            return True, "Updated"
        return False, "No changes"
    except Exception as e:
        return False, f"Error: {e}"


def main():
    """
    Main entry point: batch process all .user.ts files.
    """
    print(f"Configuration loaded from {CONFIG_FILE}:")
    for key, value in CONDITIONS.items():
        print(f"  {key}: {value}")
    print()

    files = sorted(glob("./*/*.user.ts"))
    if not files:
        print("No .user.ts files found.")
        return

    updated_count = 0
    for file in files:
        changed, message = update_user_ts_file(file)
        if changed:
            print(f"✓ {file}: {message}")
            updated_count += 1
        else:
            print(f"  {file}: {message}")

    print(f"\nProcessed {len(files)} files, updated {updated_count}.")


if __name__ == "__main__":
    main()
