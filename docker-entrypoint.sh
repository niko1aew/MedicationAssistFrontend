#!/bin/sh
set -e

# Runtime environment variable substitution
# This allows changing API URL without rebuilding the image

if [ -n "$RUNTIME_API_URL" ]; then
    echo "Substituting API URL with: $RUNTIME_API_URL"
    
    # Find and replace the API URL in JS files
    find /usr/share/nginx/html/assets -name '*.js' -exec sed -i "s|http://localhost:5018/api|$RUNTIME_API_URL|g" {} \;
fi

exec "$@"

