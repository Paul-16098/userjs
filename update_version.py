from glob import glob
import re


def replace_version(ver: re.Match[str]) -> str:
    # print(ver.groups())
    new_ver = ver.group(1)
    new_ver = re.sub(r"-bate\d+", "", new_ver)
    return f"// @version      {new_ver}"


# 查找所有 .user.ts 文件
for file in glob("./*/*.user.ts"):
    try:
        with open(file, "r", encoding="utf-8") as f:
            txt = f.read()

        # 使用正则表达式替换版本号
        new_txt = re.sub(pattern=r"// @version\s+((\d+\.?)+(-bate\d+)?)",
                         repl=replace_version, string=txt)

        # 写回文件
        with open(file, "w", encoding="utf-8") as f:
            f.write(new_txt)

    except Exception as e:
        print(f"Error processing file {file}: {e}")
