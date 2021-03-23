# NodeTSkeleton <img height="50" src="https://i.ibb.co/BZkYR9H/esqueletots.png" alt="esqueletots" border="0">

## Introduction🤖

`NodeTskeleton` is a `Clean Architecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

The main philosophy of `NodeTskeleton` is that your solution (`domain` and `application`, `“business logic”`) should be independent of the framework you use, therefore your code should NOT BE COUPLED to a specific framework or library, it should work in any framework.

The design of `NodeTskeleton` is based in `Clean Architecture`, an architecture that allows you to decouple the dependencies of your solution, even without the need to think about the type of `database`, `providers`or `services`, the `framework`, `libraries` or any other dependencies.

`NodeTskeleton` has the minimum `tools` necessary for you to develop the `business logic` of your application, you can even decide not to use its included tools (you can remove them), and use the libraries or packages of your choice.

## Table of contents

  1. [Philosophy 🧘🏽](#philosophy)
  1. [Included tools 🧰](#included-tools)
		1. [Errors](#errors)
		1. [Locals](#locals)
		1. [Mapper](#mapper)
		1. [UseCase](#usecase)
		1. [Validator](#validator)
  1. [Dependency injection strategy 📦](#dependency-injection-strategy)
  1. [Using NodeTskeleton 👾](#using-nodetskeleton)
		1. [Using with KoaJs 🦋](#using-with-koajs)
		1. [Using with ExpressJs 🐛](#using-with-expressjs)
		1. [Using with another web server framework 👽](#using-with-another-web-server-framework)
  1. [Infrastructure 🏗️](#infrastructure)
  1. [Installation 🔥](#installation)
  1. [Run Test 🧪](#run-test)
  1. [Application debugger 🔬](#application-debugger)
  1. [Build for production ⚙️](#Build-for-production)
  1. [Test your Clean Architecture 🥁](#test-your-clean-architecture)
  1. [Coupling 🧲](#coupling)
  1. [Conclusions (Personal) 💩](#conclusions)
  1. [Code of Conduct 👌](#code-of-conduct)
  1. [Warning 💀](#warning)

## Philosophy

Applications are generally developed to be used by people, so people should be the focus of them.

For this reason `user stories` are written, stories that give us information about the type of user, procedures that the user performs in a part of the application `(module)`, important information that serves to `structure the solution` of our application, and in practice, how is this?

The user stories must be in the `src/application` path of our solution, there we create a directory that we will call `modules` and inside this, we create a directory for the task role, for example (customer, operator, seller, admin, ...) and inside the role we create a directory of the corresponding use case module, for example (product, order, account, sales, ...), and in practice that looks more or less like this: 

<div style="text-align:center"> <img src="https://i.ibb.co/t2mHGmC/Node-Tskeleton.png" alt="Node-Tskeleton" border="10"> </div>

**[⬆ back to the past](#table-of-contents)**


### Observations 👀

- If your application has no `roles`, then there's no mess, it's just `modules`. ;)

- But taking into consideration that if the roles are not yet defined in your application, `the best option` would be to follow a `dynamic role strategy` based on `permissions` and `each use case within the application (or use case group) would be a specific permission` that would feed the strategy of dynamic roles.

- Note that you can `repeat` modules between `roles`, because a `module can be used by different roles`, because if they are different roles then the use cases should also be different, otherwise those users would have the same role.

- This strategy makes the project easy to `navigate`, easy to `change`, `scale` and `maintain`, which boils down to `good mental health`, besides you will be able to integrate new developers to your projects in a faster way.

**[⬆ back to the past](#table-of-contents)**


## Included tools

`NodeTskeleton` includes some tools in the `src/application/shared` path which are described below:

### Errors 

Is a tool for separating `controlled` from `uncontrolled errors` and allows you to launch application errors according to your business rules, example:

```ts
throw new ApplicationError(
	resources.get(resourceKeys.PROCESSING_DATA_CLIENT_ERROR),
	error.code || applicationStatusCode.INTERNAL_SERVER_ERROR,
	JSON.stringify(error),
);
```

The function of this `class` will be reflected in your `error handler` as it will let you know when an exception was thrown by your `system` or by an `uncontrolled error`, as shown below:

```ts
return async function (err: ApplicationError, context: Context): Promise<void> {
	const result = new Result();
	if (err?.name === "ApplicationError") {
		console.log("Controlled application error", err.message);
	} else {
		console.log("No controlled application error", err);
	}
};
```

**[⬆ back to the past](#table-of-contents)**

### Locals

It is a basic `internationalization` tool that will allow you to manage and administer the local messages of your application, even with enriched messages, for example:

```ts
import resources, { resourceKeys } from "../locals/index";

