def main [] {
  const SELF_DIR = path self .
  cd $SELF_DIR # nu-lint-ignore: catch_builtin_error_try

  let keys = open ./RegReplaceKey.json # nu-lint-ignore: catch_builtin_error_try
  # nu-lint-ignore: catch_builtin_error_try
  open ./RawRegReplace.json | each {
    tee { print $"do=($in | debug --raw-value)" }
    | str replace --all --regex '{([^}]*)}' {|key|
      print $"\tkey=($key)"
      $keys | get --optional $key | default $"{($key)}"
    }
  } | save --force ./RegReplace.json # nu-lint-ignore: catch_builtin_error_try
}
