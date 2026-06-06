VERSION := $(shell node -p "require('./package.json').version")
BRANCH := $(shell git branch --show-current)

bump-patch:
	npm version patch --no-git-tag-version

bump-minor:
	npm version minor --no-git-tag-version

bump-major:
	npm version major --no-git-tag-version

bump-beta:
	npm version prerelease --preid=beta --no-git-tag-version

release-beta: bump-beta
	$(eval VERSION := $(shell node -p "require('./package.json').version"))
	git add package.json
	git commit -m "chore: bump version to v$(VERSION)"
	git push
	gh release create v$(VERSION) \
		--prerelease \
		--target $(BRANCH) \
		--title "v$(VERSION)" \
		--notes "Beta release"

release: bump-patch
	$(eval VERSION := $(shell node -p "require('./package.json').version"))
	git add package.json
	git commit -m "chore: bump version to v$(VERSION)"
	git push
	gh release create v$(VERSION) \
		--target $(BRANCH) \
		--title "v$(VERSION)" \
		--notes "Release"

.PHONY: bump-patch bump-minor bump-major bump-beta release-beta release
