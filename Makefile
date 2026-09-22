install:
	npm install

build:
	npm install
	npm run build

start:
	npx start-server -s ./frontend/dist

.PHONY: install build start