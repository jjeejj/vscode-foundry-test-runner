# Foundry Test Runner VSCode Extension

This VSCode extension provides integration support for the Foundry/Forge testing framework, allowing you to run and debug Solidity test files directly in the VSCode editor.

[中文文档](README.zh-CN.md)

## Features

- Display "run test" and "debug test" buttons next to Forge test methods
- Run individual test methods with one click
- Support for running tests in debug mode
- Automatic detection of Forge test files and test methods

![Feature Demo](images/demo.png)

> Tip: The extension displays run and debug buttons next to test methods in Solidity test files, as shown above.

## Requirements

- VSCode 1.98.0 or higher
- [Foundry](https://book.getfoundry.sh/getting-started/installation) toolchain installed
- Solidity project using Foundry/Forge as the testing framework

## Installation

1. Search for "Foundry Test Runner" in the VSCode extension panel
2. Click install
3. Restart VSCode

## Usage

1. Open a Solidity file containing Forge tests (usually ending with `.t.sol`)
2. You will see "run test" and "debug test" buttons next to each test method
3. Click the corresponding button to run or debug the test

## Configuration

This extension contributes the following settings:

* `foundryTest.verbosityLevel`: Set the verbosity level for forge test command (default: `-vvv`)
* `foundryTest.additionalArgs`: Additional arguments to pass to the forge test command
* `foundryTest.autoCloseTerminal`: Automatically close terminal after test execution (default: `false`)
* `foundryTest.closeTerminalTimeout`: Timeout in milliseconds before closing terminal after test execution (default: `5000`)
* `foundryTest.enableCodeLens`: Enable or disable CodeLens buttons next to test methods (default: enabled)

## Examples

The extension includes an example test file `examples/Counter.t.sol` that you can use to test the extension functionality.

## Contributing

Issues and pull requests are welcome to the GitHub repository.

## License

MIT

## Version History

### 0.0.1

- Initial version
- Support for displaying run and debug buttons next to Forge test methods
- Support for running individual test methods with one click

---

**Enjoy!**