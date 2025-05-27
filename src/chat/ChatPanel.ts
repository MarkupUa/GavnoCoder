import * as vscode from "vscode";
import { askOpenAI } from "../services/openaiService";
import { getChatHtml } from "./chatHtml";
import { ChatMessage } from "../types/chat";

export class ChatPanel {
  public static currentPanel: ChatPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private _messages: ChatMessage[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.ViewColumn.Beside;
    if (ChatPanel.currentPanel) {
      ChatPanel.currentPanel._panel.reveal(column);
    } else {
      ChatPanel.currentPanel = new ChatPanel(extensionUri, column);
    }
  }

  private constructor(extensionUri: vscode.Uri, column: vscode.ViewColumn) {
    this._panel = vscode.window.createWebviewPanel(
      "gavnoCoderChat",
      "GavnoCoder Chat",
      column,
      { enableScripts: true, retainContextWhenHidden: true }
    );

    this._panel.webview.html = getChatHtml();

    this._panel.webview.onDidReceiveMessage(async (message) => {
      if (message.command === "send") {
        this._messages.push({ role: "user", content: message.text });
        this._panel.webview.postMessage({
          command: "status",
          text: "GPT думает...",
        });

        try {
          const answer = await askOpenAI([
            { role: "system", content: "Ты ассистент по фронтенду и AI." },
            ...this._messages,
          ]);
          this._messages.push({ role: "assistant", content: answer });
          this._panel.webview.postMessage({ command: "answer", text: answer });
        } catch (err: any) {
          this._panel.webview.postMessage({
            command: "answer",
            text: `Ошибка: ${err.message}`,
          });
        }
      }
    });

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public dispose() {
    ChatPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) x.dispose();
    }
  }
}
