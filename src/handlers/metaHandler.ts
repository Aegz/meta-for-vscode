import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as micromatch from 'micromatch';

import { MetaCache } from './meta/metaCache';

export interface DocumentFetchResult {
	status: MetaFetchResult;
	meta?: DocumentMeta
}

export interface DocumentMeta {
	name: string;
	documentation: string;
}

export enum MetaFetchResult {
	MetaNotFound = 0,
	MetaAndMatchFound = 1,
	MetaAndNoMatch = 2
}

/**
 * Handles the panel state etc.
 */
export class MetaHandler {
	// Cache the different layers of results for any glob type results
	private readonly _metaCache: MetaCache; 
	
	public constructor() {
		this._metaCache = new MetaCache();
	}

	/// Performs the discovery logic to try and determine if there is a valid
	/// meta folder or config for it to use
	public getMeta(uri: vscode.Uri): DocumentFetchResult {
		if (!uri || (uri.scheme !== "file")) {
			return {
				status: MetaFetchResult.MetaNotFound
			};
		}

		// get the parent folder so we can scan and see if the file exists
		const { fileName } = this.seperateFileOrFolderFromPath(uri.path);

		for(let fetchFunction of [this.testCacheForMeta, this.testLocalMetaFolder, this.testConfigFiles]) {
			let result;
			if (result = fetchFunction.apply(this, [uri.path])) {
				// Cache the result
				this._metaCache.setPath(uri.path, result);
				
				// return an object with the status
				return {
					status: MetaFetchResult.MetaAndMatchFound,
					meta: {
						name: fileName,
						documentation: result
					}
				};
			}
		}

		// Else we can try and find a higher level result
		return {
			status: MetaFetchResult.MetaNotFound
		};
	}

	private testLocalMetaFolder(filePath: string) {
		const { pathSegments, fileName } = this.seperateFileOrFolderFromPath(filePath);
		const immediateMetaFolder = [...pathSegments, ".meta"].join(path.sep);

		// Check if the local meta folder exists AND that the folder contains the appropriate md file inside of it
		if (fileName && fs.existsSync(immediateMetaFolder)) {
			const metaFile = [immediateMetaFolder, `${fileName}.md`].join(path.sep);

			// If we find a valid meta file
			if (fs.existsSync(metaFile)) {
				// Set the cache value since we have a HIT
				this._metaCache.setPath(filePath, metaFile);

				return metaFile;
			}
		}

		return null;
	}

	private testConfigFiles(filePath: string) {
		const { pathSegments, fileName } = this.seperateFileOrFolderFromPath(filePath);
		let depth = 0;

		// With the path, start dropping elements off the end and checking for a local .metarc file
		while (pathSegments.length > 0) {
			const potentialMetaRcFile = [...pathSegments, '.metarc'].join(path.sep);
			if (fs.existsSync(potentialMetaRcFile)) {
				// Check for a .metarc file
				const metarc = require(`${path.sep}${potentialMetaRcFile}`);

				// Just check for a direct match 
				if (depth === 0 && metarc[fileName]) {
					// We'll check the config for a match against this file
					return metarc[fileName];
				}

				// For each of the keys that has a * we want to see if there is a match
				const possibleRules = Object.keys(metarc).filter(name => name.includes("*"));
				for (const rule of possibleRules) {
					// If there is a match we want, return the MD file for it
					if (micromatch.isMatch(filePath, rule)) {
						return [...pathSegments, metarc[rule]].join(path.sep);
					}
				}
			}

			// Traverse downwards
			pathSegments.pop();
			depth++;
		}

		return null;
	}

	private testCacheForMeta(filePath: string) {
		let cacheResult;
		
		// Check if our cache has the location of a valid meta file
		if (cacheResult = this._metaCache.getByPath(filePath)) {
			// Check that the cache hit is still valid (i.e: the file exists)
			if (fs.existsSync(cacheResult)) {
				return cacheResult;
			}
		}

		return null;
	}

	private seperateFileOrFolderFromPath(filePath: string) {
		const pathSegments = filePath.split(path.sep).filter(part => part);
		// get the parent folder so we can scan and see if the file exists
		const fileName = (pathSegments.pop()|| "");

		return { pathSegments, fileName };
	}
}