const simpleMessage = resources.get(resourceKeys.ITEM_PRODUCT_DOES_NOT_EXIST);

const enrichedMessage = resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
	missingParams: keysNotFound.join(", "),
});

// The contents of the local files are as follows:
/* 
// en: 
{
	...
	"SOME_PARAMETERS_ARE_MISSING": "Some parameters are missing: {{missingParams}}.",
	"ITEM_PRODUCT_DOES_NOT_EXIST": "The item product does not exist.",
	"YOUR_OWN_NEED": "You are the user {{name}}, your last name is {{lastName}} and your age is {{age}}.",
	...
}
// es: 
{
	...
	"SOME_PARAMETERS_ARE_MISSING": "Faltan algunos parámetros: {{missingParams}}.",
	"ITEM_PRODUCT_DOES_NOT_EXIST": "El item del producto no existe.",
	"YOUR_OWN_NEED": "Usted es el usuario {{name}}, su apellido es {{lastName}} y su edad es {{age}}.",
	...
}
...
*/

// You can add enriched messages according to your own needs, for example:
const yourEnrichedMessage = resources.getWithParams(resourceKeys.YOUR_OWN_NEED, {
	name: firstName, lastName, age: userAge
});
//
```

And you can add all the parameters you need with as many messages in your application as required.

This tool is now available as an `NPM package`.

<a href="https://www.npmjs.com/package/resources-tsk" target="_blank" >See in NPM</a>

**[⬆ back to the past](#table-of-contents)**

### Mapper

The mapper is a tool that will allow us to change the entities to the DTOs within our application, including entity changes between the data model and the domain and vice versa.

This tool maps objects or arrays of objects, for example:

```ts
// For object
const textFeelingDto = this.mapper.mapObject<TextFeeling, TextFeelingDto>(
	textFeeling,
	new TextFeelingDto(),
);

// For array object
const productsDto: ProductDto[] = this.mapper.mapArray<Product, ProductDto>(
	products,
	() => this.mapper.activator(ProductDto),
);
```

`Activator` is the function responsible for returning a new instance for each call, otherwise you would have an array with the same object repeated N times. 

This tool is now available as an `NPM package`.

<a href="https://www.npmjs.com/package/mapper-tsk" target="_blank" >See in NPM</a>

**[⬆ back to the past](#table-of-contents)**

### Result

`result` is a `tool` that helps us control the flow of our `use cases` and allows us to `manage the response`, be it an `object`, an `array` of objects, a `message` or an `error` as follows:

```ts
export class GetProductUseCase extends BaseUseCase {
	constructor(private productQueryService: IProductQueryService) {
		super();
	}

	async execute(idMask: string): Promise<IResult<ProductDto>> {
		// We create the instance of our type of result at the beginning of the use case.
		const result = new Result<ProductDto>();
		// With the resulting object we can control validations within other functions.
		if (!this.validator.isValidEntry(result, { productMaskId: idMask })) {
			return result;
		}
		const product: Product = await this.productQueryService.getByMaskId(idMask);
		if (!product) {
			// The result object helps us with the error response and the code.
			result.setError(
				this.resources.get(this.resourceKeys.PRODUCT_DOES_NOT_EXIST),
				this.applicationStatusCodes.NOT_FOUND,
			);
			return result;
		}
		const productDto = this.mapper.mapObject<Product, ProductDto>(product, new ProductDto());
		// The result object also helps you with the response data.
		result.setData(productDto, this.applicationStatusCodes.SUCCESS);
		// And finally you give it back.
		return result;
	}
}
```

The `result` object may or may not have a `type` of `response`, it fits your needs, and the `result instance without type` cannot be assigned `data`.

```ts
const resultWithType = new Result<ProductDto>();
// or
const resultWithoutType = new Result();
```

The `result` object can help you in unit tests as shown below:

```ts
it("should return a 400 error if quantity is null or zero", async () => {
	itemDto.quantity = null;
	const result = await addUseCase.execute(userUid, itemDto);
	expect(result.success).toBeFalsy();
	expect(result.error).toBe(
		resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
			missingParams: "quantity",
		}),
	);
	expect(result.statusCode).toBe(resultCodes.BAD_REQUEST);
});
```

This tool is now available as an `NPM package`.

<a href="https://www.npmjs.com/package/result-tsk" target="_blank" >See in NPM</a>

**[⬆ back to the past](#table-of-contents)**

### UseCase

The `UseCase` is a `base class` for `extending` use cases and if you were a retailer you could see it in action in the above explanation of the `Result` tool.

Its main function is to avoid you having to write the same code in every use case you have to build because it contains the instances of the `common tools` you will use in the case implementations.

The tools extended by this class are: the `mapper`, the `validator`, the `message resources` and their `keys`, and the `result codes`.


```ts
import resources, { resourceKeys, Resources } from "../locals/index";
export { IResult, Result, IResultT, ResultT } from "result-tsk";
import * as applicationStatusCodes from "../status/applicationStatusCodes.json";
import { Validator } from "validator-tsk";
import mapper, { IMap } from "mapper-tsk";

