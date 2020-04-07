import * as path from 'path';
import * as vscode from 'vscode';

export interface DocumentFetchResult {
	success: boolean;
	meta: Meta;
}

export interface Meta {
	url: string;
}

/**
 * Handles the panel state etc.
 */
export class FileOrFolderHandler {
	public tryInterpret (fileOrFolder:any): DocumentFetchResult {
		if (fileOrFolder) {

		}

		return {
			success: true,
			meta: {
				url: "http://bing.com"
			}
		};
	}
}