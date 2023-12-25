#!/bin/bash

OLDPWD="$(pwd)"
cd /home/rocky/barnabe
$HOME/.bun/bin/bun install
cd "$OLDPWD"