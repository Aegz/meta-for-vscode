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
	const defaultPath = ["User","test-user","Projects","meta-for-vscode","aFolder"];

	beforeEach(() => {
		metaCache = new MetaCache();
	});

	test('Test set with cache miss', () => {
		assert.equal(metaCache.getByPath(path.join(...defaultPath)), null);
	});

	test('Test set with cache hit', () => {
		const insertPath = path.join(...defaultPath);
		const insertValue = "aFolder value";

		metaCache.setPath(insertPath, insertValue);
		const result = metaCache.getByPath(insertPath);
		assert.equal(result && result.value, insertValue);


		metaCache.setPath(insertPath, insertValue);
		const secondResult = metaCache.getByPath(insertPath);
		assert.equal(secondResult && secondResult.value, insertValue);
	});

	test('Test get with cache miss', () => {
		const insertPath = path.join(...defaultPath);

		assert.equal(metaCache.getByPath(insertPath), null);
	});

	test('Test get with cache hit', () => {
		const insertPath = path.join(...defaultPath);
		const insertValue = "aFolder value";

		metaCache.setPath(insertPath, insertValue);
		const parentInsert = metaCache.getByPath(insertPath);
		assert.equal(parentInsert && parentInsert.value, insertValue);

		const secondaryFetchPath = path.join(...defaultPath, "aFolder");
		const childInsert = metaCache.getByPath(secondaryFetchPath);
		assert.equal(childInsert && childInsert.value, null);
	});
});
