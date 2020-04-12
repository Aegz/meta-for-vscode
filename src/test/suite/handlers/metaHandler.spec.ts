import * as assert from 'assert';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { MetaHandler, MetaFetchResult } from '../../../handlers/metaHandler';

suite('File or Folder Handler', () => {
	vscode.window.showInformationMessage('Start File Or Folder Handler tests');
	const metaHandler = new MetaHandler();

	test('Test file/folder with meta folder', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = metaHandler.getMeta(generateTestFolderUri("some-file.js"));

		assert.equal(fileResult.status, MetaFetchResult.MetaAndMatchFound);
		assert.equal(fileResult.meta && fileResult.meta.name, "some-file.js");
		
		// Test that a working file with a meta is importable and usable
		const folderResult = metaHandler.getMeta(generateTestFolderUri("aFolder"));

		assert.equal(folderResult.status, MetaFetchResult.MetaAndMatchFound);
		assert.equal(folderResult.meta && folderResult.meta.name, "aFolder");
	});

	test('Test file/folder with meta folder but missing info', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = metaHandler.getMeta(generateTestFolderUri("some-file-no-meta.js"));

		assert.equal(fileResult.status, MetaFetchResult.MetaAndNoMatch);
		assert.equal(fileResult.meta && fileResult.meta.name, undefined);

		// Test that a working file with a meta is importable and usable
		const folderResult = metaHandler.getMeta(generateTestFolderUri("folderWithNoMeta"));

		assert.equal(folderResult.status, MetaFetchResult.MetaAndNoMatch);
		assert.equal(folderResult.meta && folderResult.meta.name, undefined);
	});

	test('Test file without meta folder', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = metaHandler.getMeta(generateTestFolderUri(path.join("aFolder", "childFile.js")));

		assert.equal(fileResult.status, MetaFetchResult.MetaNotFound);
		assert.equal(fileResult.meta && fileResult.meta.name, undefined);

		// Test that a working file with a meta is importable and usable
		const folderResult = metaHandler.getMeta(generateTestFolderUri(path.join("aFolder", "childFolder")));

		assert.equal(folderResult.status, MetaFetchResult.MetaNotFound);
		assert.equal(folderResult.meta && folderResult.meta.name, undefined);
	});
});

function generateTestFolderUri(relativePath: string) {
	return vscode.Uri.file(path.join(__dirname.replace(/out/g, 'src'), path.join("test-example", relativePath)));
}