export class BaseUseCase {
  constructor() {
    this.mapper = mapper;
    this.resources = resources;
    this.validator = new Validator(
      resources,
      resourceKeys.SOME_PARAMETERS_ARE_MISSING,
      applicationStatusCode.BAD_REQUEST,
    );
  }
  mapper: IMap;
  validator: Validator;
  resources: Resources;
  resourceKeys = resourceKeys;
  applicationStatusCodes = applicationStatusCodes;
}
```

**[⬆ back to the past](#table-of-contents)**

### Validator

The `validator` is a `very simple` but `dynamic tool` and with it you will be able to `validate any type of object and/or parameters` that your use case `requires as input`, and with it you will be able to `return enriched messages` to the `client` regarding the `errors` or necessary parameters not identified in the `input requirements`, for example:

```ts
/*...*/
async execute(userUid: string, itemDto: CarItemDto): Promise<IResult<CarItemDto>> {
	const result = new Result<CarItemDto>();
	if (
		!this.validator.isValidEntry(result, {
			User_Identifier: userUid,
			Car_Item: itemDto,
			Order_Id: itemDto?.orderId,
			Product_Detail_Id: itemDto?.productDetailId,
			Quantity: itemDto?.quantity,
		})
	) {
		/* 
		The error message on the result object will include a base message and will add to 
		it all the parameter names that were passed on the object that do not have a valid value.
		*/
		return result;
	}
	/*...*/
	return result;
}
/*...*/
```
Suppose that in the above example the `itemDto object` has no `orderId` and no `quantity`, then the `result of the error` in the `object result` based on the message of the `SOME_PARAMETERS_ARE_MISSING` for `english local file` would be something like this:

`Some parameters are missing or not valid: Order_Id, Quantity.`

### Important note

In the `validation process` the `result of messages` obtained `will be inserted` in the `{{missingParams}}` key of the local message.
> You can change the message, but not the key `{{missingParams}}`.

#### Validations functions (new feature 🤩)

The validation functions extend the `isValidEntry` method to inject `small functions` created for your `own needs`.

The philosophy of this tool is that it adapts to your own needs and not that you adapt to it.

To do this the `isValidEntry function` input value key pair also accepts `array of small functions` that must perform a specific task with the parameter to be validated.

#### Observation

If you are going to use the `validation functions` feature, you must send as a parameter an array even if it is only a function.

#### Important note

The validation functions should return `NULL` if the parameter for validate `is valid` and a `string message` indicating the reason why the parameter `is not valid`.

```ts
// Validator functions created to meet your own needs
function validateEmail(email: string): string {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return null;
  }
  return resources.getWithParams(resourceKeys.NOT_VALID_EMAIL, { email });
}

function greaterThan(numberName: string, base: number, evaluate: number): string {
  if (evaluate && evaluate > base) {
    return null;
  }
  return resources.getWithParams(resourceKeys.NUMBER_GREATER_THAN, {
    name: numberName,
    baseNumber: base.toString(),
  });
}

function evenNumber(numberName: string, evaluate: number): string {
  if (evaluate && evaluate % 2 === 0) {
    return null;
  }
  return resources.getWithParams(resourceKeys.MUST_BE_EVEN_NUMBER, {
    numberName,
  });
}


