import * as vscode from 'vscode';

var panel: vscode.WebviewPanel | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
	// clg
	console.log('hello chatgpt4');
	
	// alert on right bottom to explain this Extension
	let disposable = vscode.commands.registerCommand('chatgpt-extension-pack.helloWorld', () => {
		vscode.window.showInformationMessage('hihi');
	});
	context.subscriptions.push(disposable);

	// view side bar 
	// using web view
	context.subscriptions.push(
        vscode.commands.registerCommand('chatgpt-extension-pack.openWebview', () => {
          // 웹뷰 패널이 이미 열려있다면 그것을 활성화하고, 아니라면 새로운 패널을 생성합니다.
          console.log("hello web view");
          if (panel) {
            panel.reveal(vscode.ViewColumn.One);
          } else {
            panel = vscode.window.createWebviewPanel(
              'chatGpt', // Identifies the type of the webview. Used internally
              'Chat with ChatGPT', // Title of the panel displayed to the user
              vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
              {
                // 웹뷰에 표시될 내용에 대한 설정입니다.
                enableScripts: true, // JavaScript를 활성화합니다.
                retainContextWhenHidden: true, // 웹뷰가 비활성화될 때 상태를 유지합니다.
              }
            );
    
            panel.webview.onDidReceiveMessage(
              message => {
                switch (message.command) {
                  case 'startChat':
                    console.log('Start chat command received from the webview');
                    return;
                }
              },
              undefined,
              context.subscriptions
            );
    
            // 패널이 닫힐 때 panel 객체를 undefined로 설정합니다.
            panel.onDidDispose(() => {
              panel = undefined;
            });
          }
    
          // 웹뷰에 표시할 HTML을 설정합니다.
          panel.webview.html = getWebviewContent();
        })
    );
}


// side bar function
function getWebviewContent() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Chat with ChatGPT</title>
      </head>
      <body>
          <h1>Welcome to ChatGPT</h1>
          <button id="startChat">Start chat</button>
          <script>
            const vscode = acquireVsCodeApi();
            document.getElementById("startChat").addEventListener("click", () => {
              //Use vscode API to send a message to the extension.
              // vscode API is available as a global variable
              vscode.postMessage({ command: "startChat" });
            });
          </script>
      </body>
      </html>`;
  }

// This method is called when your extension is deactivated
export function deactivate() {}
