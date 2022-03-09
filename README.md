# NodeTSkeleton <img height="50" src="https://i.ibb.co/BZkYR9H/esqueletots.png" alt="skeleton" border="0">

## Introduction 🤖

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
  1. [Workers 🔄](#workers)
  1. [GraphQL ✡](#graphql)
  1. [Infrastructure 🏗️](#infrastructure)
  1. [Installation 🔥](#installation)
  1. [Run Test 🧪](#run-test)
  1. [Application debugger 🔬](#application-debugger)
  1. [Build for production ⚙️](#build-for-production)
  1. [Test your Clean Architecture 🥁](#test-your-clean-architecture)
  1. [Coupling 🧲](#coupling)
  1. [Clustering the App (Node Cluster) 🎚](#clustering-the-app-node-cluster)
  1. [Strict mode 🔒](#strict-mode)
  1. [Multi service monorepo 🧮](#multi-service-monorepo)
  1. [Conclusions (Personal) 💩](#conclusions)
  1. [Code of Conduct 👌](#code-of-conduct)
  1. [Warning 💀](#warning)
  1. [Acknowledgments](#acknowledgments)

## Philosophy

Applications are generally developed to be used by people, so people should be the focus of them.

For this reason `user stories` are written, stories that give us information about the type of user, procedures that the user performs in a part of the application `(module)`, important information that serves to `structure the solution` of our application, and in practice, how is this?

The user stories must be in the `src/application` path of our solution, there we create a directory that we will call `modules` and inside this, we create a directory for the task role, for example (customer, operator, seller, admin, ...) and inside the role we create a directory of the corresponding use case module, for example (product, order, account, sales, ...), and in practice that looks more or less like this: 

<div style="text-align:center"> <img src="https://i.ibb.co/t2mHGmC/Node-Tskeleton.png" alt="Node-Tskeleton" border="10"> </div>

**[⬆ back to the past](#table-of-contents)**


[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/vickodev)


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

Or if the pointer of your program is in the scope of your UseCase you can use the error control function of the BaseUseCase class:

```ts
if (!someCondition) { // Or any validation result
	result.setError(
		this.resources.get(this.resourceKeys.PROCESSING_DATA_CLIENT_ERROR),
		this.applicationStatus.INTERNAL_SERVER_ERROR,
	)
	this.handleResultError(result);
}
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
export default {
	...
	SOME_PARAMETERS_ARE_MISSING: "Some parameters are missing: {{missingParams}}.",
	ITEM_PRODUCT_DOES_NOT_EXIST: "The item product does not exist.",
	YOUR_OWN_NEED: "You are the user {{name}}, your last name is {{lastName}} and your age is {{age}}.",
	...
}
// es: 
export default {
	...
	SOME_PARAMETERS_ARE_MISSING: "Faltan algunos parámetros: {{missingParams}}.",
	ITEM_PRODUCT_DOES_NOT_EXIST: "El item del producto no existe.",
	YOUR_OWN_NEED: "Usted es el usuario {{name}}, su apellido es {{lastName}} y su edad es {{age}}.",
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

For use it in any UseCase you can do something like: 

```ts
result.setError(
	this.resources.get(this.resourceKeys.PROCESSING_DATA_CLIENT_ERROR), // Or this.resources.getWithParams(...)...
	this.applicationStatus.INTERNAL_SERVER_ERROR,
);
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
export class GetProductUseCase extends BaseUseCase<string> { // Or BaseUseCase<{ idMask: string}>
	constructor(private productQueryService: IProductQueryService) {
		super();
	}

	async execute(idMask: string): Promise<IResult<ProductDto>> { // If object input type is (params: { idMask: string}) so you can access to it like params.idMask
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
	const result = await addUseCase.execute({ userUid, itemDto });
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

export abstract class BaseUseCase<T> {
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

	abstract execute(args?: T): Promise<IResult>;
}
```

Type `T` in `BaseUseCase<T>` is a way for the optimal control of the input parameters of your UseCase unit code.

So, you can use it like the next examples: 

```ts
// UseCase with input params
export class LoginUseCase
  extends BaseUseCase<{ email: string; passwordB64: string }>
{
  constructor(private readonly authProvider: IAuthProvider) {
    super();
  }

  async execute(params: { email: string; passwordB64: string }): Promise<IResultT<TokenDto>> {
		// Your UseCase implementation
	}
}

// UseCase without input params
export class ListUsersUseCase extends BaseUseCase<undefined>
{
  constructor(private readonly userProvider: IUserProvider) {
    super();
  }

  async execute(): Promise<IResultT<User[]>> {
		// Your UseCase implementation
	}
}
```

**[⬆ back to the past](#table-of-contents)**

### Validator

The `validator` is a `very simple` but `dynamic tool` and with it you will be able to `validate any type of object and/or parameters` that your use case `requires as input`, and with it you will be able to `return enriched messages` to the `client` regarding the `errors` or necessary parameters not identified in the `input requirements`, for example:

```ts
/*...*/
async execute(params: { userUid: string, itemDto: CarItemDto }): Promise<IResult<CarItemDto>> {
	const result = new Result<CarItemDto>();
	if (
		!this.validator.isValidEntry(result, {
			User_Identifier: params.userUid,
			Car_Item: params.itemDto,
			Order_Id: params.itemDto?.orderId,
			Product_Detail_Id: params.itemDto?.productDetailId,
			Quantity: params.itemDto?.quantity,
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

For `dependency injection`, no external libraries are used. Instead, a `container dictionary strategy` is used in which instances and their dependencies are created and then resolved from container class.

This strategy is only needed in the `adapter layer` dependencies for `controllers` like `services` and `providers`, and also for the objects used in the `use case tests`, for example:

```ts
// In the path src/adapters/controllers/textFeeling there is a folder called container and the index file have the following code lines:
import { GetHighestFeelingSentenceUseCase } from "../../../../application/modules/feeling/useCases/getHighest";
import { GetLowestFeelingSentenceUseCase } from "../../../../application/modules/feeling/useCases/getLowest";
import { GetFeelingTextUseCase } from "../../../../application/modules/feeling/useCases/getFeeling";
import { Container, IContainerDictionary } from "../../../shared/Container";
import { textFeelingService } from "../../../providers/container/index";

const dictionary: IContainerDictionary = {};
dictionary[GetHighestFeelingSentenceUseCase.name] = () => new GetHighestFeelingSentenceUseCase(textFeelingService);
dictionary[GetLowestFeelingSentenceUseCase.name] = () => new GetLowestFeelingSentenceUseCase(textFeelingService);
dictionary[GetFeelingTextUseCase.name] = () => new GetFeelingTextUseCase(textFeelingService);

// This class instance contains the UseCases needed for your controller
export default new Container(dictionary); // *Way One*
// You can also export separate instances if required, like this:
const anotherUseCaseOrService = new AnotherUseCaseOrService();
export { anotherUseCaseOrService }; // *Way Two*
// You can combine the two strategies (Way One and Way Two) according to your needs
```

Another way to export dependencies is to simply create instances of the respective classes (only recommended with provider and repository services).
```ts
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

For `ioc` our `container` strategy manage the `instances` of the `UseCases` for the specific `controller` and here the necessary dependencies for the operation of those `UseCases` are injected, then they are `exported` and into the `controller` they are `imported` and `used` from our `container` as following:

```ts
// For ExpressJs
import { GetFeelingTextUseCase } from "../../../application/modules/feeling/useCases/getFeeling";
import { Request, Response, NextFunction } from "../../../infrastructure/server/CoreModules";
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import BaseController from "../BaseController";
import container, {
  anotherUseCaseOrService,
} from "./container/index";

class TextFeelingController extends BaseController {
	public constructor() {
		super();
		this.initializeRoutes();
	}
	/*...*/
	// *Way One*
	getFeelingText = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const textDto: TextDto = req.body;
			this.handleResult(res, await container.get<GetFeelingTextUseCase>(GetFeelingTextUseCase.name).execute(textDto));
		} catch (error) {
			next(error);
		}
	};

	// *Way Two*
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

The *Way One* delivers a different instance for each UseCase call.

The *Way Two* delivers the same instance (only one instance) for each useCase call, which can lead to the most common problem, mutations.

As you can see this makes it easy to manage the `injection of dependencies` without the need to use `sophisticated libraries` that add more complexity to our applications.

But if you prefer or definitely your project need a library, you can use something like `awilix`, `inversifyJs` or `typedi`.

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
import container, {
  anotherUseCaseOrService,
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
// Controller example with default export
import BaseController, { Request, Response, NextFunction } from "../BaseController";
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import container, {
  anotherUseCaseOrService,
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

## Workers

For cpu intensive tasks you have the possibility to use the `WorkerProvider` which enables you to run any script in an abstracted way, for example:

```ts
private async encryptPassword(user: User): Promise<string> {
    const task: WorkerTask = new WorkerTask(TaskDictionaryEnum.ENCRYPT_PASSWORD);
    const workerArgs = {
      text: `${user.email}-${user.password}`,
      encryptionKey: AppSettings.EncryptionKey,
      iterations: AppSettings.EncryptionIterations,
    };
    task.setArgs(workerArgs);
    const workerResult = await this.workerProvider.executeTask<string>(task);

    return Promise.resolve(workerResult);
}
```

At the application layer level the `WorkerTask` class allows you to create a work task in which you pass the type through an enum in which you can add your tasks and assign some parameters to it.

```ts
export enum TaskDictionaryEnum {
  ENCRYPT_PASSWORD = "ENCRYPT_PASSWORD",
}
```

And at the adapter layer level we have the dictionary that will allow us to manage the respective script to be executed.

```ts
import { join } from "path";

export class TaskDictionary {
  static ENCRYPT_PASSWORD = join(__dirname, "../scripts/encryptPassword.js");
}
```

And inside the WorkerProvider is where the magic happens, especially in the next point.

```ts
const worker = new Worker(TaskDictionary[task.taskEnum], {
	workerData: { task: task },
});
```

This way we can create scripts for heavy computational tasks according to our own needs avoiding blocking the main execution thread of our application.

**[⬆ back to the past](#table-of-contents)**


## GraphQL

Coming soon ;)

**[⬆ back to the past](#table-of-contents)**


## Infrastructure

The infrastructure includes a customizable `HttpClient` with its `response model` in `src/infrastructure/httpClient/TResponse.ts` for error control, and at the application level a class strategy `src/application/shared/result/...` is included as a standardized response model.

**[⬆ back to the past](#table-of-contents)**


## Installation

Depending on your need you have two options, `local` and with `docker compose`, but first of all we need to set up the `.env file`:

Go to project root directory, create a `.env file` and inside it copy and paste this content:

```txt
NODE_ENV=development
SERVICE_CONTEXT=
SERVER_ROOT=/api
SERVER_HOST=localhost
SERVER_PORT=3003
ORIGINS=http://localhost:3003
ENCRYPTION_KEY=JUS9192ZliRlDBWm0BmmJoZO1PbNkZt3kiXNlaGLkIT49uEdgGe79TPCbr0D
ENCRYPTION_ITERATIONS=4e4
ENCRYPTION_KEY_SIZE=128
JWT_SECRET_KEY=2NtC29d33z1AF1HdPSpn
```

`SERVICE_CONTEXT` env can be empty or delete it if you don't pretend use multi service feature.

### Local

> First, we must install the dependencies, run: 

```console
npm install
```

> Second, we must update the dependencies, run: 

```console
npm update
```

> Third, run project in hot reload mode (Without debug, for it go to [Debug instructions](#application-debugger))

```console
npm run dev
```

or 

```console
npm run build
node dist/index
```

> Finally, in any web browser go to:

`localhost:3003/api/ping`

> And you can use `PostMan` as follow:

Try import this request. So, click to Import > Select Raw text, and paste the next code:

```console
curl --location --request POST 'localhost:3003/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "nodetskeleton@email.com",
    "password": "Tm9kZVRza2VsZXRvbio4"
}'
```

The password is equivalent for "NodeTskeleton*8" in Base64 format.

>> Register a new user
```console
curl --location --request POST 'localhost:3003/api/v1/users/sign-up' \
--header 'Accept-Language: es' \
--header 'Authorization: Bearer jwt' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Jhon Doe",
    "gender": "Male",
    "password": "Tm9kZVRza2VsZXRvbio4",
    "email": "nodetskeleton@tesla.com"
}'
```

**[⬆ back to the past](#table-of-contents)**

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

`localhost:3003/api/ping`

> And you can use PostMan too:

Try import this request. So, click to Import > Select Raw text, and paste the next code:

>> User login
```console
curl --location --request POST 'localhost:3003/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "harvic3@protonmail.com",
    "password": "Tm9kZVRza2VsZXRvbg=="
}'
```

The password is equivalent for "NodeTskeleton" in Base64 format.

>> Register a new user
```console
curl --location --request POST 'localhost:3003/api/v1/users/sign-up' \
--header 'Accept-Language: es' \
--header 'Authorization: Bearer jwt' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Jhon Doe",
    "gender": "Male",
    "password": "Tm9kZVRza2VsZXRvbio4",
    "email": "nodetskeleton@tesla.com"
}'
```

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

If you are using VS Code the easiest way to debug the solution is to follow these instructions:

First go to `package.json` file.

Second, into package.json file locate the `debug` command just above the `scripts` section and click on it.

Third, choose the `dev script` when the execution options appear.

So, wait a moment and then you will see something like this on the console.

```console
$ npm run dev

> nodetskeleton@1.0.0 dev
> ts-node-dev --respawn -- src/index.ts

[INFO] XX:XX:XX ts-node-dev ver. 1.1.8 (using ts-node ver. 9.1.1, typescript ver. 4.6.2)
Running in dev mode
Initializing controllers for NodeTskeleton ServiceContext
AuthController was loaded
HealthController was loaded
Server NodeTskeleton running on localhost:3003/api
```

To stop the debug just press `Ctrl C` and close the console that was opened to run the debug script.

This method will allow you to develop and have the solution be attentive to your changes (hot reload) without the need to restart the service, VS Code does it for you automatically.

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


## Clustering the App (Node Cluster)

NodeJs solutions run on a single thread, so it is important not to run CPU-intensive tasks, however NodeJs in Cluster Mode can run on several cores, so if you want to get the most out of your solution running on a multi-core machine, this is probably a good option, but if your machine has no more than one core, this will not help.

So, for Cluster de App, replace `src/index.ts` code for the next code example.


### Observation 👀
For some reason that I don't understand yet, the dynamic loading of modules presents problems with Node in Cluster Mode, so if you plan to use cluster mode, you must inject the controllers to the `AppWrapper` class instance as shown in the following code sample, otherwise if you are not going to use the cluster mode then you can skip the import of the controllers and let the loading be done dynamically by the `AppWrapper` internal class method.

```ts
// Node App in Cluster mode
import { cpus } from "os";
import "express-async-errors";
import * as cluster from "cluster";
import config from "./infrastructure/config";
import AppWrapper from "./infrastructure/app/AppWrapper";
import { HttpServer } from "./infrastructure/app/server/HttpServer";
import errorHandlerMiddleware from "./infrastructure/middleware/error";

// Controllers
import BaseController from "./adapters/controllers/base/Base.controller";
import healthController from "./adapters/controllers/health/Health.controller";
import authController from "./adapters/controllers/auth/Auth.controller";
// End Controllers

const controllers: BaseController[] = [healthController, authController];

function startApp(): void {
  const appWrapper = new AppWrapper(controllers);
  const server = new HttpServer(appWrapper);
  server.start();

  process.on("uncaughtException", (error: NodeJS.UncaughtExceptionListener) => {
    errorHandlerMiddleware.manageNodeException("UncaughtException", error);
  });

  process.on("unhandledRejection", (reason: NodeJS.UnhandledRejectionListener) => {
    errorHandlerMiddleware.manageNodeException("UnhandledRejection", reason);
  });
}

if (cluster.isMaster) {
  const totalCPUs = cpus().length;
  console.log(`Total CPUs are ${totalCPUs}`);
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork(config.Environment);
  }

  cluster.on("exit", (worker: cluster.Worker, code: number, signal: string) => {
    console.log(`Worker ${worker.process.pid} stopped with code ${code} and signal ${signal}`);
    cluster.fork();
  });
} else {
  startApp();
}

// Node App without Cluster mode and controllers dynamic load.
import "express-async-errors";
import AppWrapper from "./infrastructure/app/AppWrapper";
import { HttpServer } from "./infrastructure/app/server/HttpServer";
import errorHandlerMiddleware from "./infrastructure/middleware/error";

const appWrapper = new AppWrapper();
const server = new HttpServer(appWrapper);
server.start();

process.on("uncaughtException", (error: NodeJS.UncaughtExceptionListener) => {
  errorHandlerMiddleware.manageNodeException("UncaughtException", error);
});

process.on("unhandledRejection", (reason: NodeJS.UnhandledRejectionListener) => {
  errorHandlerMiddleware.manageNodeException("UnhandledRejection", reason);
});

// Node App without Cluster mode with controllers load by constructor.
import "express-async-errors";
import AppWrapper from "./infrastructure/app/AppWrapper";
import { HttpServer } from "./infrastructure/app/server/HttpServer";
import errorHandlerMiddleware from "./infrastructure/middleware/error";

// Controllers
import BaseController from "./adapters/controllers/base/Base.controller";
import healthController from "./adapters/controllers/health/Health.controller";
import authController from "./adapters/controllers/auth/Auth.controller";
// End Controllers

const controllers: BaseController[] = [healthController, authController];

const appWrapper = new AppWrapper(controllers);
const server = new HttpServer(appWrapper);
server.start();

process.on("uncaughtException", (error: NodeJS.UncaughtExceptionListener) => {
  errorHandlerMiddleware.manageNodeException("UncaughtException", error);
});

process.on("unhandledRejection", (reason: NodeJS.UnhandledRejectionListener) => {
  errorHandlerMiddleware.manageNodeException("UnhandledRejection", reason);
});
```
**[⬆ back to the past](#table-of-contents)**


## Strict mode

TypeScript's strict mode is quite useful because it helps you maintain the type safety of your application making the development stage of your solution more controlled and thus avoiding the possible errors that not having this option enabled can bring.

This option is enabled by default in NodeTskeleton and is managed in the `tsconfig.json` file of your solution, but if you are testing and don't want to have headaches you can disable it.

```json
  "strict": true,
```

## Multi service monorepo

With this simple option you can develop a single code base and by means of the configuration file through the `ENVs` (environment variables) decide which service context to put online, so with the execution of different PipeLines.

Note that you must set the `ServiceContext` variable of the Server parameter of the `config file` from value of your `.env file` as follows:

```ts
// infrastructure/config/index
Server: {
	...
  ServiceContext: process.env.SERVICE_CONTEXT || ServiceContext.NODE_TS_SKELETON,
}
```

Note that by default all solution `Controllers` are set to the `NodeTskeleton context` which is the default value, but you are free to create as many contexts as your solution needs and initialize each `Controller` to the appropriate context. 
The `HealthController` must always keep the original context `NodeTskeleton context`, it cannot change because you need a health check point for each exposed service.

```ts
// For example, the application have the SECURITY context and change the Authentication Controller context as well:
class AuthController extends BaseController {
  constructor() {
    super(ServiceContext.SECURITY);
    this.initializeRoutes();
  }
	...
}
```

The `ServiceContext` file is located in the infrastructure server directory: 

```ts
// NodeTskeleton is the only context created, but you can create more o change this.
export enum ServiceContext {
  NODE_TS_SKELETON = "NodeTskeleton",
  SECURITY = "security",
  USERS = "users",
}
```

### How it working?

So, how can you put the multi-service mode to work?

For this feature the project has a basic `api-gateway` to route an entry point to the different ports exposed by each service.

You should note that you need, `Docker` installed on your machine and once you have this ready, then you should do the following:

Open `Auth.controller.ts` and do this into it:

```ts
class AuthController extends BaseController {
  constructor() {
    super(ServiceContext.SECURITY); // Set Security context
    this.initializeRoutes();
  }
}
```

The same with `Users.controller.ts` as follows:

```ts
class UsersController extends BaseController {
  constructor() {
    super(ServiceContext.USERS); // Set Users context
    this.initializeRoutes();
  }
}
```

> First, open your console a go to the root directory of NodeTskeleton project.

> Second, execute the next sequence of commands:

>> Build the `tskeleton image`
```console
docker build . -t tskeleton-image
```

>> Build the `gateway image`
```console
cd tsk-gateway
docker build . -t gateway-image
```

>> Run docker-compose for launch our solution
```console
docker-compose up --build
```

And latter you can use `Postman` or web browser for use the exposed endpoints of two services based in NodeTskeleton project

> Security service
>> Health
```console
curl --location --request GET 'localhost:8080/security/api/ping'
```
>> Login
```console
curl --location --request POST 'localhost:8080/security/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "nodetskeleton@email.com",
    "password": "Tm9kZVRza2VsZXRvbio4"
}'
```

> Users service
>> Health
```console
curl --location --request GET 'localhost:8080/management/api/ping'
```
>> Register a new user
```console
curl --location --request POST 'localhost:8080/management/api/v1/users/sign-up' \
--header 'Accept-Language: es' \
--header 'Authorization: Bearer jwt' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Jhon Doe",
    "gender": "Male",
    "password": "Tm9kZVRza2VsZXRvbio4",
    "email": "nodetskeleton@tesla.com"
}'
```

### Observation
If you are not going to use this functionality you can delete the `tsk-gateway` directory.


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


## Future tasks
- Update documentation about many issues


## Acknowledgments

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/vickodev)
