# Foundry Test Runner VSCode Extension

这个VSCode扩展为Foundry/Forge测试框架提供了集成支持，允许你直接在VSCode编辑器中运行和调试Solidity测试文件。

[English Documentation](README.md)

## 功能

- 在Forge测试方法旁边显示 "run test" 和 "debug test" 按钮
- 一键运行单个测试方法
- 支持调试模式运行测试
- 自动检测Forge测试文件和测试方法

![功能演示](images/demo.png)

> 提示：插件会在Solidity测试文件中的测试方法旁显示运行和调试按钮，如上图所示。

## 要求

- VSCode 1.98.0 或更高版本
- 已安装 [Foundry](https://book.getfoundry.sh/getting-started/installation) 工具链
- Solidity 项目使用 Foundry/Forge 作为测试框架

## 安装

1. 从 [VSCode 插件市场](https://marketplace.visualstudio.com/items?itemName=jjeejj.foundry-solidity-test-runner) 安装
2. 或在 VSCode 扩展面板中搜索 "Foundry Test Runner"
3. 点击安装
4. 重启 VSCode

## 使用方法

1. 打开一个包含 Forge 测试的 Solidity 文件（通常以 `.t.sol` 结尾）
2. 你将在每个测试方法旁边看到 "run test" 和 "debug test" 按钮
3. 点击相应按钮运行或调试测试

## 配置

此扩展提供以下设置：

- `foundryTest.verbosityLevel`：设置forge test命令的详细程度级别（默认：`-vv`）
- `foundryTest.additionalArgs`：传递给forge test命令的额外参数
- `foundryTest.enableCodeLens`: 启用或禁用测试方法旁的 CodeLens 按钮（默认：启用）

## 示例

插件包含一个示例测试文件 `examples/Counter.t.sol`，你可以用它来测试插件功能。

## 贡献

欢迎提交问题和拉取请求到 GitHub 仓库。

## 许可证

MIT

## 版本历史

### 0.0.1

- 初始版本
- 支持在Forge测试方法旁显示运行和调试按钮
- 支持一键运行单个测试方法

---

**享受使用!**
