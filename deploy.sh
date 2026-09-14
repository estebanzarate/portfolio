#!/bin/bash
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m'

echo -e "${BLUE}Initializing update process...${NC}"

echo -e "${BLUE}Fetching API data...${NC}"
npm run fetch:all
FETCH_EXIT=$?

if [ $FETCH_EXIT -eq 0 ]; then
  echo -e "${GREEN}Data fetched successfully.${NC}"
else
  if [ ! -f "src/data/machines.json" ] && [ ! -f "src/data/academy.json" ]; then
    echo "ERROR: Critical data files missing. Aborting."
    exit 1
  fi
  echo -e "${YELLOW}Fetch completed with errors. Continuing with available data.${NC}"
fi

echo -e "${BLUE}Generating CV data...${NC}"
python3 getdata/generate_cv_data.py

echo -e "${BLUE}Syncing changes with GitHub...${NC}"

if [[ -n $(git status -s) ]]; then
  git add .
  git commit -m "update(data): $(date +'%Y-%m-%d %H:%M:%S')"
  git push
  echo -e "${GREEN}Portfolio updated and pushed successfully.${NC}"
else
  echo -e "${GREEN}No data changes detected. Git push skipped.${NC}"
fi