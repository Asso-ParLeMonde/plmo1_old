#!/bin/bash
REGISTRY_URL=registry.heroku.com
HEROKU_APP=par-le-monde-1

IMAGE="${REGISTRY_URL}/${HEROKU_APP}/web"
docker build . -t ${IMAGE}
docker login --username=_ --password=$(heroku auth:token) ${REGISTRY_URL}
docker push ${IMAGE}

# release image
heroku container:release web -app ${HEROKU_APP}
docker logout ${REGISTRY_URL}