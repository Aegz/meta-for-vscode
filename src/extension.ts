// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PanelHandler } from './handlers/panelHandler';
import { MetaHandler, MetaFetchResult } from './handlers/metaHandler';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "meta-for-vscode" is now active!');
	
	// Initialise once on activation and use as a cache
	const metaHandler = new MetaHandler();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let viewDocsCommand = vscode.commands.registerCommand('meta-for-vscode.viewDocumentation', (fileOrFolder) => {
		try {
			// What we want to do is make sure the given object is a File/Folder style object provided by VSCode
			const result = metaHandler.getMeta(fileOrFolder);

			if (result.status === MetaFetchResult.MetaAndMatchFound && result.meta) {
				PanelHandler.createOrShow(result.meta);
				
				// Display a message box to the user
				vscode.window.setStatusBarMessage(`Successfully opened documentation for ${result.meta.name}`);
			} 
			else if (result.status === MetaFetchResult.MetaAndNoMatch) {
				vscode.window.showWarningMessage('The .meta folder didn\'t have a match for the requested document');
			}
			else {
				vscode.window.showWarningMessage('Couldn\'t find a local .meta folder');
			}
		} catch (e) {
			vscode.window.showErrorMessage('Fatal error while trying to read .meta folder', e);
		}
	});

	context.subscriptions.push(viewDocsCommand);

	// We need to register this or we can't use the webview
	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(PanelHandler.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				const result = MetaHandler.tryInterpret(vscode.Uri.file(context.extensionPath));

				if (result.status === MetaFetchResult.MetaAndMatchFound) {
					if (!result.meta) {
						vscode.window.showWarningMessage('meta file doesn\'t contain a valid url');
					} else {
						PanelHandler.revive(webviewPanel, result.meta);
						return;
					}
				} 
				
				webviewPanel.dispose();
			}
		});
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}