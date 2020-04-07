import * as assert from 'assert';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { FileOrFolderHandler } from '../../../handlers/fileOrFolderHandler';

suite('File or Folder Handler', () => {
	vscode.window.showInformationMessage('Start File Or Folder Handler tests');
	
	test('Test file/folder with meta.js', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = FileOrFolderHandler.tryInterpret(generateTestFolderUri("some-file.js"));

		assert.equal(fileResult.success, true);
		assert.equal(fileResult.fileName, "some-file");
		assert.equal(fileResult && fileResult.meta && fileResult.meta.url.length > 0, true);
		
		// Test that a working file with a meta is importable and usable
		const folderResult = FileOrFolderHandler.tryInterpret(generateTestFolderUri("aFolder"));

		assert.equal(folderResult.success, true);
		assert.equal(folderResult.fileName, "aFolder");
		assert.equal(folderResult && folderResult.meta && folderResult.meta.url.length > 0, true);
	});

	test('Test file/folder with meta.js but missing info', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = FileOrFolderHandler.tryInterpret(generateTestFolderUri("some-file-no-meta.js"));

		assert.equal(fileResult.success, false);
		assert.equal(fileResult.fileName, undefined);
		assert.equal(fileResult.meta, undefined);

		// Test that a working file with a meta is importable and usable
		const folderResult = FileOrFolderHandler.tryInterpret(generateTestFolderUri("folderWithNoMeta"));

		assert.equal(folderResult.success, false);
		assert.equal(folderResult.fileName, undefined);
		assert.equal(folderResult.meta, undefined);
	});

	test('Test file without meta.js', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = FileOrFolderHandler.tryInterpret(generateTestFolderUri(path.join("aFolder", "childFile.js")));

		assert.equal(fileResult.success, false);
		assert.equal(fileResult.fileName, undefined);
		assert.equal(fileResult.meta, undefined);

		// Test that a working file with a meta is importable and usable
		const folderResult = FileOrFolderHandler.tryInterpret(generateTestFolderUri(path.join("aFolder", "childFolder")));

		assert.equal(folderResult.success, false);
		assert.equal(folderResult.fileName, undefined);
		assert.equal(folderResult.meta, undefined);
	});
});

function generateTestFolderUri(relativePath: string) {
	return vscode.Uri.file(path.join(__dirname, path.join("test-example", relativePath)));
}