import * as vscode from "vscode";
import OpenAI from "openai";

// Для безопасности лучше держать ключ в env (или спросить у пользователя)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "gavno-coder.askGpt",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage(
          "Открой файл и выдели код или текст для отправки в GPT"
        );
        return;
      }

      const selection = editor.selection;
      const text =
        editor.document.getText(selection) || editor.document.getText();

      if (!text) {
        vscode.window.showInformationMessage(
          "Выдели код или текст для отправки в GPT"
        );
        return;
      }

      // Запрос к OpenAI
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "GPT думает...",
          cancellable: false,
        },
        async () => {
          try {
            const completion = await openai.chat.completions.create({
              model: "gpt-4o", // Можно заменить на gpt-4 или gpt-3.5-turbo
              messages: [
                {
                  role: "system",
                  content:
                    "Ты ассистент по фронтенду и AI. Пиши чисто, по стандарту, давай краткие пояснения, если требуется.",
                },
                { role: "user", content: text },
              ],
              max_tokens: 1024,
              temperature: 0.2,
            });

            const response =
              completion.choices[0]?.message?.content || "Нет ответа от GPT";

            // Показываем результат в отдельном окне
            const doc = await vscode.workspace.openTextDocument({
              content: response,
              language: editor.document.languageId,
            });
            vscode.window.showTextDocument(doc, { preview: false });
          } catch (err: any) {
            vscode.window.showErrorMessage(
              `Ошибка OpenAI: ${err.message || err}`
            );
          }
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
