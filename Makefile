VERSION := $(shell jq -r '.version' manifest.json)
ZIP_NAME := intervals-icu-extension-v$(VERSION).zip

FILES := manifest.json content.js icons/icon-16.png icons/icon-32.png icons/icon-48.png icons/icon-128.png

.PHONY: all zip clean

all: zip

zip:
	@echo "Building $(ZIP_NAME)..."
	@zip $(ZIP_NAME) $(FILES)
	@echo "Done: $(ZIP_NAME)"

clean:
	@rm -f intervals-icu-extension-v*.zip