// So, in any use case
const person = new Person("Carl", "Sagan", 86);
/*...*/
const result = new Result();
const validEmail = "carlsagan@orion.com";
person.setEmail(validEmail);
if (!validator.isValidEntry(result, {
	Name: person.name,
	Last_Name: person.lastName,
	Age: [
		() => greaterThan("Age", 25, person.age),
		() => evenNumber("Age", person.age),
	],
	Email: [() => validateEmail(person.email)],
})) {
	return result;
};
// result.error would have the following message
// "Some parameters are missing or not valid: The number Age must be greater than 25, The Age param should be even."
```

This tool is now available as an `NPM package`.

<a href="https://www.npmjs.com/package/validator-tsk" target="_blank" >See in NPM</a>

**[⬆ back to the past](#table-of-contents)**


## Dependency injection strategy

For `dependency injection`, no external libraries are used. Instead, a `container strategy` is used in which instances and their dependencies are created and then imported into the objects where they are to be used.

This strategy is only needed in the `adapter layer` for `controllers`, `services` and `providers`, and also for the objects used in the `use case tests`, for example:

```ts
// In the path src/adapters/controllers/textFeeling there is a folder called container... the index file has the following:
import { UseCaseGetHighestFeelingSentence } from "../../../../application/modules/feeling/useCases/getHighest";
import { UseCaseGetLowestFeelingSentence } from "../../../../application/modules/feeling/useCases/getLowest";
import { UseCaseGetFeeling } from "../../../../application/modules/feeling/useCases/getFeeling";
import { textFeelingService } from "../../../providers/container/index";

const getFeelingTextUseCase = new GetFeelingUsecase(textFeelingService);
const getHighestFeelingSentenceUseCase = new GetHighestFeelingSentenceUseCase(textFeelingService);
const getLowestFeelingSentenceUseCase = new GetLowestFeelingSentenceUseCase(textFeelingService);

export { getFeelingTextUseCase, getHighestFeelingSentenceUseCase, getLowestFeelingSentenceUseCase };

// The same way in src/adapters/providers there is the container folder
import TextFeelingService from "../../../application/modules/feeling/serviceContracts/textFeeling/TextFeelingService";
import TextFeelingProvider from "../../providers/feeling/TextFeelingProvider";
import { HealthProvider } from "../health/HealthProvider";

const textFeelingProvider = new TextFeelingProvider();
const textFeelingService = new TextFeelingService(textFeelingProvider);

const healthProvider = new HealthProvider();

export { healthProvider, textFeelingService };

// And your repositories (folder src/adapters/repositories) must have the same strategy
```

In this `container` the `instances` of the `use cases` for the specific `controller` are created and here the necessary dependencies for the operation of those use cases are injected, then they are `exported` and in the `controller` they are `imported` and `used` as following:

```ts
// For ExpressJs
import { Request, Response, NextFunction } from "../../../infrastructure/server/CoreModules";
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import BaseController from "../BaseController";
import {
  getFeelingTextUseCase,
  getHighestFeelingSentenceUseCase,
  getLowestFeelingSentenceUseCase,
} from "./container/index";

class TextFeelingController extends BaseController {
	public constructor() {
		super();
		this.initializeRoutes();
	}
	/*...*/
	getFeelingText = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const textDto: TextDto = req.body;
			this.handleResult(res, await getFeelingTextUseCase.execute(textDto));
		} catch (error) {
			next(error);
		}
	};
	/*...*/
}
```

As you can see this makes it easy to manage the `injection of dependencies` without the need to use `sophisticated libraries` that add more complexity to our applications.

But if you prefer or definitely your project need a library, you can use something like `awilix` or `inversifyJs`.

**[⬆ back to the past](#table-of-contents)**


## Using NodeTskeleton

In this `template` is included the example code base for `KoaJs` and `ExpressJs`, but if you have a `web framework of your preference` you must configure those described below according to the framework.

**[⬆ back to the past](#table-of-contents)**


## Using with KoaJs

Go to `repo for KoaJs` in this <a href="https://github.com/harvic3/nodetskeleton-koa" target="_blank" >Link</a>

And then, continue with the <a href="https://github.com/harvic3/nodetskeleton#installation" target="_self" >installation</a> step described at the end of this manual.

### Controllers

The location of the `controllers` must be in the `adapters` directory, there you can place them by responsibility in separate directories.

The controllers should be `exported as default` modules to make the handling of these in the index file of our application easier.

```ts
// Controller example with export default
import BaseController, { Context } from "../BaseController";
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import {
  getFeelingTextUseCase,
  getHighestFeelingSentenceUseCase,
  getLowestFeelingSentenceUseCase,
} from "./container/index";

