import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * 用于检测和处理Forge测试的工具类
 */
export class ForgeTestUtils {
    /**
     * 检查文件是否为Forge测试文件
     * @param document 文档对象
     * @returns 是否为Forge测试文件
     */
    public static isForgeTestFile(document: vscode.TextDocument): boolean {
        // 检查文件扩展名是否为.sol
        if (path.extname(document.fileName) !== '.sol') {
            return false;
        }

        // 检查文件名是否以.t.sol结尾（Forge测试文件的常见命名方式）
        if (document.fileName.endsWith('.t.sol')) {
            return true;
        }

        // 检查文件内容是否包含Forge测试相关的关键字
        const text = document.getText();
        return (
            text.includes('import "forge-std/Test.sol"') ||
            text.includes('import {Test') ||
            text.includes('import "ds-test/test.sol"') ||
            (text.includes('contract') && text.includes('function test')) ||
            text.includes('is Test') ||
            text.includes('is DSTest')
        );
    }

    /**
     * 获取文件中的测试方法
     * @param document 文档对象
     * @returns 测试方法列表，包含方法名和行号
     */
    public static getTestMethods(document: vscode.TextDocument): { name: string; line: number }[] {
        const text = document.getText();
        const lines = text.split('\n');
        const testMethods: { name: string; line: number }[] = [];

        // 正则表达式匹配测试方法
        // 匹配以function test开头的方法声明，包括test_、testFuzz_、testFail_等变体
        // 确保能匹配test_Increment和testFuzz_SetNumber等格式
        const testMethodRegex = /^\s*function\s+(test[A-Za-z0-9_]*)\s*\(/;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const match = line.match(testMethodRegex);
            if (match) {
                testMethods.push({
                    name: match[1],
                    line: i
                });
            }
        }

        return testMethods;
    }

    /**
     * 执行Forge测试命令
     * @param testName 测试方法名
     * @param filePath 文件路径
     * @param debug 是否为调试模式
     * @returns 执行结果的Promise
     */
    public static async runForgeTest(testName: string, filePath: string, debug: boolean = false): Promise<void> {
        try {
            // 检查forge命令是否可用
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: 'Checking Forge environment...',
                    cancellable: false
                },
                async () => {
                    // 这里可以添加检查forge命令是否存在的逻辑
                    // 暂时省略，假设forge已正确安装
                }
            );

            // 获取工作区根目录
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('Unable to determine workspace root directory');
                return;
            }

            // 从配置中获取verbosity级别和额外参数
            const config = vscode.workspace.getConfiguration('foundryTest');
            const verbosityLevel = config.get<string>('verbosityLevel', '-vv');
            const additionalArgs = config.get<string>('additionalArgs', '');
            
            // 构建命令
            const command = 'forge test';
            let args = debug 
                ? ['--debug', '--match-path', filePath, '--match-test', testName, verbosityLevel] 
                : ['--match-path', filePath, '--match-test', testName, verbosityLevel];
                
            // 添加额外参数（如果有）
            if (additionalArgs && additionalArgs.trim() !== '') {
                const extraArgs = additionalArgs.trim().split(/\s+/);
                args = args.concat(extraArgs);
            }

            // 显示状态通知
            vscode.window.showInformationMessage(`${debug ? 'Debugging' : 'Running'} test: ${testName}`);

            // 创建终端并执行命令
            const terminal = vscode.window.createTerminal('Forge Test');
            
            // 不添加自动退出逻辑，让终端保持打开状态以显示测试结果
            
            // 使用更可靠的方法执行命令
            // 首先切换到工作目录
            terminal.sendText(`cd "${workspaceFolder.uri.fsPath}"`); 
            
            // 然后执行测试命令
            if (process.platform === 'win32') {
                // Windows系统
                terminal.sendText(`${command} ${args.join(' ')}`);
            } else {
                // macOS/Linux系统
                terminal.sendText(`${command} ${args.join(' ')}`);
            }
            terminal.show();
            
            // 不自动关闭终端，让用户可以查看测试结果并手动关闭
        } catch (error) {
            vscode.window.showErrorMessage(`Test execution failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}