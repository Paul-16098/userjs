set unstable
set lists

[cache(extra=`nu --commands 'version|to nuon'` + blake3_file("./69shuba auto 書簽/update-RegReplace.nu"), inputs=["./69shuba auto 書簽/RawRegReplace.json", "./69shuba auto 書簽/RegReplaceKey.json"], outputs="./69shuba auto 書簽/RegReplace.json")]
[script]
update-replace-data:
    nu "./69shuba auto 書簽/update-RegReplace.nu"
push-replace-data: update-replace-data
    git add "./69shuba auto 書簽/RegReplace.json" "./69shuba auto 書簽/StrReplace.json" "./69shuba auto 書簽/RegReplaceKey.json" "./69shuba auto 書簽/update-RegReplace.nu" "./69shuba auto 書簽/RawRegReplace.json"
    git commit -m "chore(json): update regex patterns in RegReplace.json and StrReplace.json"
    git push
build:
    @echo "{{ BOLD }}nu {{ BLUE }}v{{ `nu -v` }}{{ NORMAL }}{{ BOLD }};pnpm {{ BLUE }}v{{ `pnpm -v` }}{{ NORMAL }}{{ BOLD }};tsc {{ BLUE }}{{ `tsc -V` }}{{ NORMAL }}"
    nu update_sourcemap.nu
    pnpm run fmt
    pnpm run build:less
    pnpm run build
