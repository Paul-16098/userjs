def main [] {
  const self_dir = path self .
  cd $self_dir

  open ./RegReplaceKey.json | let keys
  open ./RawRegReplace.json | par-each --keep-order {
    tee { print $"do=($in | debug --raw-value)" } | str replace --regex '{([^)]*)}' {|key|
      $keys | get --optional $key | default $"{($key)}"
    }
  } | collect | save --force ./RegReplace.json
}
