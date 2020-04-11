import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import * as fs from 'fs';
import { DocumentMeta } from './metaHandler';

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
    private readonly _meta: DocumentMeta;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, meta: DocumentMeta) {
        this._panel = panel;
		this._meta = meta;

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

    public static createOrShow(meta: DocumentMeta) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

			

		// If we already have a panel, show it.
		if (PanelHandler.currentPanel) {
			// Just reveal and ignore
			if (PanelHandler.currentPanel._meta.documentation === meta.documentation) {
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
			vscode.ViewColumn.Beside,
			{
				// Disable javascript in the webview
				enableScripts: false,
			}
		);

		PanelHandler.currentPanel = new PanelHandler(panel, meta);
	}
    
	public static revive(panel: vscode.WebviewPanel, meta: DocumentMeta) {
		PanelHandler.currentPanel = new PanelHandler(panel, meta);
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
		this._panel.title = this._meta.name;
		this._panel.webview.html = await this._getHtmlForWebview();
    }
    
    private async _getHtmlForWebview() {
		return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Documentation</title>
            </head>
            <body>
                ${ new MarkdownIt().render((await readFile(this._meta.documentation)) as string) }
            </body>
            </html>`;
	}
}

// https://stackoverflow.com/questions/46867517/how-to-read-file-with-async-await-properly
async function readFile(path: string) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, 'utf8', function (err, data) {
			if (err) {
				reject(err);
			}
			
			resolve(data);
		});
	});
}
