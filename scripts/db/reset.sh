#!/bin/bash

~/.bun/bin/bun x prisma db push
~/.bun/bin/bun x prisma db seed
~/.bun/bin/bun x prisma generate
