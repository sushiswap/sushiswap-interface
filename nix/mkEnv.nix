{ lib, writeText, buildEnv }:

{ name ? "dev-env"
, # Environment variables to set
  env ? { }
, # Packages to add to the path
  paths ? [ ]
}:
let
  envToBash = name: value:
    "export ${name}=${lib.escapeShellArg (toString value)}"
  ;

  exports = lib.concatStringsSep "\n"
    (map (name: envToBash name env.${name}) (lib.attrNames env));

  env-root = writeText "env-root" ''
    export PATH=@env-root@/bin:$PATH

    ${exports}
  '';
in
buildEnv {
  inherit name;
  paths = paths;
  postBuild = ''
    sed "s|@env-root@|$out|g" ${env-root} > $out/.profile
  '';
}
