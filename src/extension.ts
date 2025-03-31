// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ForgeCodeLensProvider } from './forge/forgeCodeLensProvider';
import { ForgeTestUtils } from './forge/forgeTestUtils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-foundry-test" is now active!');

	// 注册CodeLens提供者，用于在Forge测试方法上显示运行和调试按钮
	const codeLensProvider = new ForgeCodeLensProvider();
	
	// 只有当配置启用时才注册CodeLens提供者
	const registerCodeLens = () => {
		const config = vscode.workspace.getConfiguration('foundryTest');
		if (config.get<boolean>('enableCodeLens', true)) {
			return vscode.languages.registerCodeLensProvider(
				{ language: 'solidity', scheme: 'file' },
				codeLensProvider
			);
		}
		return null;
	};
	
	let codeLensProviderDisposable = registerCodeLens();
	if (codeLensProviderDisposable) {
		context.subscriptions.push(codeLensProviderDisposable);
	}
	
	// 监听配置变化，动态启用或禁用CodeLens，以及更新测试参数
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('foundryTest.enableCodeLens')) {
				// 移除旧的注册
				if (codeLensProviderDisposable) {
					codeLensProviderDisposable.dispose();
				}
				// 重新注册
				codeLensProviderDisposable = registerCodeLens();
				if (codeLensProviderDisposable) {
					context.subscriptions.push(codeLensProviderDisposable);
				}
				// 刷新编辑器
				vscode.commands.executeCommand('editor.action.triggerParameterHints');
			}
			
			// 当verbosity级别或额外参数变更时，刷新CodeLens
			if (e.affectsConfiguration('foundryTest.verbosityLevel') || 
			    e.affectsConfiguration('foundryTest.additionalArgs')) {
				vscode.commands.executeCommand('editor.action.triggerParameterHints');
			}
		})
	);

	// 注册运行测试命令
	context.subscriptions.push(
		vscode.commands.registerCommand('vscode-foundry-test.runTest', (testName: string, filePath: string, debug: boolean) => {
			ForgeTestUtils.runForgeTest(testName, filePath, debug);
		})
	);

	// 注册刷新CodeLens命令
	context.subscriptions.push(
		vscode.commands.registerCommand('vscode-foundry-test.refreshCodeLens', () => {
			vscode.commands.executeCommand('editor.action.triggerParameterHints');
		})
	);

	// 保留Hello World命令
	const disposable = vscode.commands.registerCommand('vscode-foundry-test.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Forge Test Extension!');
	});
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
