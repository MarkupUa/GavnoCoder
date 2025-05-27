import * as vscode from "vscode";
import { Configuration, OpenAIApi } from "openai";
import * as fs from "fs";
import * as path from "path";

const openai = new OpenAIApi(
  new Configuration({ apiKey: "YOUR_OPENAI_API_KEY" })
);

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.analyzeProject",
    async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("Откройте папку проекта в VS Code.");
        return;
      }

      const projectPath = workspaceFolders[0].uri.fsPath;
      const files = getAllFiles(projectPath).filter(
        (file) => file.endsWith(".js") || file.endsWith(".ts")
      );

      for (const file of files) {
        const code = fs.readFileSync(file, "utf-8");
        const response = await openai.createChatCompletion({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `Предложи улучшения для следующего кода:\n\n${code}`,
            },
          ],
        });

        const newCode = response.data.choices[0].message?.content;
        if (newCode) {
          const document = await vscode.workspace.openTextDocument(file);
          const editor = await vscode.window.showTextDocument(document);
          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(code.length)
          );
          editor.edit((editBuilder) => {
            editBuilder.replace(fullRange, newCode);
          });
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

function getAllFiles(dir: string, files: string[] = []): string[] {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  });
  return files;
}
