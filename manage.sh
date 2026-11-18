
#!/bin/bash

set -e

UPDATE_DATA=false
PUSH_CHANGES=false

show_help() {
    echo "Usage: ./manage.sh [options]"
    echo
    echo "Options:"
    echo "  --data    Update HTB and THM data"
    echo "  --push    Commit and push pending changes"
    echo "  --help    Show this help message"
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --data)
            UPDATE_DATA=true
            ;;
        --push)
            PUSH_CHANGES=true
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo "Error: Unknown option '$1'"
            echo "Use --help to see available options."
            exit 1
            ;;
    esac
    shift
done

if [[ "$UPDATE_DATA" == false && "$PUSH_CHANGES" == false ]]; then
    show_help
    exit 0
fi

update_data() {
    echo "Updating HTB and THM data..."

    if npm run fetch:all; then
        echo "Data updated successfully."
    else
        echo "Error: Data update failed."
        exit 1
    fi
}

push_changes() {
    echo "Checking for pending changes..."

    if [[ -n "$(git status --porcelain)" ]]; then
        git add -A
        git commit -m "Update portfolio data"
        git push

        echo "Changes pushed successfully."
    else
        echo "No changes detected. Skipping Git push."
    fi
}

if [[ "$UPDATE_DATA" == true ]]; then
    update_data
fi

if [[ "$PUSH_CHANGES" == true ]]; then
    push_changes
fi

echo "All requested operations completed."
