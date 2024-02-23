#!/bin/bash
set -xeo pipefail
prisma generate
prisma db push
