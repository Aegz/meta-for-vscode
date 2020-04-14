// Copyright (c) 2020 whua
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export class MetaCacheNode {
    // Array of folders and their caches
    private readonly children: { [id: string]: MetaCacheNode } = {};
    public readonly name: string;
    public value: string | null;

    public constructor(name: string, value: string | null) {
        this.name = name;
        this.value = value;
    }

    public hasKey(pathSegment: string) {
        return pathSegment in this.children;
    }

    public find(path: string[]): MetaCacheNode | null {
        if (path.length === 0) {
            return this;
        }
        else if (path.length > 0) {
            const fileOrFolderName = path.pop();
            // if we have a name
            if (fileOrFolderName) {
                if (this.children[fileOrFolderName]) {
                    return this.children[fileOrFolderName].find(path);
                }
            }
        }        

        return null;
    }

    public get(name: string): MetaCacheNode | null {
        return this.children[name] || null;
    }

    public set(node: MetaCacheNode) {
        this.children[node.name] = node;
    }
}



// {
//     "**/messages.js": "file to loader",
//     "folder1": {
//         "folder2": "some meta",
//         "a"
//     }
// }