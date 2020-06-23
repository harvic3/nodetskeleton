# NodeJs Skeleton with TypeScript (NodeTSkeleton) 💀

A `NodeJs` skeleton to use `TypeScript` with `ExpressJs`, `KoaJs` or any other `web server framework`.

The main philosophy of `NodeTskeleton` is that the `domain` of your solution should be independent of the framework you use, therefore your code should not be adapted to a specific framework, it should work in any framework.

## Using Koa

> Delete `dependencies` and `devDependencies` for `ExpressJs` from `package.json` file.

> Remove the `express` code from the following files:

- On file `src/infraestructure/server/CoreModules.ts` remove express code and remove `//` for lines corresponding to `KoaJs`

- On file `src/infraestructure/config/index.ts` remove express line code and remove `//` for line corresponding to `KoaJs`

- On file `src/infraestructure/server/App.ts` remove express code and remove `//` for lines corresponding to `KoaJs`

- On file `src/controllers/TextFeeling.controller.ts` remove express code and remove `//` for lines corresponding to `KoaJs`

- On file `src/application/result/BaseController.ts` remove express code and remove `//` for lines corresponding to `KoaJs`

And then, continue with the `installation` step described at the end of this manual.

## Using Express Js

Delete `dependencies` and `devDependencies` for `KoaJs` from `package.json` file.

> Delete all commented code (correspondig to `KoaJs`) in the following files:

`server/CoreModules.ts`, `config/index.ts`, `routes/index.ts`, `controllers/TextFeeling.controller.ts`, `application/result/BaseController.ts`

And then, continue with the `installation` step described at the end of this manual.

## Using another web framework

> You must implement the configuration made with `ExpressJs` or `KoaJs` with the framework of your choice and `install` all the `dependencies` and `devDependencies` for your framework.

And then, continue with the next step (`installation`).

## Infrastucture

The infrastructure includes a customizable `HttpClient` with its `response model` in `src/infraestructure/httpClient/TResponse.ts` for error control, and at the application level a class strategy `src/application/result/...` is included as a standardized response model.

## Installation

> First, we must install the dependencies, run: 

```console
npm install
```

> Second, we must update the dependencies, run: 

```console
npm update
```

> Third:

This project is cofigured with `VS Code` so if you use `WindowsNT` go to the next point, otherwise go to the `.vscode` folder and check the `launch.json` file according to your `SO` and in the `tasks.json` file use the lines with `//` for `Bash` and remove the lines corresponding to `cmd` for WindowsNT.

### Observation

Copies of those files `launch.json` and `tasks.json` were attached at the end of this document.

## Run Test

> The tests are only for the domain of the application, not for the configuration of the project, they are two different things. 

> This project includes a domain and its tests which should be used as an example and removed to implement its own business logic.

> The tests use the `Jest` library and can be run in two ways:

```console
npm t
```

or 

```console
npm run test
```

## Application debbuger

> In the side menu of `VS Code` go to the `Execute` ▶ option and then at the top select the `Launch via NPM` option in menu and click on the green Play icon ▶️.

> Remember to put some `stop point` in the code, for example in some method of the `wsController`.

## Build for production

> To get the code you can use in a productive environment run:

```console
npm run build
```

> The result code will be stored in the `dist` directory.

> You can also add your `scripts` in the `package.json` file and use them with your deployment strategies, even with `docker`.

> To be able to `debug`, the system generates `javascript map files` in the `dist` directory, but this is only for testing purposes. When the `build` command runs, everything inside the `dist` directory is removed and only the `necessary code` is generated.

```console
tsc
```
> With the previous command you can also generate the code of the `dist` directory but this command is configured in the `TS config file` to generate the `map files` needed by the application to perform the `debugging` process.

## Setting files (.vscode)

> Files for `.vscode` folder

// launch.json
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch via NPM",
      "program": "${workspaceFolder}/src/index.ts",
      "console": "integratedTerminal",
      "preLaunchTask": "tsc: build-tsconfig",
      "sourceMaps": true,
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

// tasks.json
```json
{
	"version": "2.0.0",
	"tasks": [		
		{
			"type": "typescript",
			"tsconfig": "tsconfig.json",
			"problemMatcher": [
				"$tsc"
			],
			"group": {
				"kind": "build",
				"isDefault": true
			},
			"label": "tsc: build-tsconfig",
			"options": {
				"shell": {
					"executable": "cmd.exe", // For windows
					"args": ["/d", "/c"], // For windows
					// "executable": "bash", // For linux
					// "args": ["-l", "-i"] // For linux
				}
			}
		}
	]
}
```

# TODO

- Tests for example DDD code.
- Dtos mapping library.
- Library to be used to validate the request models.
- DI strategy.


## Warning 
> Use this resource at your own risk.

`You are welcome to contribute to this project, dare to do so.`
`If you are interested you can contact me by this means.`
