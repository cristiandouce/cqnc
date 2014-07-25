
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

node_modules: package.json
	@npm install --dev

clean:
	rm -fr build components

test-browser: node_modules build
	@./node_modules/.bin/component-test browser

test: node_modules build
	@./node_modules/.bin/component-test phantom

.PHONY: build clean test
