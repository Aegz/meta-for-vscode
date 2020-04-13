import * as assert from 'assert';
import * as path from 'path';
import { spy } from 'sinon';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { PanelHandler } from '../../../handlers/panelHandler';

suite('Panel Handler', () => {
	vscode.window.showInformationMessage('Start File Or Folder Handler tests');
	//const webviewFunction = spy(vscode.window.createWebviewPanel);

	test('Opens a webview when a valid meta is provided', () => { 
		// const panelHandler = PanelHandler.createOrShow();
	});

	test('Closes a webview if its already open then shows the new one', () => { 
		
	});

	test('Throws an exception when an invalid or null meta is passed in', () => { 
		
	});
});

function generateTestFolderUri(relativePath: string) {
	return vscode.Uri.file(path.join(__dirname.replace(/out/g, 'src'), path.join("test-example", relativePath)));
}