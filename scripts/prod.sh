#!/usr/bin/env bash

set -euo pipefail

echo "Starting Grocery Compare production-style environment..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
