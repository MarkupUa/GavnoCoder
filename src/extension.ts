import * as vscode from "vscode";
import { askGptCommand } from "./commands/askGpt";
import { openChatCommand } from "./commands/openChat";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("gavno-coder.askGpt", askGptCommand),
    vscode.commands.registerCommand("gavno-coder.openChat", () =>
      openChatCommand(context)
    )
  );

  // Приветственное уведомление
  setTimeout(() => {
    vscode.window
      .showInformationMessage("GavnoCoder готов! Открыть чат?", "Открыть")
      .then((choice) => {
        if (choice === "Открыть") {
          vscode.commands.executeCommand("gavno-coder.openChat");
        }
      });
  }, 2000);
}

export function deactivate() {}
