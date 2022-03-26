<h1 align="center">
<img src="https://imagedelivery.net/Dr98IMl5gQ9tPkFM5JRcng/7edcb842-a84d-4581-f046-067d7d21ef00/HD" width="94"/><br/>
Launchpad.js
</h1>

**Launchpad.js** is a TypeScript proxy module designed for everyone who needs to manage the session (local/remote) easily and comfortably.

* [**Installation**](#installation)
* [**Usage**](#usage)
* [**Configuration**](#configuration)
* [**Development**](#development)
    * [**Code Format**](#code-format-must-read)
    * [**Build**](#build)
    * [**Publish**](#publish)

## Installation

You can install it by using the following command:

```bash
npm install @taci-tech/launchpad-js
```

## Usage

The package is still in development. Check back later.

## Configuration

### React.js configuration

Use `LaunchpadProvider` to wrap your application in order to override the configuration.

After doing that, just pass the configuration object to the provider by using `config` prop and you are all set.

## Development

### Code Format (MUST READ)

- We use Eslint to enforce the code style.

- Indentation over all TypeScript project files (`*.ts`) is 4 spaces (4 spaces per tab). So please properly set your IDE to use 4 spaces (you can specify the indentation for a workspace or a project) before starting the coding.

### Build

First, make sure that all dependencies are installed locally by using `npm install` command.

Then, you can build the project by using `npm run build` command. Generated files will be placed in the `lib` directory, which should be ignored by the version control.

### Test

You can run `npm run test` to run all tests. You can also run `npm run test:unit` to run unit tests. To add a test, you need to add a test file (`test.ts`) to the project test directory (`./src/__tests__/`).

### Publish

Before building, you need to make sure you have the access to this repository as mentioned in the [Installation](#installation).

```bash
npm publish
```

When publishing the project, the system only uploads the files in the `lib` directory.
