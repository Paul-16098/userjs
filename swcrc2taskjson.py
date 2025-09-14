import json
from typing import Any

with open("./.swcrc", "r") as f:
    swcrc: dict[str, Any] = json.load(f)

arg = 'npx swc "." --no-swcrc --out-dir "."  --only "**/*.user.ts"'
# print(swcrc)


t = {
    "version": "2.0.0",
    "tasks": [
        {
            "type": "process",
            "group": "build",
            "label": "swc: build",
            "command": "npx",
            "args": [],
            "isBuildCommand": True,
        },
        {
            "type": "process",
            "group": "build",
            "label": "swc: watch",
            "command": "npx",
            "args": [],
            "isBackground": True,
        },
        {
            "type": "process",
            "command": "python",
            "args": [__file__.split("\\")[-1]],
            "problemMatcher": "$python",
            "label": "swcrc to taskjson",
            "group": "build",
        },
    ],
}


def p_arg(d: dict) -> str:
    arg = ""
    for k, v in d.items():
        # print(f"{k}: {v}")
        if k == "$schema":
            continue
        if type(v) is str:
            arg += f"-C {k}={repr(v)} "
            continue
        if v is True:
            v = "true"
        if v is False:
            v = "false"
        if v is None:
            v = "null"
        if type(v) is dict:
            arg += p_arg(v).replace("-C ", f"-C {k}.")
            continue
        arg += f"-C {k}={v} "
    return arg


arg += p_arg(swcrc)

# print(arg)
argl = arg.split(" ")
argl.pop(0)  # remove npx
t["tasks"][0]["args"] = argl # type: ignore
t["tasks"][1]["args"] = argl.copy() # type: ignore
t["tasks"][1]["args"].append("-w") # type: ignore
with open("./.vscode/tasks.json", "w") as f:
    json.dump(t, f, indent=2, ensure_ascii=False)
