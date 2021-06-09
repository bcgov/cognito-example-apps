SHELL := /usr/bin/env bash

# see https://asdf-vm.com/#/core-manage-asdf?id=install
.PHONY: local-setup
local-setup:
	cat .tool-versions | cut -f 1 -d ' ' | xargs -n 1 asdf plugin-add || true
	asdf plugin-update --all
	bash ~/.asdf/plugins/nodejs/bin/import-release-team-keyring
	asdf install
	asdf reshim
	python -m pip --version
	pip install -r requirements.txt
	pre-commit install
	gitlint install-hook
