push-replace-data:
    git add "./69shuba auto 書簽/RegReplace.json" "./69shuba auto 書簽/StrReplace.json"
    git commit -m "chore(json): update regex patterns in RegReplace.json and StrReplace.json"
    git push
build:
    pnpm run build:less
    pnpm run build
