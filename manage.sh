
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
            echo "ERROR: Unknown option '$1'"
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
    echo
    echo "========================================"
    echo "          DATA SYNCHRONIZATION"
    echo "========================================"

    if npm run fetch:all; then
        echo
        echo "[SUCCESS] Data synchronization completed."
    else
        echo
        echo "[FAILED] Data synchronization failed."
        echo "[SKIPPED] Git push will not be executed."
        exit 1
    fi
}

push_changes() {
    echo
    echo "========================================"
    echo "             GIT PUSH"
    echo "========================================"

    echo "Checking for pending changes..."

    if [[ -n "$(git status --porcelain)" ]]; then
        git add -A

        if git commit -m "Update portfolio data"; then
            git push
            echo
            echo "[SUCCESS] Changes pushed successfully."
        else
            echo
            echo "[FAILED] Git commit failed."
            exit 1
        fi
    else
        echo "[SKIPPED] No changes detected."
    fi
}

if [[ "$UPDATE_DATA" == true ]]; then
    update_data
fi

if [[ "$PUSH_CHANGES" == true ]]; then
    push_changes
fi

echo
echo "========================================"
echo "       ALL OPERATIONS COMPLETED"
echo "========================================"
