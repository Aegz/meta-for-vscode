# Config GLOB HIT
This markdown file will only be hit via the glob in the config file

In this example, the .metarc file has one globs:

| glob | target file |
| -- | -- |
| **/aFolder.js | aFolder-default.md |

This results in the following files receiving positive metadata hits:
- /aFolder/aFolder

## Ordering
It's worth noting that the ROOT some-file is excluded from this. The reason for this is that the .meta is found first and as a result just terminates the search for more documents.