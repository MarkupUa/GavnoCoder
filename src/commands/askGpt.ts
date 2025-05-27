import * as vscode from "vscode";
import { askOpenAI } from "../services/openaiService";

export async function askGptCommand() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage(
      "Открой файл и выдели код или текст для отправки в GPT"
    );
    return;
  }
  const selection = editor.selection;
  const text = editor.document.getText(selection) || editor.document.getText();

  if (!text) {
    vscode.window.showInformationMessage(
      "Выдели код или текст для отправки в GPT"
    );
    return;
  }

  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "GPT думает...",
      cancellable: false,
    },
    async () => {
      try {
        const response = await askOpenAI([{ role: "user", content: text }]);
        const doc = await vscode.workspace.openTextDocument({
          content: response,
          language: editor.document.languageId,
        });
        vscode.window.showTextDocument(doc, { preview: false });
      } catch (err: any) {
        vscode.window.showErrorMessage(`Ошибка OpenAI: ${err.message || err}`);
      }
    }
  );
}
