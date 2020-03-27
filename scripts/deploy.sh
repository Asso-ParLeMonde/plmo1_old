#!/bin/bash

# install heroku CLI
wget -qO- https://toolbelt.heroku.com/install.sh | sh

# login to heroku
touch ~/.netrc
echo "machine api.heroku.com
  login ${HEROKU_USERNAME}
  password ${HEROKU_AUTH_TOKEN}
machine git.heroku.com
  login ${HEROKU_USERNAME}
  password ${HEROKU_AUTH_TOKEN}
" >> ~/.netrc

# push image
IMAGE="${REGISTRY_URL}/${HEROKU_APP}/web"
docker build . -t ${IMAGE}
docker login --username=_ --password=$(heroku auth:token) ${REGISTRY_URL}
docker push ${IMAGE}

# release image
heroku container:release web --app ${HEROKU_APP}

docker logout ${REGISTRY_URL}
rm -f ~/.netrc