class TextFeelingController extends BaseController {
	public constructor() {
		super();
		this.initializeRoutes();
	}
	/*...*/
}

const instance = new TextFeelingController();
// You can see the default export
export default instance;
```
Example of the handling of the `controllers` in the `index` file of our application:

```ts
/*...*/
// Region controllers
import productController from "./adapters/controllers/product/Product.controller";
import shoppingCarController from "./adapters/controllers/shoppingCart/ShoppingCar.controller";
import categoryController from "./adapters/controllers/category/CategoryController";
/*...*/
// End controllers

const controllers: BaseController[] = [
	productController,
	shoppingCarController,
	categoryController,
	/*...*/
];

const app = new App(controllers);
/*...*/
```

### Routes

The strategy is to manage the routes `within` the `controller`, this allows us a `better management` of these, in addition to a greater capacity for `maintenance` and `control` according to the `responsibilities` of the controller.

```ts
/*...*/
private initializeRoutes() {
	this.router.post("/v1/cars", authorization(), this.create);
	this.router.get("/v1/cars/:idMask", authorization(), this.get);
	this.router.post("/v1/cars/:idMask", authorization(), this.buy);
	this.router.post("/v1/cars/:idMask/items", authorization(), this.add);
	this.router.put("/v1/cars/:idMask/items", authorization(), this.remove);
	this.router.delete("/v1/cars/:idMask", authorization(), this.empty);
	/*...*/
}
/*...*/
```

### Root path

If you need to manage a `root path` in your `application` then this part is configured in `App`, the `infrastructure server module` that loads the controllers as well:

```ts
/*...*/
private loadControllers(controllers: BaseController[]) {
	controllers.forEach((controller) => {
		// This is the line and the parameter comes from `config`.
		controller.router.prefix(config.server.root);
		this.app.use(controller.router.routes());
		this.app.use(controller.router.allowedMethods());
	});
}
/*...*/
```

**[⬆ back to the past](#table-of-contents)**


## Using with ExpressJs

Clone this repo or use it as template, and then, continue with the `installation` step described in this guide.

### Controllers

The location of the `controllers` must be in the `adapters` directory, there you can place them by responsibility in separate directories.

The controllers should be `exported as default` modules to make the handling of these in the index file of our application easier.

```ts
// Controller example with export default
import BaseController, { Request, Response, NextFunction } from "../BaseController";
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import {
	getFeelingTextUseCase,
	getHighestFeelingSentenceUseCase,
	getLowestFeelingSentenceUseCase,
} from "./container/index";

class TextFeelingController extends BaseController {
	public constructor() {
		super();
		this.initializeRoutes();
	}
	/*...*/
}

const instance = new TextFeelingController();
// You can see the default export
export default instance;
// Or just use export default new TextFeelingController();
```
Example of the handling of the `controllers` in the `index` file of our application:

```ts
/*...*/
// Region controllers
import productController from "./adapters/controllers/product/Product.controller";
import shoppingCarController from "./adapters/controllers/shoppingCart/ShoppingCar.controller";
import categoryController from "./adapters/controllers/category/CategoryController";
/*...*/
// End controllers

const controllers: BaseController[] = [
	productController,
	shoppingCarController,
	categoryController,
	/*...*/
];

