build:
	npm run build

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm run test:watch

check:
	npm run typecheck
	npm run test
	npm run lint

bump:
	npm version patch
	git add .
	git push

publish: check bump
	npm publish

up:
	pnpm up