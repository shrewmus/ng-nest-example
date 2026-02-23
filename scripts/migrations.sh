#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
TYPEORM_CMD="npm run typeorm --"

usage() {
  cat <<USAGE
Usage:
  scripts/migrations.sh generate <MigrationName>
  scripts/migrations.sh run
  scripts/migrations.sh revert
  scripts/migrations.sh list
  scripts/migrations.sh dry-run
USAGE
}

require_backend() {
  if [[ ! -f "${BACKEND_DIR}/package.json" ]]; then
    echo "Missing backend/package.json"
    exit 1
  fi
}

main() {
  require_backend

  local command="${1:-}"
  shift || true

  case "${command}" in
    generate)
      local name="${1:-}"
      if [[ -z "${name}" ]]; then
        echo "Migration name is required"
        usage
        exit 1
      fi
      (cd "${BACKEND_DIR}" && ${TYPEORM_CMD} migration:generate "src/migrations/${name}" -d typeorm-datasource.ts)
      ;;
    run)
      (cd "${BACKEND_DIR}" && ${TYPEORM_CMD} migration:run -d typeorm-datasource.ts)
      ;;
    revert)
      (cd "${BACKEND_DIR}" && ${TYPEORM_CMD} migration:revert -d typeorm-datasource.ts)
      ;;
    list)
      (cd "${BACKEND_DIR}" && ${TYPEORM_CMD} migration:show -d typeorm-datasource.ts)
      ;;
    dry-run)
      (cd "${BACKEND_DIR}" && ${TYPEORM_CMD} migration:run -d typeorm-datasource.ts --fake)
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"
