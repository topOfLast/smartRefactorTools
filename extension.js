// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const _ = require("lodash");
const vscode = require("vscode");
const { Configuration, OpenAIApi } = require("openai");

let prePrompt = '请将下面的代码转换为使用Vue3和TypeScript的语法:';
let openAiKey = '';
let proxyHost = '127.0.0.1';
let proxyPort = '7890';
let proxyProtocol = 'http';
let configDisposable;

// vscode.window.showInformationMessage('Hello World!');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json

  // load token file
  configDisposable = vscode.workspace.onDidChangeConfiguration(({ affectsConfiguration }) => {
    let hasChange = affectsConfiguration('refactoring-tools');
    if (hasChange) {
      loadConfigAndTokenFile();
    }
  })

  loadConfigAndTokenFile();

  context.subscriptions.push(configDisposable);

  let disposable = vscode.commands.registerTextEditorCommand(
    "extension.RefactoringTools",
    function (textEditor, textEditorEdit) {
      // const config = vscode.workspace.getConfiguration("refactoring-tools");
      // const pxPerRem = config.get("refactoring-tools");
      console.log('------RefactoringTools start------');
      placeholder(
        textEditor,
        textEditorEdit
      );
    }
  );

  // 创建一个 UI 面板，并在其中添加一个按钮
  const panel = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
  panel.text = "$(megaphone) 重构";
  panel.command = "extension.RefactoringTools";
  panel.show();
  // 将命令注册到上下文中
  context.subscriptions.push(disposable);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
  configDisposable.dispose();
}

function getChat(prompt = '') {
  if (!prompt || !openAiKey) {
    return Promise.resolve('');
  }
  const configuration = new Configuration({
    apiKey: openAiKey,
  });
  const openai = new OpenAIApi(configuration);

  // openai.listModels().then(res => {
  //   console.log('models:', res);
  // })
  
  return openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.2,
  }, {
    proxy: {
      host: proxyHost,
      port: proxyPort,
      protocol: proxyProtocol,
    }
  }).then(res => {
    return _.get(res, 'data.choices[0].text', '');
  }).catch(e => {
    const msg = _.get(e, 'message', 'request failed!');
    vscode.window.showErrorMessage(`请求openAi失败: ${msg}`);
  });
}

function placeholder(textEditor) {
  // clones selections
  const selection = textEditor.selection;
  const document = textEditor.document;
  // Check if there is some text selected
  if (selection.length == 0 || selection.isEmpty) {
    return;
  }
  const text = document.getText(selection);
  const fullPrompt = `${prePrompt} ${text}`;
  getChat(fullPrompt).then(msg => {
    if (msg) {
      console.log('replace:', msg);
      // 执行替换操作
      textEditor.edit(editBuilder => {
        editBuilder.replace(selection, msg);
      });
    }
  })
}

function loadConfigAndTokenFile() {
  let config = vscode.workspace.getConfiguration('refactoring-tools');
  if(config.get('pre-prompt')) {
    prePrompt = config.get('pre-prompt') || '请将下面的代码转换为使用Vue3和TypeScript的语法:';
  }
  if(config.get('open-ai-key')) {
    openAiKey = config.get('open-ai-key') || '';
  }
  if(config.get('proxy-port')) {
    proxyPort = config.get('proxy-port') || '';
  }
  if(config.get('proxy-protocol')) {
    proxyProtocol = config.get('proxy-protocol') || '';
  }
  if(config.get('proxy-host')) {
    proxyHost = config.get('proxy-host') || '';
  }
}

exports.deactivate = deactivate;
