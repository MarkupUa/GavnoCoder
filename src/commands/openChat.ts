import * as vscode from "vscode";
import { ChatPanel } from "../chat/ChatPanel";

export function openChatCommand(context: vscode.ExtensionContext) {
  ChatPanel.createOrShow(context.extensionUri);
}
