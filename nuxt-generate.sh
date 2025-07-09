#!/bin/bash
export NVM_DIR="$HOME/.nvm"
# nvm이 초기화되어 있어야 함
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use lts/iron >/dev/null
cd "$(dirname "$0")" && npm run generate