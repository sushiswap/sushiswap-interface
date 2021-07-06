{ system ? builtins.currentSystem
, nixpkgs ? import ./nixpkgs.nix { inherit system; }
}:
let
  mkEnv = nixpkgs.callPackage ./mkEnv.nix { };
in
rec {
  inherit nixpkgs;

  env = mkEnv {
    env = {
      # Configure nix to use nixpgks
      NIX_PATH = "nixpkgs=${toString nixpkgs.path}";
    };

    paths = [
      # Development tools
      nixpkgs.yarn
      nixpkgs.nodejs-16_x
      # nixpkgs.nodePackages.node-gyp
      # nixpkgs.python39
      # nixpkgs.python39Packages.pyudev
    ];
  };
}
