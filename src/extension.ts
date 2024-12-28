// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export class YAMLFoldingRangeProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FoldingRange[]> {
        const foldingRanges: vscode.FoldingRange[] = [];
        const lines = document.getText().split('\n');

        let sectionStart = -1;
        let sectionName = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.startsWith('#Section:')) {
                if (sectionStart !== -1) {
                    foldingRanges.push(new vscode.FoldingRange(sectionStart, i - 1));
                }
                sectionStart = i;
                sectionName = line.substring(9).trim();
            }
        }

        if (sectionStart !== -1) {
            foldingRanges.push(new vscode.FoldingRange(sectionStart, lines.length - 1));
        }

        return foldingRanges;
    }
}

export class YAMLSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        const symbols: vscode.DocumentSymbol[] = [];
        const lines = document.getText().split('\n');

        let sectionStart = -1;
        let sectionName = '';

        let objRegex = /^(\w+):/;

        var objLines: {index: number, name: string}[] = [];

        const addSection = (rangeEnd: number) => {
            var section = new vscode.DocumentSymbol(sectionName, '', vscode.SymbolKind.Namespace, new vscode.Range(sectionStart, 0, rangeEnd - 1, 0), new vscode.Range(sectionStart, 0, rangeEnd - 1, 0));
            symbols.push(section);

            for (let objLine of objLines) {
                section.children.push(new vscode.DocumentSymbol(objLine.name, '', vscode.SymbolKind.Method, new vscode.Range(objLine.index, 0, objLine.index, 0), new vscode.Range(objLine.index, 0, objLine.index, 0)));
            }
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.startsWith('#Section:')) {
                if (sectionStart !== -1) {
                    addSection(i);
                }
                sectionStart = i;
                sectionName = line.substring(9).trim();
            }
            else {
                let matches = objRegex.exec(line);
                if (matches) {
                    objLines.push({index: i, name: matches[1]});
                }
            }
        }

        if (sectionStart !== -1) {
            addSection(lines.length);
        }

        return symbols;
    }
}

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    vscode.languages.registerFoldingRangeProvider({ language: 'yaml' }, new YAMLFoldingRangeProvider())
    vscode.languages.registerDocumentSymbolProvider({ language: 'yaml' }, new YAMLSymbolProvider())
}

// This method is called when your extension is deactivated
export function deactivate() {}
