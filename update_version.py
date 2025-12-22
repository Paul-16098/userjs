from glob import glob
import json
import re

with open("./F.json", "rt", encoding="utf-8") as f:
    F: dict[str, bool] = json.load(f)
    # 條件對應表，控制條件編譯的開關
    CONDITIONS: dict[str, bool] = {"True": True, "False": False}
    CONDITIONS.update(F)


def clean_version_tag(text: str) -> str:
    """
    移除 @version 標籤中的 -beta 標記，只保留主版本號
    """

    return re.sub(r"// @version\s+((\d+\.?)+)(-beta\d*)?", r"// @version      \1", text)


def process_require_blocks(text: str) -> str:
    """
    處理條件 @require 區塊，根據 CONDITIONS 決定是否啟用
    """

    def repl(match: re.Match[str]) -> str:
        directive, cond, url = match.group(1), match.group(2).strip(), match.group(3)
        if directive == "if":
            if CONDITIONS.get(cond, False):
                return f"//#if {cond}\n// @require {url}"
            else:
                return f"//#if {cond}\n// #@require {url}"
        elif directive == "else":
            return f"//#else\n// @require {url}"
        elif directive == "endif":
            return f"//#endif\n// @require {url}"
        else:
            return match.group(0)

    # directive & cond
    directive_pattern = r"//#(if|else|endif)\s*(.*?)"
    pattern = directive_pattern + r"\n//\s?#?@require\s+(file://[^\s]+|https://[^\s]+)"
    return re.sub(pattern, repl, text)


def update_user_ts_file(file_path: str) -> bool:
    """
    處理單一 .user.ts 檔案，回傳是否有變更
    """
    with open(file_path, "r", encoding="utf-8") as f:
        original = f.read()
    updated = clean_version_tag(original)
    updated = process_require_blocks(updated)
    if updated != original:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(updated)
        return True
    return False


def main():
    """
    主流程：批次處理所有 .user.ts 檔案
    """

    for file in glob("./*/*.user.ts"):
        try:
            if update_user_ts_file(file):
                print(f"Updated: {file}")
        except Exception as e:
            print(f"Error processing file {file}: {e}")


if __name__ == "__main__":
    main()
