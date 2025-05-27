export function getChatHtml() {
  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <title>GavnoCoder Chat</title>
      <style>
        body { font-family: sans-serif; margin: 10px; }
        #chat { height: 400px; overflow-y: auto; border: 1px solid #ccc; margin-bottom: 10px; padding: 5px;}
        .user { color: #009; margin-bottom: 2px;}
        .assistant { color: #090; margin-bottom: 6px;}
        .status { color: #999;}
        #input { width: 95%; }
        #send { width: 50px; }
      </style>
    </head>
    <body>
      <div id="chat"></div>
      <input id="input" type="text" placeholder="Ваш вопрос..."/>
      <button id="send">Отпр.</button>
      <div id="status" class="status"></div>
      <script>
        const vscode = acquireVsCodeApi();
        const chat = document.getElementById('chat');
        const status = document.getElementById('status');
        document.getElementById('send').onclick = send;
        document.getElementById('input').onkeydown = (e) => { if (e.key === 'Enter') send(); };

        function addMessage(role, text) {
          const div = document.createElement('div');
          div.className = role;
          div.innerText = (role === "user" ? "Вы: " : "GPT: ") + text;
          chat.appendChild(div);
          chat.scrollTop = chat.scrollHeight;
        }
        function send() {
          const input = document.getElementById('input');
          if (!input.value) return;
          addMessage("user", input.value);
          vscode.postMessage({ command: 'send', text: input.value });
          input.value = '';
        }
        window.addEventListener('message', event => {
          const msg = event.data;
          if (msg.command === 'answer') addMessage("assistant", msg.text);
          if (msg.command === 'status') status.innerText = msg.text;
        });
      </script>
    </body>
    </html>
  `;
}
