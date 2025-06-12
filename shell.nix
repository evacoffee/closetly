{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
  ];

  shellHook = ''
    echo "Node.js and npm are ready to use!"
    echo "Node.js version: $(node --version)"
    echo "npm version: $(npm --version)"
  '';
}
