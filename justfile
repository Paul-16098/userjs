# set unstable
# set lists

# [cache(inputs=["./69shuba auto 書簽/RegReplace.json", "./69shuba auto 書簽/StrReplace.json"])]
push-replace-data:
    git add "./69shuba auto 書簽/RegReplace.json" "./69shuba auto 書簽/StrReplace.json"
    git commit -m "chore(json): update regex patterns in RegReplace.json and StrReplace.json"
    git push
build:
    @echo "{{ BOLD }}nu {{ BLUE }}v{{ `nu -v` }}{{ NORMAL }}{{ BOLD }};pnpm {{ BLUE }}v{{ `pnpm -v` }}{{ NORMAL }}{{ BOLD }};tsc {{ BLUE }}{{ `tsc -V` }}{{ NORMAL }}"
    nu update_sourcemap.nu
    pnpm run fmt
    pnpm run build:less
    pnpm run build
