// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const disposable = vscode.commands.registerCommand('ao3dw.parseDreamwidth', function () {

    try {
      runReplacements();
      vscode.window.showInformationMessage('Header template generation completed!');
    } catch (error) {
      vscode.window.showErrorMessage(`Something went wrong while parsing the data. ${error}`);      
    }		
	});

	context.subscriptions.push(disposable);
}

// @ts-ignore
function runReplacements() {

  const document = vscode.window.activeTextEditor?.document;
  const start = document?.lineAt(0);
  const end = document?.lineAt(document.lineCount - 1);
  // @ts-ignore
  const range = new vscode.Range(start.range.start, end.range.end);
  const text = document?.getText();

  const meta = createHeaderTemplate(text);

  vscode.window.activeTextEditor?.edit((editBuilder) => {
    editBuilder.replace(
    range,
    `<blockquote>\n<p>
    <strong>TITLE:</strong> ${meta.title} <br>
    <strong>FANDOM & PAIRING:</strong> ${meta.fandom}, ${meta.pairing} <br>
    <strong>RATING:</strong> ${meta.rating} <br>
    <strong>WORD COUNT:</strong> ${meta.words} <br>
    <strong>TAGS:</strong>  <br>
    <strong>AO3 MIRROR:</strong> <a href="https://archiveofourown.org/works/${meta.url}">go to ao3</a>. <br>
    <strong>NOTES:</strong>
    </p>\n</blockquote>\n\n\n<p>&nbsp;</p><hr><p>&nbsp;</p>\n\n<cut text="">\n\n\n</cut>
    `)
  });

}

// @ts-ignore
function createHeaderTemplate(text) {

  // Extract the fragments of template variables from the work.
  const title = text.match(/<title>(?<name>[\s\S]+?)(?:[\s]-)/);
  const fandom = text.match(/Fandom\:[\s\S]*?\"\>(?<fandom>[\s\S]+?)<\/a>/);
  const pairing = text.match(/Relationship\:[\s\S]*?\"\>(?<pairing>[\s\S]+?)<\/a>/);
  const rating = text.match(/Rating\:[\s\S]*?\"\>(?<rating>[\s\S]+?)<\/a>/);
  const words = text.match(/Words\: (?<words>[\d\D]+?$)/m);
  const link = text.match(/\/works\/(?<url>[\d\D]+?)"/m);

  return {
    title: title?.groups?.name.toLowerCase(),
    fandom: fandom?.groups?.fandom.toLowerCase(),
    pairing: pairing?.groups?.pairing.toLowerCase(),
    rating: rating?.groups?.rating.toLowerCase(),
    words: words?.groups?.words,
    url: link?.groups?.url
  }
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
