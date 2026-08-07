build:
	npm install --prefix frontend
	npm run build --prefix frontend

start:
	npx start-server -s ./frontend/dist

.PHONY: build start
