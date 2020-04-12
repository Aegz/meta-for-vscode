// Copyright (c) 2020 whua
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import * as path from 'path';

export class MetaCache {
    // Array of folders and their caches
    private readonly _children: { [id: string]: string | MetaCache } = {};
    private readonly _globPatterns = {};

    public getByPath(filePath: string) {
        const pathParts = filePath.split(path.sep).filter(part => part);

        let iterator: MetaCache = this;

        // Check for immediate match first
        for (let part of pathParts) {
            const cachedPart = iterator.get(part);

            if (cachedPart) {
                if (typeof cachedPart === 'string') {
                    return cachedPart;
                }

                // Else its a MetaCache, so we can keep going
                iterator = cachedPart;
            }
        }
        
        // Glob match as a fallback

        return null;
    }

    private get(pathSegment: string): string | MetaCache | null {
        if (this._children[pathSegment]) {
            return this._children[pathSegment];
        }
        return null;
    }

    //
    // When you set, build the cache up as necessary
    public setPath(filePath: string, value: any) {
        const pathParts = filePath.split(path.sep).filter(part => part);

        let iterator: MetaCache = this;

        pathParts.forEach((part, index) => {
            const cachedPart = iterator.get(part);
            // If there is no match
            if (!cachedPart) {
                // Last path part
                if (index === pathParts.length - 1) {
                    iterator.set(part, value);
                    return;
                }

                // Else its a MetaCache, so we can keep going
                const newCache = new MetaCache();
                iterator.set(part, newCache);
                
                iterator = newCache;
            }
        });
    }

    private set(pathSegment: string, value: string | MetaCache) {
        this._children[pathSegment] = value;
    }

}



// {
//     "**/messages.js": "file to loader",
//     "folder1": {
//         "folder2": "some meta",
//         "a"
//     }
// }