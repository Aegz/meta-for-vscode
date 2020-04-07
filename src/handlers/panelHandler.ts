import * as vscode from 'vscode';
import axios from 'axios';

/**
 * Handles the panel state etc.
 */
export class PanelHandler {
    /**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
    public static currentPanel: PanelHandler | undefined;
    
    public static readonly viewType = 'docPanel';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _uri: string;
    private readonly _fileName: string;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, fileName: string, uri: string) {
        this._panel = panel;
        this._fileName = fileName;
		this._uri = uri;

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
    }

    public static createOrShow(fileName: string, uri: string) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (PanelHandler.currentPanel) {
			// Just reveal and ignore
			if (PanelHandler.currentPanel._uri === uri) {
				PanelHandler.currentPanel._panel.reveal(column);
				return;
			}

			// Dispose if it so it can be rebuilt with the new html
			PanelHandler.currentPanel.dispose();
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			PanelHandler.viewType,
			'Documentation',
			vscode.ViewColumn.Three,
			{
				// Enable javascript in the webview
				enableScripts: true,

			}
		);

		PanelHandler.currentPanel = new PanelHandler(panel, fileName, uri);
	}
    

	public static revive(panel: vscode.WebviewPanel, fileName: string, uri: string) {
		PanelHandler.currentPanel = new PanelHandler(panel, fileName, uri);
    }

	public dispose() {
		PanelHandler.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private async _update() {
		this._panel.title = this._fileName;
		this._panel.webview.html = (await axios.get(this._uri)).data;
		//this._panel.webview.html = this._getHtmlForWebview();
    }
    
    private _getHtmlForWebview() {
		return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Documentation</title>
            </head>
            <body>
                <iframe src="${this._uri}"></iframe>
            </body>
            </html>`;
	}
}


function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
