install:
	npm ci

develop:
	npx webpack serve

build:
	NODE_ENV=production npx webpack

lint:
	npx eslint .
	
clean:
	rm -rf dist