const app = new App(controllers);
/*...*/
```

### Routes

The strategy is to manage the routes `within` the `controller`, this allows us a `better management` of these, in addition to a greater capacity for `maintenance` and `control` according to the `responsibilities` of the controller.

```ts
/*...*/
private initializeRoutes() {
	this.router.post("/v1/cars", authorization(), this.create);
	this.router.get("/v1/cars/:idMask", authorization(), this.get);
	this.router.post("/v1/cars/:idMask", authorization(), this.buy);
	this.router.post("/v1/cars/:idMask/items", authorization(), this.add);
	this.router.put("/v1/cars/:idMask/items", authorization(), this.remove);
	this.router.delete("/v1/cars/:idMask", authorization(), this.empty);
	/*...*/
}
/*...*/
```

### Root path

If you need to manage a `root path` in your `application` then this part is configured in `App`, the `infrastructure server module` that loads the controllers as well:

```ts
/*...*/
private loadControllers(controllers: BaseController[]): void {
	controllers.forEach((controller) => {
		// This is the line and the parameter comes from `config`.
		this.app.use(config.server.root, controller.router);
	});
}
/*...*/
```

**[⬆ back to the past](#table-of-contents)**


## Using with another web server framework

> You must implement the configuration made with `ExpressJs` or `KoaJs` with the framework of your choice and `install` all the `dependencies` and `devDependencies` for your framework, You must also modify the `Server` module, `Middleware` in `infrastructure` directory and the `BaseController` and `Controllers` in adapters directory.

And then, continue with the step `installation`.

**[⬆ back to the past](#table-of-contents)**


## Infrastructure

The infrastructure includes a customizable `HttpClient` with its `response model` in `src/infrastructure/httpClient/TResponse.ts` for error control, and at the application level a class strategy `src/application/shared/result/...` is included as a standardized response model.

**[⬆ back to the past](#table-of-contents)**


## Installation

Depending on your need you have two options, `local` and with `docker compose`, but first of all we need to set up the .env file:

Go to project root directory, create a .env file and inside it copy and paste this content:

```txt
NODE_ENV=development
SERVER_ROOT=/api
SERVER_HOST=localhost
SERVER_PORT=3003
ORIGINS=http://localhost:3003
ENCRYPTION_KEY=JUS9192ZliRlDBWm0BmmJoZO1PbNkZt3kiXNlaGLkIT49uEdgGe79TPCbr0D
JWT_SECRET_KEY=2NtC29d33z1AF1HdPSpn
```

### Local

> First, we must install the dependencies, run: 

```console
npm install
```

> Second, we must update the dependencies, run: 

```console
npm update
```

> Third:

This project is configured with `VS Code` so if you use `WindowsNT` go to the next point, otherwise go to the `.vscode` folder and check the `launch.json` file according to your `SO` and in the `tasks.json` file use the lines with `//` for `Bash` and remove the lines corresponding to `cmd` for `WindowsNT`.

> Finally, in any internet explorer go to:

`localhost:3003/api/ping`

> And you can use PostMan too:

Try import this request. So, click to Import > Select Raw text, and paste the next code:

```console
curl --location --request POST 'localhost:3003/api/v1/users/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "harvic3@protonmail.com",
    "password": "Tm9kZVRza2VsZXRvbg=="
}'
```

The password is equivalent for "NodeTskeleton" in Base64 format.

### Docker Compose

The first two steps are for updating the project, but you can skip to step 3 if you prefer.

> First, we must install the dependencies, run: 

```console
npm install
```

> Second, we must update the dependencies, run: 

```console
npm update
```

> Third, build the app with the following command:

```console
docker-compose up -d --build
```

> Finally, in any internet explorer go to:

`localhost:3040/api/ping`

> And you can use PostMan too:

Try import this request. So, click to Import > Select Raw text, and paste the next code:

```console
curl --location --request POST 'localhost:3040/api/v1/users/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "harvic3@protonmail.com",
    "password": "Tm9kZVRza2VsZXRvbg=="
}'
```

The password is equivalent for "NodeTskeleton" in Base64 format.

### Observation 👀

Copies of those files `launch.json` and `tasks.json` were attached at the end of this document.

