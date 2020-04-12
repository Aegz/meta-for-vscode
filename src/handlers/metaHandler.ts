import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
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

	public getMeta(uri: vscode.Uri): DocumentFetchResult {
		if (uri && (uri.scheme === "file" || uri.scheme === "folder")) {

			let cacheResult;

			// Check if our cache has the location of a valid meta file
			if (cacheResult = this._metaCache.getByPath(uri.path)) {
				// Check that the cache hit is still valid (i.e: the file exists)
				if (fs.existsSync(cacheResult)) {
					return {
						status: MetaFetchResult.MetaAndMatchFound,
						meta: {
							name: "CACHE HIT",
							documentation: cacheResult
						}
					};
				}
			}

			// get the parent folder so we can scan and see if the file exists
			const pathSegments = uri.path.split(path.sep);
			const fileOrFolderName = (pathSegments.pop()|| "");
			const immediateMetaFolder = [...pathSegments, ".meta"].join(path.sep);

			// Check if the local meda folder exists AND that the folder contains the appropriate md file inside of it
			if (fileOrFolderName && fs.existsSync(immediateMetaFolder)) {
				const metaFile = [immediateMetaFolder, `${fileOrFolderName}.md`].join(path.sep);

				if (fs.existsSync(metaFile)) {
					this._metaCache.setPath(uri.path, metaFile);
					// Return a vscode.Uri.File?
					return {
						status: MetaFetchResult.MetaAndMatchFound,
						meta: {
							name: fileOrFolderName,
							documentation: metaFile
						}
					};
				}

				return {
					status: MetaFetchResult.MetaAndNoMatch
				};
			}

			// Else we can try and find a higher level result
		}

		return {
			status: MetaFetchResult.MetaNotFound
		};
	}

	public static tryInterpret(uri: vscode.Uri): DocumentFetchResult {
		if (uri && (uri.scheme === "file" || uri.scheme === "folder")) {
			// get the parent folder so we can scan and see if the file exists
			const pathSegments = uri.path.split(path.sep);
			const fileOrFolderName = (pathSegments.pop()|| "");
			const immediateMetaFolder = [...pathSegments, ".meta"].join(path.sep);

			// Check if the local meda folder exists AND that the folder contains the appropriate md file inside of it
			if (fileOrFolderName && fs.existsSync(immediateMetaFolder)) {
				const metaFile = [immediateMetaFolder, `${fileOrFolderName}.md`].join(path.sep);

				if (fs.existsSync(metaFile)) {
					// Return a vscode.Uri.File?
					return {
						status: MetaFetchResult.MetaAndMatchFound,
						meta: {
							name: fileOrFolderName,
							documentation: metaFile
						}
					};
				}

				return {
					status: MetaFetchResult.MetaAndNoMatch
				};
			}

			// Else we can try and find a higher level result
		}

		return {
			status: MetaFetchResult.MetaNotFound
		};
	}
}