#!/bin/bash
echo "Building frontend"
cd ./frontend && npm install && echo REACT_APP_BASE_APP=/back >> .env.production && npm run build
cd ..
rm -rf ./backend/dist/public
mkdir ./backend/dist
mkdir ./backend/dist/public
mv ./frontend/build/* ./backend/dist/public
echo "Installing backend dependencies"
cd ./backend && npm install && npm install -g typescript
npm install --only=dev
echo "Compiling typescript"
tsc
echo "Removing dev dependencies"
npm prune
cd ..
echo "BUILD Success !!"
