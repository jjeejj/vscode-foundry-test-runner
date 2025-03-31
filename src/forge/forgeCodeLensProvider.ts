import * as vscode from 'vscode';
import { ForgeTestUtils } from './forgeTestUtils';

// 用于缓存测试方法，提高性能
const testMethodsCache = new Map<string, { name: string; line: number }[]>();

/**
 * Forge测试的CodeLens提供者
 * 负责在测试方法上显示运行和调试按钮
 */
export class ForgeCodeLensProvider implements vscode.CodeLensProvider {
    private onDidChangeCodeLensesEmitter = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses = this.onDidChangeCodeLensesEmitter.event;

    constructor() {
        // 监听配置变化，触发CodeLens刷新
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('foundryTest.enableCodeLens')) {
                this.onDidChangeCodeLensesEmitter.fire();
            }
        });

        // 监听文档变化，清除缓存并刷新CodeLens
        vscode.workspace.onDidChangeTextDocument(e => {
            const cacheKey = `${e.document.uri.toString()}-${e.document.version - 1}`;
            if (testMethodsCache.has(cacheKey)) {
                testMethodsCache.delete(cacheKey);
                this.onDidChangeCodeLensesEmitter.fire();
            }
        });
    }

    /**
     * 提供CodeLens
     * @param document 文档对象
     * @param token 取消令牌
     * @returns CodeLens数组的Promise
     */
    public async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[]> {
        // 检查配置是否启用CodeLens
        const config = vscode.workspace.getConfiguration('foundryTest');
        if (!config.get<boolean>('enableCodeLens', true)) {
            return [];
        }

        // 检查是否为Forge测试文件
        if (!ForgeTestUtils.isForgeTestFile(document)) {
            return [];
        }

        const codeLenses: vscode.CodeLens[] = [];
        
        // 使用缓存提高性能
        const cacheKey = `${document.uri.toString()}-${document.version}`;
        let testMethods: { name: string; line: number }[];
        
        if (testMethodsCache.has(cacheKey)) {
            testMethods = testMethodsCache.get(cacheKey)!;
        } else {
            testMethods = ForgeTestUtils.getTestMethods(document);
            testMethodsCache.set(cacheKey, testMethods);
            
            // 限制缓存大小
            if (testMethodsCache.size > 100) {
                const firstKey = testMethodsCache.keys().next().value;
                if (firstKey !== undefined) {
                    testMethodsCache.delete(firstKey);
                }
            }
        }

        for (const method of testMethods) {
            // 获取方法所在行的位置
            const line = document.lineAt(method.line);
            const range = new vscode.Range(
                method.line, line.firstNonWhitespaceCharacterIndex,
                method.line, line.text.length
            );

            // 创建运行测试的CodeLens
            const runCommand = {
                title: 'run test',
                command: 'vscode-foundry-test.runTest',
                arguments: [method.name, document.uri.fsPath, false]
            };
            codeLenses.push(new vscode.CodeLens(range, runCommand));

            // 创建调试测试的CodeLens
            const debugCommand = {
                title: 'debug test',
                command: 'vscode-foundry-test.runTest',
                arguments: [method.name, document.uri.fsPath, true]
            };
            codeLenses.push(new vscode.CodeLens(range, debugCommand));
        }

        return codeLenses;
    }
}