**[⬆ back to the past](#table-of-contents)**


## Run Test

> The tests are implemented for each use case in its respective folder. 

> Ideally, each use case of your application should be supported by its respective test.

> The tests use the `Jest` library and can be run in two ways:

```console
npm t
```

or 

```console
npm run test
```

**[⬆ back to the past](#table-of-contents)**


## Application debugger

Before this maybe you should make some settings, for it you can go to **[Setting files](#setting-files)**

> In the side menu of `VS Code` go to the `Execute` ▶ option and then at the top select the `Launch via NPM` option in menu and click on the green Play icon ▶️.

> Remember to put some `stop point` in the code, for example in some method of the `TextFeelingController`.

> For watch and debug mode, you can run the next command:
```console
npm run watch
```

> Nodemon
This option required previous file settings **[Setting files](#setting-files)**

And later go to `Execution and debugging` option in VSCode and play to `Node: Nodemon` task and after select the correct process for attach to debug mode. 
Select some pid nodemon process like `[.../bin/nodemon.js --inspect src/...]`

**[⬆ back to the past](#table-of-contents)**


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

## Setting files
(.vscode)🛠️

This step is optional and it working for windows, but in another OS (Linux or Mac OS) you can do the next instructions:

1. Goto to left menu `Depuration and Execution` and create a `launch.json` file settings for `NodeJs`, do not play it yet...
2. Press combination key command `Ctrl + Shift + B` and select `tsc: watch` or `tsc: build`, so...
3. Now, you can play the configuration of previous one step called `Launch Program`.
4. So, you can ready for the action

So, for Windows, you need this files or you could also perform the above steps. They should also work for Windows.

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
    },
		// For attach to watch mode before run command: npm run watch
		{
      "type": "node",
      "request": "attach",
      "name": "Node: Nodemon",
      "processId": "${command:PickProcess}",
      "restart": true,
      "sourceMaps": true,
      "protocol": "inspector"
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
					"executable": "cmd.exe", // With cmd...
					"args": ["/d", "/c"],
					// "executable": "C:/Program Files/Git/git-bash.exe", // or with git bash too
					// "args": ["-l", "-i"]
				}
			}
		}
	]
}
```

**[⬆ back to the past](#table-of-contents)**


## Test your Clean Architecture

Something important is to know if we really did the job of building our clean architecture well, and this can be found very easily by following these steps: 

1. Make sure you don't have any pending changes in your application to upload to your repository, otherwise upload them if you do.

2. Identify and remove `adapters` and `infrastructure` `directories` from your solution, as well as the `index.ts` file.

3. Execute the test command `npm t` or `npm run test` and the build command `tsc` or `npm run build` too, and everything should run smoothly, otherwise you violated the principle of dependency inversion or due to bad practice, application layers were coupled that should not be coupled.

4. Run the `git checkout .` command to get everything back to normal.

5. Most importantly, no `domain entity` can make use of an `application service` and less of a `provider service` (repository or provider), the `application services use the entities`, the flow goes from the `most external part` of the application `to the most internal part` of it.

**[⬆ back to the past](#table-of-contents)**


## Coupling

For the purpose of giving clarity to the following statement we will define `coupling` as the action of dependence, that is to say that `X depends on Y to function`.

Coupling is not bad if it is well managed, but in a software solution `there should not be coupling` of the `domain and application layers with any other`, but there can be coupling of the infrastructure layer or the adapters layer with the application and/or domain layer, or coupling of the infrastructure layer with the adapters layer and vice versa.

**[⬆ back to the past](#table-of-contents)**


## Conclusions

- The clean architecture allows us to develop the `use cases` and the `domain` (business logic) of an application without worrying about the type of database, web server framework, protocols, services, providers, among other things that can be trivial and that the same application during the development will tell us what could be the best choice for the infrastructure and adapters of our application.

- The clean architecture, the hexagonal architecture, the onion architecture and the ports and adapters architecture in the background can be the same, the final purpose is to decouple the `business layer` of our application from the `outside world`, basically it leads us to think about designing our solutions from the `inside to outside` and `not` from the `outside to inside`.

- When we develop with clean architecture we can more `easily change` any `"external dependency"` of our application without major concerns, obviously there are some that will require more effort than others, for example migrating from a NoSql schema to a SQL schema where probably the queries will be affected, however our business logic can remain intact and work for both models.

- The advantages that clean architecture offers us are very significant; it is one of the `best practices for making scalable software` that `works for your business` and `not for your preferred framework`.

- Clean architecture is basically based on the famous and well-known five `SOLID principles` that we had not mentioned until this moment and that we very little internalized.

- If you liked it and you learned something, give me my star in the project that is the way you can thank me, don't be a damn selfish person who doesn't recognize the effort of others.

### Observation 👀

"The world is selfish" because I am surprised by the number of people who visit this project and browse through all its modules and files, but it seems that it is nothing new because they do not leave their star, good for them.

**[⬆ back to the past](#table-of-contents)**


## Code of Conduct

The Contributor Covenant Code of Conduct for this project is based on Covenant Contributor which you can find at the following link:

- <a href="https://www.contributor-covenant.org/version/2/0/code_of_conduct/code_of_conduct.md" target="_blank" >Go to Code of Conduct</a>

**[⬆ back to the past](#table-of-contents)**


## Warning

> Use this resource at your own risk.

-`You are welcome to contribute to this project, dare to do so.`

-`If you are interested you can contact me by this means.`

- 📫 <a href="mailto:harvic3@protonmail.com" target="_blank" >Write to him</a>

**[⬆ back to the past](#table-of-contents)**
