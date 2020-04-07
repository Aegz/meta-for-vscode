// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { DocumentationPanel } from './documentationPanel';
import { FileOrFolderHandler } from './fileOrFolderHandler';

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
		// Safety check
		if (fileOrFolder) {
			try {
				// What we want to do is make sure the given object is a File/Folder style object provided by VSCode
				const returnVal = (new FileOrFolderHandler()).tryInterpret(fileOrFolder);

				if (returnVal.success && returnVal.meta) {
					DocumentationPanel.createOrShow(returnVal.meta.url ? returnVal.meta.url : "www.google.com");

					// Display a message box to the user
					vscode.window.showInformationMessage(`Successfully opened documentation for ${fileOrFolder}`);
				} else {
					vscode.window.showWarningMessage('Couldn\'t find a local meta.js file');
				}
			} catch (e) {
				vscode.window.showErrorMessage('Error', e);
			}
		}

	});

	context.subscriptions.push(viewDocsCommand);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(DocumentationPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				DocumentationPanel.revive(webviewPanel, context.extensionPath);
			}
		});
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
