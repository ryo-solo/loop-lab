#!/usr/bin/env bash
# notify.sh — send a one-line update to an external channel.
#
# Designed to be run locally (not in CI). The token is read from a local
# env file at ~/.hermes/.env which is NOT in this repo and never should be.
# If the file is absent, the script exits 0 (no-op) — notification is a
# soft signal, not a deploy gate.
#
# Usage: ./scripts/notify.sh "your message"

set -euo pipefail

MSG="${1:-loop-lab: (no message)}"
ENV_FILE="${HERMES_ENV:-$HOME/.hermes/.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "notify: no env file at $ENV_FILE, skipping" >&2
  exit 0
fi

# Read in a subshell so the token never lands in the parent shell.
(
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a

  if [[ -z "${TELEGRAM_BOT_TOKEN:-}" || -z "${TELEGRAM_HOME_CHANNEL:-}" ]]; then
    echo "notify: env missing TELEGRAM_BOT_TOKEN or TELEGRAM_HOME_CHANNEL" >&2
    exit 0
  fi

  curl -s --max-time 15 \
    "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_HOME_CHANNEL}" \
    -d "parse_mode=HTML" \
    -d "disable_web_page_preview=true" \
    --data-urlencode "text=${MSG}" \
    > /dev/null
) || {
  echo "notify: send failed, continuing" >&2
  exit 0
}

echo "notify: sent"
