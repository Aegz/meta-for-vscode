# Config GLOB HIT
This markdown file will only be hit via the glob in the config file

In this example, the .metarc file has two globs:

| glob | target file |
| -- | -- |
| **/childFile.js | aChild-default.js.md |
| **/childFolder  | aChild-default.js.md |

This results in the following files receiving positive metadata hits:
- /childFile.js
- /aFolder/childFile.js
- /aFolder/childFolder