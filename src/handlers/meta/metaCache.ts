// Copyright (c) 2020 whua
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import * as path from 'path';
import * as vscode from 'vscode';
import { MetaCacheNode } from './metaCacheNode';

export class MetaCache {
    // Array of folders and their caches
    private readonly _node = new MetaCacheNode("", "");
    private readonly _pathSegmentsToIgnore: string[];
    public value: string | undefined;

    public constructor() {
        this._pathSegmentsToIgnore = (vscode.workspace.rootPath || "").split(path.sep).filter(part => part);
    }

    private getFilteredPath(filePath: string) {
        return filePath.split(path.sep).filter(part => part).filter((part, index) => {
            return index !== this._pathSegmentsToIgnore.indexOf(part);
        });
    }

    public getByPath(filePath: string) {
        const pathParts = this.getFilteredPath(filePath);
        return this._node.find(pathParts.reverse());
    }

    //
    // When you set, build the cache up as necessary
    public setPath(filePath: string, value: any) {
        const pathParts = this.getFilteredPath(filePath);
        let iterator: MetaCacheNode = this._node;

        pathParts.forEach((part, index) => {
            const cachedPart = iterator.hasKey(part);
            // If there is no match
            if (!cachedPart) {
                // Last path part
                if (index === pathParts.length - 1) {
                    iterator.set(new MetaCacheNode(part, value));
                    return;
                } else {
                    iterator.set(new MetaCacheNode(part, null));
                }

                // Else its a MetaCache, so we can keep going
                const childToIterate = iterator.get(part);
                if (childToIterate) {
                    iterator = childToIterate;
                }
            }
        });
    }
}



// {
//     "**/messages.js": "file to loader",
//     "folder1": {
//         "folder2": "some meta",
//         "a"
//     }
// }