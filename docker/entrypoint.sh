#!/bin/sh

ROOT_DIR=/app

# Replace env vars in files served by NGINX
echo "Replacing environment variables"
for file in $ROOT_DIR/assets/*.js*;
do
  echo "Processing $file ...";

  sed -i 's|VITE_API_URL_PLACEHOLDER|'${VITE_API_URL}'|g' $file

done

echo "Starting Nginx"
nginx -g 'daemon off;'
