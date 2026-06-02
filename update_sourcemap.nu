# This script updates the `mapRoot` and `sourceRoot` properties in all `tsconfig.json` files found in the subdirectories of the current directory. It sets these properties to a URL that points to the corresponding directory in the GitHub repository.
export def main []: nothing -> nothing {
  glob ./*/tsconfig.json | par-each {
    let path | open $in | let new

    print $"Processing ($path)"

    let p = $"https://github.com/Paul-16098/userjs/raw/dev/($path | path dirname | path basename)"

    print $"Setting mapRoot and sourceRoot to ($p)"

    $new | upsert compilerOptions.mapRoot $p | upsert compilerOptions.sourceRoot $p | save $path --force
  }

  print "Updated mapRoot and sourceRoot in all tsconfig.json files."
}
