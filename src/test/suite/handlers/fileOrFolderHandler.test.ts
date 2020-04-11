import * as assert from 'assert';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { MetaHandler, MetaFetchResult } from '../../../handlers/metaHandler';

suite('File or Folder Handler', () => {
	vscode.window.showInformationMessage('Start File Or Folder Handler tests');
	
	test('Test file/folder with meta folder', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = MetaHandler.tryInterpret(generateTestFolderUri("some-file.js"));

		assert.equal(fileResult.status, MetaFetchResult.MetaAndMatchFound);
		assert.equal(fileResult.meta && fileResult.meta.name, "some-file.js");
		// assert.equal(fileResult && fileResult.meta && fileResult.meta.url.length > 0, true);
		
		// Test that a working file with a meta is importable and usable
		const folderResult = MetaHandler.tryInterpret(generateTestFolderUri("aFolder"));

		assert.equal(folderResult.status, MetaFetchResult.MetaAndMatchFound);
		assert.equal(folderResult.meta && folderResult.meta.name, "aFolder");
		// assert.equal(folderResult && folderResult.meta && folderResult.meta.url.length > 0, true);
	});

	test('Test file/folder with meta folder but missing info', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = MetaHandler.tryInterpret(generateTestFolderUri("some-file-no-meta.js"));

		assert.equal(fileResult.status, MetaFetchResult.MetaAndNoMatch);
		assert.equal(fileResult.meta && fileResult.meta.name, undefined);
		// assert.equal(fileResult.meta, undefined);

		// Test that a working file with a meta is importable and usable
		const folderResult = MetaHandler.tryInterpret(generateTestFolderUri("folderWithNoMeta"));

		assert.equal(folderResult.status, MetaFetchResult.MetaAndNoMatch);
		assert.equal(folderResult.meta && folderResult.meta.name, undefined);
		// assert.equal(folderResult.meta, undefined);
	});

	test('Test file without meta folder', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = MetaHandler.tryInterpret(generateTestFolderUri(path.join("aFolder", "childFile.js")));

		assert.equal(fileResult.status, MetaFetchResult.MetaNotFound);
		assert.equal(fileResult.meta && fileResult.meta.name, undefined);
		// assert.equal(fileResult.meta, undefined);

		// Test that a working file with a meta is importable and usable
		const folderResult = MetaHandler.tryInterpret(generateTestFolderUri(path.join("aFolder", "childFolder")));

		assert.equal(folderResult.status, MetaFetchResult.MetaNotFound);
		assert.equal(folderResult.meta && folderResult.meta.name, undefined);
		// assert.equal(folderResult.meta, undefined);
	});
});

function generateTestFolderUri(relativePath: string) {
	return vscode.Uri.file(path.join(__dirname.replace(/out/g, 'src'), path.join("test-example", relativePath)));
}