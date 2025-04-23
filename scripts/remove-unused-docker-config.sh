#!/usr/bin/env bash
# prune-unused-configs.sh
# Lists Docker Swarm configs not referenced by any service.
# If you pass “--delete” it will remove them.

set -euo pipefail

# 1) Gather all config IDs in use by any service
used_configs=$(docker service ls -q \
  | xargs -r docker service inspect \
      --format '{{range .Spec.TaskTemplate.ContainerSpec.Configs}}{{.ConfigID}}{{"\n"}}{{end}}' \
  | sort -u)

# 2) Gather all config IDs
all_configs=$(docker config ls -q)

# 3) Compute unused = all_configs − used_configs
#    grep -vxF: drop lines matching any of used_configs
unused_configs=$(printf '%s\n' "$all_configs" \
  | grep -vxF -f <(printf '%s\n' "$used_configs") || true)

if [[ -z "$unused_configs" ]]; then
  echo "No unused configs found."
  exit 0
fi

echo "Unused configs:"
printf '%s\n' "$unused_configs"

if [[ "${1:-}" == "--delete" ]]; then
  echo "Deleting unused configs..."
  # xargs -r: only run if input non-empty
  printf '%s\n' "$unused_configs" | xargs -r docker config rm
  echo "Done."
else
  echo
  echo "To delete these configs, re-run with the “--delete” flag:"
  echo "  $0 --delete"
fi
