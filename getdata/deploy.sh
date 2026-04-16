#!/bin/bash

# Define UI colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Initializing update process...${NC}"

# 1. Execute data fetcher
echo -e "${BLUE}📦 Fetching API data...${NC}"
npm run fetch:all

# Check if fetch was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Data fetched successfully.${NC}"
else
    echo "❌ Error during data fetch. Aborting."
    exit 1
fi

# 2. Automated Git Workflow
echo -e "${BLUE}⚙️  Syncing changes with GitHub...${NC}"

# Only commit if there are changes to the data files
if [[ -n $(git status -s) ]]; then
    git add .
    git commit -m "update(data): $(date +'%Y-%m-%d %H:%M:%S')"
    git push
    echo -e "${GREEN}✨ Portfolio updated and pushed successfully!${NC}"
else
    echo -e "${GREEN}✅ No data changes detected. Git push skipped.${NC}"
fi