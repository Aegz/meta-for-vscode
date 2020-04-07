import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

export interface DocumentFetchResult {
	success: boolean;
	fileName?: string;
	meta?: Meta;
}

export interface Meta {
	url: string;
}

/**
 * Handles the panel state etc.
 */
export class FileOrFolderHandler {
	public tryInterpret (uri: vscode.Uri): DocumentFetchResult {
		if (uri && (uri.scheme === "file" || uri.scheme === "folder")) {
			// get the parent folder so we can scan and see if the file exists
			const pathSegments = uri.path.split(path.sep);
			const isDirectory = fs.lstatSync(uri.path).isDirectory();
			const fileOrFolderName = isDirectory ? (pathSegments.pop()|| "") : (pathSegments.pop()|| "").split('.').slice(0, -1).join('.');
			const closestMetaFilePath = [...pathSegments, "meta.js"].join(path.sep);

			// Check if there is a local meta.js file
			if (fileOrFolderName && fs.existsSync(closestMetaFilePath)) {
				const metaData = require(closestMetaFilePath);
				// If theres something valid to use
				// Check that the metadata object actually has what we want
				if (metaData && typeof metaData === 'object' && metaData[fileOrFolderName]) {
					return  {
						success: true,
						fileName: fileOrFolderName,
						meta: metaData[fileOrFolderName]
					};
				}
			}
		}

		return {
			success: false
		};
	}
}