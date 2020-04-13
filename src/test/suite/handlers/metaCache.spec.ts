import * as assert from 'assert';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { MetaCache } from '../../../handlers/meta/metaCache';
import { beforeEach } from 'mocha';

suite('Meta Cache', () => {
	vscode.window.showInformationMessage('Start Cache tests');
	let metaCache: MetaCache;

	beforeEach(() => {
		metaCache = new MetaCache();
	});

	test('Test set with cache miss', () => {
		const insertPath = "/User/test-user/Projects/meta-for-vscode/aFolder";
		const insertValue = "aFolder value";

		metaCache.setPath(insertPath, insertValue);

		assert.equal(metaCache.getByPath(insertPath), insertValue);
	});

	test('Test set with cache hit', () => {
		const insertPath = "/User/test-user/Projects/meta-for-vscode/aFolder";
		const insertValue = "aFolder value";

		metaCache.setPath(insertPath, insertValue);

		assert.equal(metaCache.getByPath(insertPath), insertValue);
	});

	test('Test get with cache miss', () => {
		const insertPath = "/User/test-user/Projects/meta-for-vscode/aFolder";

		assert.equal(metaCache.getByPath(insertPath), null);
	});
});
