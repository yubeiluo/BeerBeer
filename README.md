BeerBeer
========

Beer Beer


install dependencies:
     $ cd ../BeerBeer && npm install

   run the app:
     $ DEBUG=BeerBeer ./bin/www


Node JS Notes:

1. Module loading

Core Module

File Module:
extensions: .js, .json, .node
.js: javascript text files
.json: json text files
.node: compiled addon modules loaded with dlopen

loading from node_modules folder

Folders as modules:
1. if the folder contains a package.json file, which contains a main module, then that module wil be required.

2. If not, will try to load 1) index.js  2) index.node
