#!/bin/bash

npm run --prefix ../ build \
&& npm pack ../ \
&& npm uninstall @moreillon/prisma-auto-crud-vuetify \
&& npm i ./moreillon-prisma-auto-crud-vuetify-*.*.*.tgz \
&& npm run dev