#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCKER_DIR="${ROOT_DIR}/local-docker"

usage() {
  cat <<USAGE
Usage:
  scripts/local-stack.sh up
  scripts/local-stack.sh down
  scripts/local-stack.sh logs
USAGE
}

command="${1:-}"

case "${command}" in
  up)
    docker compose --env-file "${DOCKER_DIR}/.env" -f "${DOCKER_DIR}/docker-compose.yml" up -d
    ;;
  down)
    docker compose --env-file "${DOCKER_DIR}/.env" -f "${DOCKER_DIR}/docker-compose.yml" down
    ;;
  logs)
    docker compose --env-file "${DOCKER_DIR}/.env" -f "${DOCKER_DIR}/docker-compose.yml" logs -f
    ;;
  *)
    usage
    exit 1
    ;;
esac
