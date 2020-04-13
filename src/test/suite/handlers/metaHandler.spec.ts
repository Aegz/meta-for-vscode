import * as assert from 'assert';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { MetaHandler } from '../../../handlers/metaHandler';

suite('Meta Handler', () => {
	vscode.window.showInformationMessage('Start File Or Folder Handler tests');
	const metaHandler = new MetaHandler();

	// Local Meta with match
	test('File with local meta folder and match', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = metaHandler.getMeta(generateTestFolderUri("some-file.js"));
		assert.equal(fileResult.success, true);
		assert.equal(fileResult.meta && fileResult.meta.name, "some-file.js");
	});

	test('Folder with local meta folder and match', () => {
		// Test that a working file with a meta is importable and usable
		const folderResult = metaHandler.getMeta(generateTestFolderUri("aFolder"));
		assert.equal(folderResult.success, true);
		assert.equal(folderResult.meta && folderResult.meta.name, "aFolder");
	});

	// Local Meta but no match
	test('File with local meta folder but no match or config', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = metaHandler.getMeta(generateTestFolderUri("some-file-no-meta.js"));
		assert.equal(fileResult.success, false);
	});

	test('Folder with local meta folder but no match or config', () => {
		// Test that a working file with a meta is importable and usable
		const folderResult = metaHandler.getMeta(generateTestFolderUri("folderWithNoMeta"));
		assert.equal(folderResult.success, false);
	});

	// No local meta, using glob in config
	test('File without local meta folder but config file in parent folder using glob', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = metaHandler.getMeta(generateTestFolderUri(path.join("aFolder", "childFile.js")));
		assert.equal(fileResult.success, true);

		const alternateFileResult = metaHandler.getMeta(generateTestFolderUri(path.join("folderWithNoMeta", "childFile.js")));
		assert.equal(alternateFileResult.success, true);
	});

	test('Folder without local meta folder but config file in parent folder using glob', () => {
		// Test that a working file with a meta is importable and usable
		const folderResult = metaHandler.getMeta(generateTestFolderUri(path.join("aFolder", "childFolder")));
		assert.equal(folderResult.success, true);
	});

	// No local meta, using glob in config
	test('File with local meta folder but no match and config file in parent folder using glob', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = metaHandler.getMeta(generateTestFolderUri(path.join("aFolder", "childFile.js")));
		assert.equal(fileResult.success, true);

		const alternateFileResult = metaHandler.getMeta(generateTestFolderUri(path.join("folderWithNoMeta", "childFile.js")));
		assert.equal(alternateFileResult.success, true);
	});

	test('Folder with local meta folder but no match and config file in parent folder using glob', () => {
		// Test that a working file with a meta is importable and usable
		const folderResult = metaHandler.getMeta(generateTestFolderUri(path.join("aFolder", "childFolder")));
		assert.equal(folderResult.success, true);
	});
});

function generateTestFolderUri(relativePath: string) {
	return vscode.Uri.file(path.join(__dirname.replace(/out/g, 'src'), path.join("test-example", relativePath)));
}