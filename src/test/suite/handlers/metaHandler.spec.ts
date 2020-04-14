import * as assert from 'assert';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { MetaHandler } from '../../../handlers/metaHandler';
import { beforeEach } from 'mocha';

suite('Meta Handler', () => {
	vscode.window.showInformationMessage('Start File Or Folder Handler tests');
	let metaHandler: MetaHandler;

	beforeEach(() => {
		metaHandler = new MetaHandler();
	});

	// Local Meta with match
	test('File with local meta folder and match', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = metaHandler.getMeta(generateTestFolderUri("local-meta", "some-file.js"));
		assert.equal(fileResult.success, true);
		assert.equal(fileResult.meta && fileResult.meta.name, "some-file.js");
	});

	test('Folder with local meta folder and match', () => {
		// Test that a working file with a meta is importable and usable
		const folderResult = metaHandler.getMeta(generateTestFolderUri("local-meta", "aFolder"));
		assert.equal(folderResult.success, true);
		assert.equal(folderResult.meta && folderResult.meta.name, "aFolder");
	});

	// Local Meta but no match
	test('File with local meta folder but no match or config', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = metaHandler.getMeta(generateTestFolderUri("local-meta", "some-file-no-meta.js"));
		assert.equal(fileResult.success, false);

		// Test that a working file with a meta is importable and usable
		const fileInFolderResult = metaHandler.getMeta(generateTestFolderUri("local-meta", "aFolder", "some-file.js"));
		assert.equal(fileInFolderResult.success, false);
	});

	test('Folder with local meta folder but no match or config', () => {
		// Test that a working file with a meta is importable and usable
		const folderResult = metaHandler.getMeta(generateTestFolderUri("local-meta", "folderWithNoMeta"));
		assert.equal(folderResult.success, false);

		// Test that a working file with a meta is importable and usable
		const folderInFolderResult = metaHandler.getMeta(generateTestFolderUri("local-meta", "aFolder", "aFolder"));
		assert.equal(folderInFolderResult.success, false);
	});

	// No local meta, using glob in config
	test('File without local meta folder but config file in parent folder using glob', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = metaHandler.getMeta(generateTestFolderUri("config", "aFolder", "childFile.js"));
		assert.equal(fileResult.success, true);

		const alternateFileResult = metaHandler.getMeta(generateTestFolderUri("config", "folderWithNoMeta", "childFile.js"));
		assert.equal(alternateFileResult.success, true);
	});

	test('Folder without local meta folder but config file in parent folder using glob', () => {
		// Test that a working file with a meta is importable and usable
		const folderResult = metaHandler.getMeta(generateTestFolderUri("config", "aFolder", "childFolder"));
		assert.equal(folderResult.success, true);
	});

	// No local meta, using glob in config
	test('File with local meta folder but no match and config file in parent folder using glob', () => {
		// Test that a working file with a meta is importable and usable
		const fileResult = metaHandler.getMeta(generateTestFolderUri("config-and-meta", "some-file.js"));
		assert.equal(fileResult.success, true);
		assert.equal(fileResult.meta?.documentation, generateTestFolderUri("config-and-meta",".meta", "some-file.js.md").path);

		const alternateFileResult = metaHandler.getMeta(generateTestFolderUri("config-and-meta", "aFolder", "some-file.js"));
		assert.equal(alternateFileResult.success, true);
		assert.equal(alternateFileResult.meta?.documentation, generateTestFolderUri("config-and-meta",".meta", "some-file-default.js.md").path);
	});

	test('Folder with local meta folder but no match and config file in parent folder using glob', () => {
		// Test that a working file with a meta is importable and usable
		const folderResult = metaHandler.getMeta(generateTestFolderUri("config-and-meta", "aFolder", "aFolder"));
		assert.equal(folderResult.success, true);
	});
});

function generateTestFolderUri(...relativePath: string[]) {
	const finalPath = path.join(__dirname.replace(/(test|suite|handlers)/g, '').replace(/out/g, 'examples'), path.join(...relativePath));
	return vscode.Uri.file(finalPath);
}