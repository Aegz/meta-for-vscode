# meta-for-vscode README

Simple extension for VS Code to hopefully help improve documentation within larger projects.

The motive for something like this is that it's not uncommon to see some documentation in a different location (e.g. Confluence) which is commonly tightly coupled with some code in git which isn't ideal. Alternatively, this documentation might not even exist and has to be passed on in a workshop or on an ad-hoc basis because there are too many files or folders to go through in one sitting.

So the thought was to introduce a .meta folder where its needed and store it in git which would house simple docs to provide some clarification.

```
e.g.
/some-app
- packages
-- .meta <-- We only document the packages folder items
--- next-gen.md
--- package-killer.md
--- apollo.md
--- database.md
--- legacy.md
--- loader.ts.md
-- next-gen
-- package-killer
-- apollo
-- database
-- legacy
-- nodocs <-- This one isn't documented because its special
-- index.ts <-- This file isn't documented either
-- loader.ts
- src
- main.ts
- tsconfig.json
- webpack.config
```

This should be used sparingly and only when necessary. NOT EVERYTHING NEEDS A DOCUMENT and it should only be used when you are certain something will definitely need the extra information or context.

## Features

Right click menu option on files and folders in VS Code which will open the markdown files associated with it in /.meta

## Roadmap

#### Better context menu visibility
Enable context menu item ONLY when the file has documentation to view instead of doing a check every time

#### Cleaner webview
Fix WebView panel so instead of opening and closing on change, it'll reuse the existing panel

#### Config files
Add a paradigm for showing documentation based on a config file which could contain file paths or globs to better control what docs to show.

This would reduce on the duplication of documentation as these could be applied across files or folders based on patterns.

Also this would open up the possibility to allow adding URLs to the documentation process which is useful especially if most of your documentation is external.

```
e.g. 
.metarc
{
    "**/messages.js": {
        uri: "https://documentation/patterns/messages.js"
    },
    "**/portal.js": {
        path: ".meta/portal-all.js.md"
    },
}
```

Once a config file like this is implemented, it could potentially be stuck at the root and the code could just traverse up until it finds one.


#### Hide .meta folders from VSCode
This wouldn't just involve hiding them, it would also mean letting people edit the .md files in .meta through this extension.

The reasoning for doing something like this is just general cleanliness of the sidebar


#### Link to other meta .md files
Link to other meta .md files from existing meta .md files. This could be done via invoking a command for meta to open them