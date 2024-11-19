# Obsidian Plugin: Hide Original Xournal++ PDFs
When using [Obsidian](https://obsidian.md) with [Xournal++](https://github.com/jonjampen/obsidian-xournalpp/) I noticed, that I always needed to keep two copies of a PDF I wanted to annotate, because of Xournal++'s background PDF logic.

This plugin solves that problem by hiding all `<filename>.pdf` files from Obsidian's file panel if a `<filename>_a.pdf` file exists. An export of a Xournal++ file is automatically done by the xournalpp plugin every time you edit a Xournal++ file. In order to use it, you just have to name all annotated Xournal++ files `<filename>_a.xopp`.
