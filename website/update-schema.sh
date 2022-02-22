#!/bin/bash
set -xeo pipefail
yarn run prisma generate
yarn run prisma db push
