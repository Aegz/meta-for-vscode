// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { DocumentationPanel } from './documentationPanel';
import { FileOrFolderHandler, DocumentFetchResult } from './fileOrFolderHandler';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "meta-for-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let viewDocsCommand = vscode.commands.registerCommand('meta-for-vscode.viewDocumentation', (fileOrFolder) => {
		try {
			// What we want to do is make sure the given object is a File/Folder style object provided by VSCode
			const returnVal = FileOrFolderHandler.tryInterpret(fileOrFolder);

			if (returnVal.success && returnVal.meta) {
				if (!returnVal.meta.url) {
					vscode.window.showWarningMessage('meta file doesn\'t contain a valid url');
					return;
				}

				DocumentationPanel.createOrShow(fileOrFolder, returnVal.meta.url);

				// Display a message box to the user
				vscode.window.showInformationMessage(`Successfully opened documentation for ${returnVal.fileName}`);
			} else {
				vscode.window.showWarningMessage('Couldn\'t find a local meta.js file');
			}
		} catch (e) {
			vscode.window.showErrorMessage('Error', e);
		}
	});

	context.subscriptions.push(viewDocsCommand);

	// We need to register this or we can't use the webview
	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(DocumentationPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				const returnVal = FileOrFolderHandler.tryInterpret(vscode.Uri.file(context.extensionPath));

				if (returnVal.success && returnVal.meta) {
					if (!returnVal.meta.url) {
						vscode.window.showWarningMessage('meta file doesn\'t contain a valid url');
						return;
					}

					DocumentationPanel.revive(webviewPanel, returnVal.fileName || "Not provided", returnVal.meta.url);
				} 
			}
		});
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}