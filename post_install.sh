#!/bin/bash
gem install compass
./node_modules/bower/bin/bower install
grunt build --force
# cp -r ./app/images ./dist/images
# cp -r ./app/images/favicons ./dist/images/favicons
# cp -r ./app/resources ./dist/resources
# cp -r ./app/env.js ./dist/env.js