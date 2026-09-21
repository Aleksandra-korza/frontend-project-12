install:
	npm install
	npm install --prefix frontend

build:
	npm run build --prefix frontend

start:
	npx start-server -s ./frontend/dist

.PHONY: install build start

