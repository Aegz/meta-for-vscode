import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

export interface DocumentFetchResult {
	status: MetaFetchResult;
	fileName?: string;
	meta?: string;
}

export enum MetaFetchResult {
	MetaNotFound = 0,
	MetaAndMatchFound = 1,
	MetaAndNoMatch = 2
}

/**
 * Handles the panel state etc.
 */
export class FileOrFolderHandler {
	public static tryInterpret (uri: vscode.Uri): DocumentFetchResult {
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
						fileName: fileOrFolderName,
						meta: metaFile
					};
				}

				return {
					status: MetaFetchResult.MetaAndNoMatch
				};
			}
		}

		return {
			status: MetaFetchResult.MetaNotFound
		};
	}
}