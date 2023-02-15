#!/bin/bash

npm run --prefix ../ build \
&& npm pack ../ \
&& npm uninstall @moreillon/prisma-auto-crud-vuetify \
&& npm i ./moreillon-prisma-auto-crud-vuetify-0.0.6.tgz \
&& npm run dev