# NodeTSkeleton <img height="50" src="https://i.ibb.co/BZkYR9H/esqueletots.png" alt="skeleton" border="0">

## Introduction 🤖

**NodeTskeleton** is a **Clean Architecture** based **OOP Template Project** for **NodeJs** using **TypeScript** to implement with any **web server framework** or even any user interface.

The main philosophy of **NodeTskeleton** is that your solution (**domain** and **application**, **“business logic”**) should be independent of framework you use, therefore your code SHOULD NOT BE COUPLED to a specific framework or library, it should works in any framework.

The design of **NodeTskeleton** is based in **Clean Architecture**, an architecture that allow us to decouple the dependencies of our solutions, even without the need to think about the type of **database**, **providers** or **services**, **frameworks**, **libraries** or any other dependency.

**NodeTskeleton** has the minimum and necessary **tools** for you to develop the **business logic** of your application, you can even decide not to use its included tools (you can remove them), and use the libraries or packages of your choice.

## Table of contents

  1. [cli functions 📟](#create-your-first-use-case)
  1. [Philosophy 🧘🏽](#philosophy)
  1. [Included tools 🧰](#included-tools)
		1. [Errors Flow](#errors-flow)
		1. [Locals](#locals)
 		1. [Mapper](#mapper)
 		1. [UseCase](#usecase)
 		1. [UseCases Iterator](#usecases-iterator)
 		1. [Validator](#validator)
 		1. [API Docs generator](#api-docs-generator)
  1. [Dependency injection strategy 📦](#dependency-injection-strategy)
  1. [Using NodeTskeleton 👾](#using-nodetskeleton)
		1. [Using with KoaJs 🦋](#using-with-koajs)
		1. [Using with ExpressJs 🐛](#using-with-expressjs)
		1. [Using with another web server framework 👽](#using-with-another-web-server-framework)
		1. [Create your first use case 🎬](#create-your-first-use-case)
  1. [Workers 🔄](#workers)
  1. [Sockets 🕳](#sockets)
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

For this reason **user stories** are written, stories that give us information about the type of user, procedures that the user performs in one or some parts of the application **(modules)**, important information that serves to **structure the solution** of our applications, and in practice, how is that?

The user stories must be in the **src/application** path of our solution, there we create a directory that we will call **modules** and inside this, we create a directory for the task role, for example (customer, operator, seller, admin, ...) and inside the role we create a directory of the corresponding use case module, for example (users, sales, products, organizations, purchases, ...), and in practice that looks more or less like this: 

<div style="text-align:center"> <img src="https://i.ibb.co/t2mHGmC/Node-Tskeleton.png" alt="Node-Tskeleton" border="10"> </div>

**[⬆ go to the future](#table-of-contents)**


[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/vickodev)


### Observations 👀

- If your application has no **roles**, then there's no mess, it's just **modules** and it can be something like users, sales, products, organizations, purchases and an amount others according your own needs.

- But taking into consideration that if the roles are not yet defined in your application, **the best option** would be to follow a **dynamic role strategy** based on **permissions** and **each use case within the application (or use case group) would be a specific permission** that would feed the strategy of dynamic roles like **ACL**.

- Note that you can **repeat** modules between **roles**, because a **module can be used by different roles**, because if they are different roles then the use cases behavior should also be different, otherwise those users would have the same role.

- This strategy makes the project easy to **navigate**, easy to **change**, **scale** and **maintain** (Talking about development), which boils down to **good mental status**, besides you will be able to integrate new developers to your projects in a faster way.

I personally recommend **the permission-based dynamic role strategy** to avoid complications due to roles and permissions in the future because this is what usually happens when developing a product, even if you are convinced that it is very well defined.

**[⬆ go to the future](#table-of-contents)**


## Included tools

**NodeTskeleton** includes some tools in the **src/application/shared** path which are described below:

### Errors Flow

Is a tool for separating **controlled** from **uncontrolled errors** and allows you to launch application errors according to your business rules. 
This is important because the main idea when developing applications is to try as much as possible to predict the behavior of these, that's why controlled errors are useful and we need a strategy to allow us to identify them, for example:

```ts
/*
** context: it's the context where the error will be launched.
*/
export class ApplicationError extends Error {
  constructor(
    readonly context: string,
    readonly message: string,
    readonly errorCode: number | string,
    readonly stack?: string,
  ) {
    super(message);
    this.name = `${context.replace(/\s/g, StringUtil.EMPTY)}_${ApplicationError.name}`;
    this.errorCode = errorCode;
    this.stack = stack;
  }
  // ...
}
```
Is important to note that the name of the execution `CONTEXT` is concatenated with the name of the `ApplicationError class` in order to better identification of the controlled errors.
It's very useful for observability tools in order to filter out real errors from those we are controlling.

The straightforward way to use it is as follows:

```ts
throw new ApplicationError(
  this.CONTEXT,
  appMessages.get(appMessages.keys.ERROR_TO_CREATE_SOMETHING),
  ApplicationStatus.BAD_REQUEST,
  JSON.stringify(error),
);
```

Or if the pointer of your program is in the scope of your UseCase, you can use the error control function in the BaseUseCase class:

> The dirty way:
```ts
if (!someCondition) { // Or any validation result
  result.setError(
    this.appMessages.get(this.appMessages.keys.PROCESSING_DATA_CLIENT_ERROR),
    this.applicationStatus.INTERNAL_SERVER_ERROR,
  );
  this.handleResultError(result);
}
```

> The clean way one:
```ts
// In the UseCase context in Execute method
const user = await this.getUser(result, userId);
if (result.hasError()) return result;

// In the UseCase context in out of Execute method
private async getUser(result: IResult, userId: string): Promise<User> {
  const user = await this.userRepository.getById(userId):
  if (!user) {
    result.setError(
      this.appMessages.get(this.appMessages.keys.USER_CAN_NOT_BE_CREATED),
      this.applicationStatus.INTERNAL_CONFLICT,
    );
  }

  return user;
}
```

> The clean way two:
```ts
// In the UseCase context in Execute method
const { value: userExists } = await result.execute(
  this.userExists(user.email?.value as string),
);
if (userExists) return result;

// In the UseCase context in out of Execute method
private async userExists(email: string): ResultExecutionPromise<boolean> {
  const userExists = await this.userRepository.getByEmail(email);
  if (userExists) {
    return {
      error: this.appMessages.getWithParams(
        this.appMessages.keys.USER_WITH_EMAIL_ALREADY_EXISTS,
        {
          email,
        },
      ),
      statusCode: this.applicationStatus.INVALID_INPUT,
      value: true,
    };
  }

  return {
    value: false,
  };
}
```

The function of this **class** will be reflected in your **error handler** as it will let you know when an exception was thrown by your **system** or by an **uncontrolled error**, as shown below:

```ts
  handle: ErrorHandler = (
    err: ApplicationError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
  const result = new Result();
  if (err?.name.includes(ApplicationError.name)) {
    console.log("Controlled application error", err.message);
  } else {
    console.log("No controlled application error", err);
  }
};
```

Which use? Feel free, it's about colors and flavours, in fact you can developed your own strategy, but if you are going to prefer to use the `The clean way one` keep present the next recommendations: 

- **Never, but never**, use setData or setMessage methods of the result inside functions `out of the UseCase Execute method context`, only here (Inside the UseCase Execute method) this functions can be call.
- **You only must use methods to manage errors in result objects outside of the UseCase Execute method context.**

Why?, it´s related to side effects, I normally use the `The clean way one` and I have never had a problem related to that, because I have been careful about that.

**[⬆ go to the future](#table-of-contents)**

### Locals

It is a basic **internationalization** tool that will allow you to manage and implement the local messages of your application, even with enriched messages, for example:

```ts
import appMessages from "../locals/index";

const simpleMessage = appMessages.get(appMessages.keys.ITEM_PRODUCT_DOES_NOT_EXIST);

const enrichedMessage = appMessages.getWithParams(appMessages.keys.SOME_PARAMETERS_ARE_MISSING, {
  missingParams: keysNotFound.join(StringUtil.COMMA_SPACE_SEPARATOR),
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
const yourEnrichedMessage = this.appMessages.getWithParams(this.appMessages.keys.YOUR_OWN_NEED, {
  name: firstName, lastName, age: userAge
});
//
```

To use it in any UseCase you can do something like:

```ts
result.setError(
  this.appMessages.get(this.appMessages.keys.PROCESSING_DATA_CLIENT_ERROR), // Or this.appMessages.getWithParams(...)...
  this.applicationStatus.INTERNAL_SERVER_ERROR,
);
```

And you can add all the parameters you need with as many messages in your application as required.

This tool is now available as an **NPM package**.

<a href="https://www.npmjs.com/package/resources-tsk" target="_blank" >See in NPM</a>

**[⬆ go to the future](#table-of-contents)**

### Mapper

The mapper is a tool that will allow us to change the entities to the DTO (Data transfer object) within our application, including entity changes between the data model and the domain and vice versa.

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

**Activator** is the function responsible for returning a new instance for each call, otherwise you would have an array with the same object repeated N times. 

This tool is now available as an **NPM package**.

<a href="https://www.npmjs.com/package/mapper-tsk" target="_blank" >See in NPM</a>

**[⬆ go to the future](#table-of-contents)**

### Result

**Result** is a **tool** that helps us to control the flow of our **use cases** and allows us to **manage the response**, be it an **object**, an **array** of objects, a **message** or an **error** as follows:

```ts
export class GetProductUseCase extends BaseUseCase<string> { // Or BaseUseCase<{ idMask: string}>
  constructor(
    readonly logProvider: ILogProvider,
    private readonly statusProvider: IHealthProvider,
    private readonly productQueryService: IProductQueryService,
  ) {
    super(GetProductUseCase.name, logProvider);
  }

  async execute(locale: LocaleTypeEnum, idMask: string): Promise<IResult<ProductDto>> { // If object input type is (params: { idMask: string}) so you can access to it like params.idMask
    this.setLocale(locale);
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

The **Result** object may or may not have a **type** of **response**, it fits your needs, and the **Result instance without type** cannot be assigned **data**.

```ts
const resultWithType = new Result<ProductDto>();
// or
const resultWithoutType = new Result();
```

For clean code you can return validation result and handles the error in a clean way through **Result** visitor pattern method like:

```ts
async execute(args: ActionDto): Promise<IResult> {
    const result = new Result();

    if (!this.isValidRequest(result, args)) return result;
    // or 
    this.validateRequest(result, args);
    if (result.hasError()) return result;

    /*...*/

    return result;
}
```

The **Result** object can help you in unit tests as shown below:

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

This tool is now available as an **NPM package**.

<a href="https://www.npmjs.com/package/result-tsk" target="_blank" >See in NPM</a>

**[⬆ go to the future](#table-of-contents)**

### UseCase

The **UseCase** is a **base class** for **extending** use cases and if you were a retailer you could see it in action in the above explanation of the **Result** tool.

Its main function is to avoid you having to write the same code in every use case you have to build because it contains the instances of the **common tools** you will use in the case implementations.

The tools extended by this class are: the **mapper**, the **validator**, the **message resources** and their **keys**, and the **result codes**.

```ts
import messageResources, { Resources } from "../locals/messages/index";
import { ILogProvider } from "../log/providerContracts/ILogProvider";
export { IResult, Result, IResultT, ResultT } from "result-tsk";
import { ApplicationStatus } from "../status/applicationStatus";
import wordResources from "../locals/words/index";
import { Validator } from "validator-tsk";
import mapper, { IMap } from "mapper-tsk";
import { Throw } from "../errors/Throw";
import { IResult } from "result-tsk";
export { Validator, Resources };

export abstract class BaseUseCase<T> {
  mapper: IMap;
  validator: Validator;
  appMessages: Resources;
  appWords: Resources;
  applicationStatus = applicationStatus;

  constructor(public readonly CONTEXT: string, public readonly logProvider: ILogProvider) {
    this.mapper = mapper;
    this.appMessages = messageResources;
    this.appWords = wordResources;
    this.validator = new Validator(
      messageResources,
      messageResources.keys.SOME_PARAMETERS_ARE_MISSING,
      ApplicationStatus.INVALID_INPUT,
    );
  }

  // Avoid use this, it is better to control errors through the Result Traveling Pattern.
  handleResultError(result: IResult): void {
    Throw.when(this.CONTEXT, !!result?.error, result.error, result.statusCode);
  }

  abstract execute(locale: LocaleTypeEnum, args?: T): Promise<IResult>;
}
```

Type **T** in **BaseUseCase<T>** is a way for the optimal control of the input parameters of your **UseCase unit code**.

So, you can use it like the next examples: 

```ts
// UseCase with input params
export class LoginUseCase
  extends BaseUseCase<{ email: string; passwordB64: string }>
{
  constructor(logProvider: ILogProvider, private readonly authProvider: IAuthProvider) {
    super(LoginUseCase.name, logProvider);
  }

  async execute(locale: LocaleTypeEnum, args: { email: string; passwordB64: string }): Promise<IResultT<TokenDto>> {
    this.setLocale(locale);
    // Your UseCase implementation
  }
}

// UseCase without input params
export class ListUsersUseCase extends BaseUseCase<undefined>
{
  constructor(logProvider: ILogProvider, private readonly userProvider: IUserProvider) {
    super(ListUsersUseCase.name, logProvider);
  }

  async execute(locale: LocaleTypeEnum): Promise<IResultT<User[]>> {
    this.setLocale(locale);
    // Your UseCase implementation
  }
}
```

**[⬆ go to the future](#table-of-contents)**

### UseCases Iterator

The **Iterator** is a feature supported in a **base class** to **extend** in flows where you must orchestrate **more than one use case** in a transaction.

You should note that this feature is only for **synchronous flows** where there is an initial input corresponding to the first UseCase, but **the response of this one will be the input of the following use case** and so on until the last UseCase is solved and this will finally be the response of the Iterator.

We must be clear that **if any use case fails**, then the **flow will be automatically interrupted** and the answer delivered by the failed use case will be returned. 

The base class to manage our UseCases flows is **BaseIterator**
```ts
export abstract class BaseIterator<InputType, OutputType> {
  readonly #taskIterator: Generator<BaseUseCase<any>>;

  constructor(useCases: BaseUseCase<any>[]) {
    this.#taskIterator = this.createTaskIterator(useCases);
  }

  async iterate(
    locale: LocaleTypeEnum,
    trace: UseCaseTrace,
    args?: InputType,
  ): Promise<ResultT<OutputType>> {
    let task = this.#taskIterator.next();
    let result = (await task.value.execute(locale, trace, args)) as ResultT<any>;

    for (task = this.#taskIterator.next(); !task.done; task = this.#taskIterator.next()) {
      if (!result.success) break;
      // You should use the result data of the previous task as the input of the next task
      result = (await task.value.execute(locale, trace, result?.data)) as ResultT<any>;
      // If you need to change the input for each use case, so contact me to get support ;)
    }

    return result;
  }
```
So, to use it, is important to take into account the following considerations:

1. The iterator is an abstract class because the idea is that there is a concrete class that extends it and that its name indicates exactly what it does, as in a use case.
1. The iterator has the InputType and OutputType. InputType is the generic Type for the first UseCase, and OutputType must be the generic Type of the last UseCase.
1. You can create Iterators with as many use cases as your flow requires.
1. It's recommended to use numbers in letters as keys to be able to take care of the order of them (one, two, three, four, five, six... n). Believe me!!

For example, We will create a modification of the Status UseCase (PongUseCase) to address such a flow for demonstration purposes.
**Note**: `it's valid to clarify that this is an example, that's why I use the same UseCase (AnotherPongUseCase), because due to time issues I cannot create a flow of a real solution, so this is just an illustration of how this feature works.` :)

```ts
// Modified PongUseCase
export class AnotherPongUseCase extends BaseUseCase<{ counter: number }> {
  constructor(
    readonly logProvider: ILogProvider,
    private readonly healthProvider: IStatusProvider,
  ) {
    super(PongUseCase.name, logProvider);
  }

  async execute(
    locale: LocaleTypeEnum,
    trace: UseCaseTrace,
    args: { counter: number },
  ): Promise<IResultT<{ message: string; counter: number }>> {
    this.setLocale(locale);
    const result = new ResultT<{ message: string; counter: number }>();

    const message = await this.healthProvider.get(
      AppSettings.ServiceContext,
      DateTimeUtils.getISONow(),
    );
    result.setData({ message, counter: args.counter + 1 }, this.applicationStatus.SUCCESS);

    return result;
  }
}
```
Now, let's create the respective Iterator to iterate several times that same use case (It's an illustrative example).

```ts
export class VerifyStatusIterator extends BaseIterator<
  // Counter is the input for our modified PongUseCase
  { counter: number },
  {
    message: string;
    counter: number;
  }
> {
  constructor(useCases: {
    stepOne: AnotherPongUseCase;
    stepTwo: AnotherPongUseCase;
    stepThree: AnotherPongUseCase;
    stepFour: AnotherPongUseCase;
  }) {
    super(ArrayUtil.fromObject<BaseUseCase<any>>(useCases));
  }
}
```
And is important to know that in `StatusController` we have the respective Iterator class `VerifyStatusIterator` as following:

```ts
  verifyStatusIteration: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    return this.handleResult(
      res,
      next,
      this.servicesContainer.get<VerifyStatusIterator>({
        // It is important to be careful with this order, otherwise you will have unexpected surprises 
        stepOne: this.servicesContainer.get<AnotherPongUseCase>(this.CONTEXT, AnotherPongUseCase.name),
        stepTwo: this.servicesContainer.get<AnotherPongUseCase>(this.CONTEXT, AnotherPongUseCase.name),
        stepThree: this.servicesContainer.get<AnotherPongUseCase>(this.CONTEXT, AnotherPongUseCase.name),
        stepFour: this.servicesContainer.get<AnotherPongUseCase>(this.CONTEXT, AnotherPongUseCase.name),
        // Look here for the type of input that corresponds to the type of the first use case
      }).iterate(req.locale, res.trace, { counter: 0 }),
    );
  };
```
Then, the Iterator result for this example is something like:

```json
{
    "data": {
        "message": "<div><h2>TSkeleton NodeTskeleton service context online at 1963-01-02T00:00:00.060-05:00</h2></div>",
        "counter": 4
    },
    "statusCode": "00",
    "success": true
}
```
We use the same UseCase to increase the counter value by one unit for each use case, magic!! 😜

I hope you make good use of this new functionality and do not abuse it too much. 🫣

It is important to mention that the implementation was done this way because the idea is that your Iterators are concrete classes with a given context, and also have their unit tests as a use case.

**[⬆ go to the future](#table-of-contents)**

### Validator

The **validator** is a **very simple** but **dynamic tool** and with it you will be able to **validate any type of object and/or parameters** that your use case **requires as input**, and with it you will be able to **return enriched messages** to the **client** regarding the **errors** or necessary parameters not identified in the **input requirements**, for example:

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
Suppose that in the above example the **itemDto object** has no **orderId** and no **quantity**, then the **result of the error** in the **object result** based on the message of the **SOME_PARAMETERS_ARE_MISSING** for **english local file** would be something like this:

**Some parameters are missing or not valid: Order_Id, Quantity.**

### Important note

In the **validation process** the **result of messages** obtained **will be inserted** in the **{{missingParams}}** key of the local message.
> You can change the message, but not the key **{{missingParams}}**.

#### Validations functions (new feature 🤩)

The validation functions extend the **isValidEntry** method to inject **small functions** created for your **own needs**.

The philosophy of this tool is that it adapts to your own needs and not that you adapt to it.

To do this the **isValidEntry function** input value key pair also accepts **array of small functions** that must perform a specific task with the parameter to be validated.

#### Observation

If you are going to use the **validation functions** feature, you must send as a parameter an array even if it is only a function.

#### Important note

The validation functions should return **NULL** if the parameter for validate **is valid** and a **string message** indicating the reason why the parameter **is not valid**.

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

This tool is now available as an **NPM package**.

<a href="https://www.npmjs.com/package/validator-tsk" target="_blank" >See in NPM</a>

**[⬆ go to the future](#table-of-contents)**


## API Docs generator

Now standardized API documentation can already be generated automatically through a strategy in the method where the routes are configured using Open API.

You can see the API documentation about your project going to the next url once you have setup your project:
```text
localhost:3003/api/docs
```
But first, you have to setup the project, so if you want, you can do it very fast executing this command on your computer:
- Run it using NPX and replace `my-awesome-project` for your own project name
```console
npx run-tsk setup project-name=my-awesome-project
```

> The API documentation is done in the initializeRoutes method of each controller as shown below:

```ts
  initializeRoutes(router: IRouter): void {
    // Default way to registering routes (This still works)
    this.router = router();
    this.router.get("/v1/users", this.getUser);

    // New proposal to register routes
    this.setRouter(router())
      .addRoute({
        method: HttpMethodEnum.GET,
        path: "/v1/users",
        handlers: [this.getUser],
        produces: [
          {
            applicationStatus: ApplicationStatus.SUCCESS,
            httpStatus: HttpStatusEnum.SUCCESS,
          },
          {
            applicationStatus: ApplicationStatus.USER_NOT_FOUND,
            httpStatus: HttpStatusEnum.NOT_FOUND,
          },
        ],
      });
  }
```

Then once you have added your route, the same method is used to configure properties called model inside produce and apiDoc, and in this one you can have the following ways to configure your data models (Request, Response, Parameters) through the following Descriptor Objects:

```ts
// To describe a ResultT type (ResultTDescriber and TypeDescriber helps us to do it)
.addRoute({
  method: HttpMethodEnum.POST,
  path: "/v1/users/sign-up",
  handlers: [this.singUp],
  produces: [
    {
      applicationStatus: ApplicationStatus.INVALID_INPUT,
      httpStatus: HttpStatusEnum.BAD_REQUEST,
      model: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        scheme: new ResultDescriber({
          type: PropTypeEnum.OBJECT,
          props: ResultDescriber.defaultError(),
        }),
      },
    },
    {
      applicationStatus: ApplicationStatus.SUCCESS,
      httpStatus: HttpStatusEnum.CREATED,
      model: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        scheme: new ResultTDescriber<TokenDto>({
          name: TokenDto.name,
          type: PropTypeEnum.OBJECT,
          props: {
            data: new TypeDescriber<TokenDto>({
              name: TokenDto.name,
              type: PropTypeEnum.OBJECT,
              // Option one to describe a scheme response type
              props: {
                token: {
                  type: PropTypeEnum.STRING,
                },
                expiresIn: {
                  type: PropTypeEnum.NUMBER,
                },
                { ... }
              },
              // Option two to describe a scheme response type
              props: TypeDescriber.describeProps<TokenDtoType>({
                token: PropTypeEnum.STRING,
                expiresIn: PropTypeEnum.NUMBER,
                owner: TypeDescriber.describeReference<OwnerType>(OwnerDto.name, {
                  email: PropTypeEnum.STRING,
                  sessionId: PropTypeEnum.STRING,
                }),
              }),
            }),
            ...ResultDescriber.default(),
          },
        }),
      },
    },
    {
      applicationStatus: ApplicationStatus.UNAUTHORIZED,
      httpStatus: HttpStatusEnum.UNAUTHORIZED,
      model: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        scheme: new ResultDescriber({
          type: PropTypeEnum.OBJECT,
          props: ResultDescriber.defaultError(),
        }),
      },
    },
  ],
  description: "Self register user",
  apiDoc: {
    requireAuth: false,
    requestBody: {
      description: "User data",
      contentType: HttpContentTypeEnum.APPLICATION_JSON,
      required: true,
      scheme: new TypeDescriber<Omit<IUserDto, "passwordB64">>({
        name: "User",
        type: PropTypeEnum.OBJECT,
        props: TypeDescriber.describeProps<Omit<IUserDto, "passwordB64">>({
          maskedUid: PropTypeEnum.STRING,
          firstName: PropTypeEnum.STRING,
          lastName: PropTypeEnum.STRING,
          gender: PropTypeEnum.STRING,
          email: PropTypeEnum.STRING,
        }),
      }),
    },
  },
}),

// Observation about ApiDocs TokenDto class for way two to describe a model as example
// Token classes
export type OwnerType = {
  email: string;
  sessionId: string;
};

export class OwnerDto implements OwnerType {
  email: string;
  sessionId: string;

  constructor(props: OwnerType) {
    this.email = props.email;
    this.sessionId = props.sessionId;
  }
}

export type TokenDtoType = {
  token: string;
  expiresIn: number;
  owner: OwnerDto;
};

export class TokenDto implements TokenDtoType {
  token: string;
  expiresIn: number;
  owner: OwnerDto;

  constructor(props: TokenDtoType) {
    this.token = props.token;
    this.expiresIn = props.expiresIn;
    this.owner = props.owner;
  }
}

// To describe a simple Result type (ResultDescriber helps us to do it)
produces: [
  {
    applicationStatus: ApplicationStatus.INVALID_INPUT,
    httpStatus: HttpStatusEnum.BAD_REQUEST,
    model: {
      contentType: HttpContentTypeEnum.APPLICATION_JSON,
      scheme: new ResultDescriber({
        type: PropTypeEnum.OBJECT,
        props: ResultDescriber.defaultError(),
      }),
    },
  },
],
apiDoc: {
  requireAuth: false,
},

// To describe any object (TypeDescriber helps us to do it)
produces: [
  {
    applicationStatus: ApplicationStatus.SUCCESS,
    httpStatus: HttpStatusEnum.SUCCESS,
    model: {
      contentType: HttpContentTypeEnum.TEXT_PLAIN,
      scheme: new TypeDescriber<string>({
        name: PropTypeEnum.STRING,
        type: PropTypeEnum.PRIMITIVE,
        props: {
          primitive: PropTypeEnum.STRING,
        },
      }),
    },
  },
],
apiDoc: {
  requireAuth: false,
},
```

To get an overall idea, here an example:

```ts
  initializeRoutes(router: IRouter): void {
    this.setRouter(router());
    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/v1/auth/login",
      handlers: [this.login],
      produces: [
        {
          applicationStatus: ApplicationStatus.SUCCESS,
          httpStatus: HttpStatusEnum.SUCCESS,
          model: {
            contentType: HttpContentTypeEnum.APPLICATION_JSON,
            scheme: new ResultTDescriber<TokenDto>({
              name: TokenDto.name,
              type: PropTypeEnum.OBJECT,
              props: {
                data: new TypeDescriber<TokenDto>({
                  name: TokenDto.name,
                  type: PropTypeEnum.OBJECT,
                  props: TypeDescriber.describeProps<TokenDto>({
                    token: PropTypeEnum.STRING,
                    expiresIn: PropTypeEnum.NUMBER,
                    // This added section is only a demo to show how to use nested objects in the response
                    owner: TypeDescriber.describeReference<OwnerDto>(OwnerDto.name, {
                      email: PropTypeEnum.STRING,
                      sessionId: PropTypeEnum.STRING,
                    }),
                  }),
                }),
                ...ResultDescriber.default(),
              },
            }),
          },
        },
        {
          applicationStatus: ApplicationStatus.UNAUTHORIZED,
          httpStatus: HttpStatusEnum.UNAUTHORIZED,
          model: {
            contentType: HttpContentTypeEnum.APPLICATION_JSON,
            scheme: new ResultDescriber({
              type: PropTypeEnum.OBJECT,
              props: ResultDescriber.defaultError(),
            }),
          },
        },
      ],
      description: "Login user",
      apiDoc: {
        requireAuth: false,
        requestBody: {
          description: "Credentials for login",
          contentType: HttpContentTypeEnum.APPLICATION_JSON,
          schema: new TypeDescriber<ICredentials>({
            name: "Credentials",
            type: PropTypeEnum.OBJECT,
            props: TypeDescriber.describeProps<ICredentials>({
              email: PropTypeEnum.STRING,
              passwordB64: {
                type: PropTypeEnum.STRING,
                format: PropFormatEnum.BASE64,
              },
            }),
          }),
        },
      },
    });
  }
```

Yes, I know what you're thinking, but no, I thought of that too. 
When you have already registered (described) a model, it is not necessary to describe it again, simply use the `RefTypeDescriber` class and with this the system will simply map internally the reference to the described model if it exists, otherwise, you will have an error in the generated file when it is going to be rendered. 

```ts
  this.addRoute({
    method: HttpMethodEnum.GET,
    path: "/v1/users/:maskedUid",
    handlers: [this.get],
    produces: [
      {
        applicationStatus: ApplicationStatus.SUCCESS,
        httpStatus: HttpStatusEnum.SUCCESS,
        model: {
          contentType: HttpContentTypeEnum.APPLICATION_JSON,
          schema: new RefTypeDescriber({
            type: PropTypeEnum.OBJECT,
            name: Result.name,
          }),
        },
      },
    ],
    description: "Get a user",
    apiDoc: {
      requireAuth: true,
      parameters: [
        TypeDescriber.describeUrlParam({
          name: "maskedUid",
          in: ParameterIn.PATH,
          description: "User maskedUid",
          schema: {
            type: PropTypeEnum.STRING,
          },
        }),
      ],
    },
  });
```

Once you run the application in DEV mode then the system will generate the file corresponding to the configuration you injected in the API. 
The file is created in the root of the project with the name `openapi.json` and it would look something like this:

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "NodeTSkeleton API",
    "version": "1.0.0",
    "description": "Api documentation for NodeTSkeleton project",
    "contact": {
      "name": "TSK Support",
      "url": "https://github.com/harvic3/nodetskeleton",
      "email": "harvic3@protonmail.com"
    },
    "license": {
      "name": "BSD 3-Clause"
    }
  },
  "servers": [
    {
      "url": "http://localhost:3003/api",
      "description": "Local server"
    }
  ],
  "paths": {
    "/v1/auth/logout": {
      "delete": {
        "description": "Logout user",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResultTClosedSession"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Result"
                }
              }
            }
          }
        },
        "security": [
          {
            "http": []
          }
        ]
      }
    },
    "/v1/auth/login": {
      "post": {
        "description": "Login user",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResultTTokenDto"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Result"
                }
              }
            }
          }
        },
        "requestBody": {
          "description": "Credentials for login",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Credentials"
              }
            }
          }
        }
      }
    },
    "/status": {
      "get": {
        "description": "API status endpoint",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/v1/users/sign-up": {
      "post": {
        "description": "Self register user",
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserDto"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Result"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Result"
                }
              }
            }
          }
        },
        "requestBody": {
          "description": "User data",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UserDto"
              }
            }
          }
        }
      }
    },
    "/v1/users/{maskedUid}": {
      "get": {
        "description": "Get user",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserDto"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Result"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Result"
                }
              }
            }
          }
        },
        "parameters": [
          {
            "name": "maskedUid",
            "in": "path",
            "description": "User maskedUid",
            "schema": {
              "type": "string"
            },
            "required": true,
            "allowEmptyValue": false,
            "deprecated": false
          }
        ]
      }
    }
  },
  "components": {
    "schemas": {
      "Object": {
        "type": "object",
        "properties": {
          "closed": {
            "type": "boolean",
            "nullable": false
          }
        }
      },
      "ResultTClosedSession": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string"
          },
          "statusCode": {
            "type": "string"
          },
          "error": {
            "type": "string"
          },
          "success": {
            "type": "boolean"
          },
          "data": {
            "$ref": "#/components/schemas/Object"
          }
        }
      },
      "Result": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string",
            "nullable": true
          },
          "statusCode": {
            "type": "string"
          },
          "error": {
            "type": "string"
          },
          "success": {
            "type": "boolean"
          }
        }
      },
      "TokenDto": {
        "type": "object",
        "properties": {
          "token": {
            "type": "string",
            "nullable": false
          },
          "expiresIn": {
            "type": "number",
            "nullable": false
          }
        }
      },
      "ResultTTokenDto": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string"
          },
          "statusCode": {
            "type": "string"
          },
          "error": {
            "type": "string"
          },
          "success": {
            "type": "boolean"
          },
          "data": {
            "$ref": "#/components/schemas/TokenDto"
          }
        }
      },
      "Credentials": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "nullable": false
          },
          "passwordB64": {
            "type": "string",
            "nullable": false,
            "format": "base64"
          }
        }
      },
      "UserDto": {
        "type": "object",
        "properties": {
          "maskedUid": {
            "type": "string",
            "nullable": false
          },
          "firstName": {
            "type": "string",
            "nullable": false
          },
          "lastName": {
            "type": "string",
            "nullable": false
          },
          "email": {
            "type": "string",
            "nullable": false
          },
          "gender": {
            "type": "string",
            "nullable": false
          }
        }
      },
      "ResultTUserDto": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string"
          },
          "statusCode": {
            "type": "string"
          },
          "error": {
            "type": "string"
          },
          "success": {
            "type": "boolean"
          },
          "data": {
            "$ref": "#/components/schemas/UserDto"
          }
        }
      }
    },
    "securitySchemes": {
      "http": {
        "type": "http",
        "description": "Bearer token",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  }
}
```

This tool is now available as an **NPM package**.

<a href="https://www.npmjs.com/package/openapi-tsk" target="_blank" >See in NPM</a>

**[⬆ go to the future](#table-of-contents)**


## Dependency injection strategy

For **dependency injection**, no complex external libraries were used. Instead, a **container dictionary strategy** is used in which instances and their dependencies are created and then resolved from container class using our own kernel through **dic-tsk**, a powerful and simple package.

This strategy is only needed in the **adapter layer** dependencies for **controllers** like **services** and **providers**, and also for the some services from **infrastructure layer**, for example:

First, all **dic strategy** starts from our **kernel index file** allocated into **adapters layer** as follows:
```ts
// adapters/shared/kernel/index
import { ApplicationStatus } from "../../../application/shared/status/applicationStatus";
import appMessages, { localKeys } from "../../../application/shared/locals/messages";
import tsKernel, { IServiceContainer } from "dic-tsk";

tsKernel.init({
  internalErrorCode: ApplicationStatus.INTERNAL_ERROR,
  appMessages,
  appErrorMessageKey: localKeys.DEPENDENCY_NOT_FOUND,
  applicationStatus,
  applicationStatusCodeKey: "INTERNAL_ERROR",
});

export { IServiceContainer };
export default tsKernel;
```

And later, you can use it as follows:

```ts
// In the path src/adapters/controllers/textFeeling there is a folder called container and the index file have the following code lines:
import { GetHighestFeelingSentenceUseCase } from "../../../../application/modules/feeling/useCases/getHighest";
import { GetLowestFeelingSentenceUseCase } from "../../../../application/modules/feeling/useCases/getLowest";
import { GetFeelingTextUseCase } from "../../../../application/modules/feeling/useCases/getFeeling";
import { textFeelingService } from "../../../providers/container/index";
import kernel from "../../../shared/kernel";

kernel.addScoped(GetHighestFeelingSentenceUseCase.name, () => new GetHighestFeelingSentenceUseCase(textFeelingService));
kernel.addScoped(GetLowestFeelingSentenceUseCase.name, () => new GetLowestFeelingSentenceUseCase(textFeelingService));
kernel.addScoped(GetFeelingTextUseCase.name, () => new GetFeelingTextUseCase(textFeelingService));

// This class contains the UseCases needed for your controller
export { GetHighestFeelingSentenceUseCase,GetLowestFeelingSentenceUseCase, GetFeelingTextUseCase }; 
export default kernel;
```

Another way to export dependencies is to simply create instances of the respective classes (only recommended with provider and repository services).
```ts
// The same way in src/adapters/providers there is the container folder
import TextFeelingService from "../../../application/modules/feeling/serviceContracts/textFeeling/TextFeelingService";
import TextFeelingProvider from "../../providers/feeling/TextFeelingProvider";
import { StatusProvider } from "../status/StatusProvider";

const textFeelingProvider = new TextFeelingProvider();
const textFeelingService = new TextFeelingService(textFeelingProvider);

const statusProvider = new StatusProvider();

export { statusProvider, textFeelingService };
// And your repositories (folder src/adapters/repositories) must have the same strategy
```

For **IOC** our **container** strategy manage the **instances** of the **UseCases** for the specific **controller** and here the necessary dependencies for the operation of those **UseCases** are injected, then they are **exported** and into the **controller** they are **imported** and **used** from our **container** as following:

```ts
// For ExpressJs
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import BaseController, {
  IRequest,
  IResponse,
  INextFunction,
  EntryPointHandler,
  IRouter,
  HttpContentTypeEnum,
  HttpMethodEnum,
  applicationStatus,
  httpStatus,
} from "../base/Base.controller";
import container, {
  GetFeelingTextUseCase,
  GetLowestFeelingSentenceUseCase,
  GetHighestFeelingSentenceUseCase,
} from "./container/index";

export class TextFeelingController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(TextFeelingController.name, serviceContainer);
  }
  /*...*/
  getFeelingText = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    const textDto: TextDto = req.body;
    return this.handleResult(
      res,
      next,
      this.serviceContainer.get<GetFeelingTextUseCase>(this.CONTEXT, GetFeelingTextUseCase.name).execute(req.locale, textDto),
    );
  };
  /*...*/

  initializeRoutes(router: IRouter): void {
    // Current way to registering routes
    this.router = router();
    this.router.get("/v1/feelings", this.getFeelingText);

    // New way to register routes
    this.setRouter(router())
      .addRoute({
        method: HttpMethodEnum.GET,
        path: "/v1/feelings",
        handlers: [this.getFeelingText],
        produces: [
          {
            applicationStatus: ApplicationStatus.SUCCESS,
            httpStatus: HttpStatusEnum.SUCCESS,
          },
          {
            applicationStatus: ApplicationStatus.UNAUTHORIZED,
            httpStatus: HttpStatusEnum.UNAUTHORIZED,
          },
        ],
      });
  }
}

export default new TextFeelingController(container);
```

The way **addScoped** delivers a different instance for each UseCase call but **addSingleton** return the same instance by each call.

As you can see this makes it easy to manage the **injection of dependencies** without the need to use **sophisticated libraries** that add more complexity to our applications.

But if you prefer or definitely your project need a library, you can use something like **awilix**, **inversifyJs** or **typedi**.

This tool is now available as an **NPM package**.

<a href="https://www.npmjs.com/package/dic-tsk" target="_blank" >See in NPM</a>

**[⬆ go to the future](#table-of-contents)**


## Using NodeTskeleton

In this **template** is included the example code base for **KoaJs** and **ExpressJs**, but if you have a **web framework of your preference** you must configure those described below according to the framework.

**[⬆ go to the future](#table-of-contents)**


## Using with KoaJs

Go to **repo for KoaJs** in this <a href="https://github.com/harvic3/nodetskeleton/tree/support/tskeleton-koajs" target="_blank" >Link</a>

And then, continue with the <a href="https://github.com/harvic3/nodetskeleton#installation" target="_self" >installation</a> step described at the end of this manual.

### Controllers

The location of the **controllers** must be in the **adapters** directory, there you can place them by responsibility in separate directories.

The controllers should be **exported as default** modules to make the handling of these in the index file of our application easier.

```ts
// Controller example with default export
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import BaseController, { IContext, INextFunction } from "../BaseController";
import container, {
  AnotherUseCaseOrService,
} from "./container/index";

export class TextFeelingController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(TextFeelingController.name, serviceContainer);
  }
  /*...*/
  getFeelingText = async (ctx: IContext, next: INextFunction): Promise<void> => {
    const textDto: TextDto = ctx.request.body;
    return this.handleResult(
      ctx,
      next,
      this.serviceContainer.get<GetFeelingTextUseCase>(this.CONTEXT, GetFeelingTextUseCase.name).execute(ctx.locale, textDto),
    );
  };
  /*...*/

  initializeRoutes(router: IRouter): void {
    this.router = router;
    this.router.get("/feeling", this.getFeelingText);
  }
}

// You can see the default export
export default new TextFeelingController(container);
```
Example of the handling of the **controllers** in the **index** file of our application:

```ts
/*...*/
// Region controllers
import shoppingCarController from "./adapters/controllers/shoppingCart/ShoppingCar.controller";
import categoryController from "./adapters/controllers/category/CategoryController";
import productController from "./adapters/controllers/product/Product.controller";
/*...*/
// End controllers

const controllers: BaseController[] = [
  productController,
  shoppingCarController,
  categoryController,
  /*...*/
];

const appWrapper = new AppWrapper(controllers);
/*...*/
```

### Routes

The strategy is to manage the routes **within** the same **controller**, this allows us a **better management** of these, in addition to a greater capacity for **maintenance** and **control** according to the **responsibilities** of the controller.

```ts
/*...*/
initializeRoutes(router: IRouter): void {
  this.router = router;
  this.router.post("/v1/cars", this.create);
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

If you need to manage a **root path** in your **application** then this part is configured in **App**, the **infrastructure server module** that loads the controllers as well:

```ts
/*...*/
private loadControllersByConstructor(controllers: BaseController[]): void {
  controllers
    .filter(
      (controller: BaseController) =>
        BooleanUtil.areEqual(controller.serviceContext, AppSettings.ServiceContext) ||
        BooleanUtil.areEqual(controller.serviceContext, ServiceContext.NODE_TS_SKELETON),
    )
    .forEach((controller) => {
      // This is the line and the parameter comes from `config`
      controller.router?.prefix(config.Server.Root);
        this.app
          .use(TypeParser.cast<Router.IMiddleware<any, {}>>(controller.router?.routes()))
          .use(TypeParser.cast<Router.IMiddleware<any, {}>>(controller.router?.allowedMethods()));
    });
}
/*...*/
```

**[⬆ go to the future](#table-of-contents)**


## Using with ExpressJs

Clone this repo or use it as template, and then, continue with the **installation** step described in this guide.

### Controllers

The location of the **controllers** must be in the **adapters** directory, there you can place them by responsibility in separate directories.

The controllers should be **exported as default** modules to make the handling of these in the index file of our application easier.

```ts
// Controller example with default export
import { TextDto } from "../../../application/modules/feeling/dtos/TextReq.dto";
import BaseController, {
  IRequest,
  IResponse,
  INextFunction,
  EntryPointHandler,
  IRouter,
  ServiceContext,
  HttpContentTypeEnum,
  HttpMethodEnum,
  HttpHeaderEnum,
  applicationStatus,
  HttpStatusEnum,
} from "../base/Base.controller";
import container, {
  TextFeelingController,
  AnotherUseCaseOrService,
} from "./container/index";

export class TextFeelingController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(TextFeelingController.name, serviceContainer);
  }
  /*...*/
}

// You can see the default export
export default new TextFeelingController(container);
```
Example of the handling of the **controllers** in the **index** file of our application:

```ts
/*...*/
// Region controllers
import shoppingCarController from "./adapters/controllers/shoppingCart/ShoppingCar.controller";
import categoryController from "./adapters/controllers/category/Category.controller";
import productController from "./adapters/controllers/product/Product.controller";
/*...*/
// End controllers

const controllers: BaseController[] = [
  productController,
  shoppingCarController,
  categoryController,
  /*...*/
];

const appWrapper = new AppWrapper(controllers);
/*...*/
```

### Routes

The strategy is to manage the routes **within** the **controller**, this allows us a **better management** of these, in addition to a greater capacity for **maintenance** and **control** according to the **responsibilities** of the controller.

```ts
/*...*/
initializeRoutes(router: IRouter): void {
  this.router = router();
  this.router.post("/v1/cars", this.create);
  this.router.get("/v1/cars/:idMask", this.get);
  this.router.post("/v1/cars/:idMask", this.buy);
  this.router.post("/v1/cars/:idMask/items", this.add);
  this.router.put("/v1/cars/:idMask/items", this.remove);
  this.router.delete("/v1/cars/:idMask", this.empty);
  /*...*/
  // Or a new way like following:
  this.setRouter(router())
    .addRoute({
      method: HttpMethodEnum.POST,
      path: "/v1/cars",
      handlers: [this.create],
      produces: [
        {
          applicationStatus: ApplicationStatus.CREATED,
          httpStatus: HttpStatusEnum.CREATED,
        },
        {
          applicationStatus: ApplicationStatus.UNAUTHORIZED,
          httpStatus: HttpStatusEnum.UNAUTHORIZED,
        },
      ],
    })
    .addRoute({
      method: HttpMethodEnum.GET,
      path: "/v1/cars/:idMask",
      handlers: [this.get],
      produces: [
        {
          applicationStatus: ApplicationStatus.SUCCESS,
          httpStatus: HttpStatusEnum.SUCCESS,
        },
        {
          applicationStatus: ApplicationStatus.UNAUTHORIZED,
          httpStatus: HttpStatusEnum.UNAUTHORIZED,
        },
      ],
    });
  /*...*/
}
/*...*/
```

### Root path

If you need to manage a **root path** in your **application** then this part is configured in **App**, the **infrastructure server module** that loads the controllers as well:

```ts
/*...*/
private loadControllersByConstructor(controllers: BaseController[]): void {
  controllers
    .filter(
      (controller: BaseController) =>
        BooleanUtil.areEqual(controller.serviceContext, AppSettings.ServiceContext) ||
        BooleanUtil.areEqual(controller.serviceContext, ServiceContext.NODE_TS_SKELETON),
    )
    .forEach((controller) => {
      controller.setApiDocGenerator(this.apiDocGenerator);
      controller.initializeRoutes(TypeParser.cast<IRouter>(Router));
      // This is the line and the parameter comes from `config`.
      this.app.use(AppSettings.ServerRoot, TypeParser.cast<Application>(controller.router));
      console.log(`${controller?.constructor?.name} was initialized`);
    });
  this.app.use(TypeParser.cast<RequestHandler>(statusController.resourceNotFound));
  this.loadErrorHandler();
}
/*...*/
```

**[⬆ go to the future](#table-of-contents)**


## Using with another web server framework

> You must implement the configuration made with **ExpressJs** or **KoaJs** with the framework of your choice and **install** all the **dependencies** and **devDependencies** for your framework, You must also modify the **Server** module, **Middleware** in **infrastructure** directory and the **BaseController** and **Controllers** in adapters directory.

And then, continue with the step **installation**.

**[⬆ go to the future](#table-of-contents)**

## Create your first use case

> This project has a CLI tool to install, initialize and interact with it. 
Is important keep in mind that some commands only work in a root directory of TSK project.

### To install and initialize the project
- Run it using NPX and replace `my-awesome-project` for your own project name
```console
> npx run-tsk setup project-name=my-awesome-project
```
Or with PNPX
```console
> pnpx run-tsk setup project-name=my-awesome-project
```

### Using help command
To see the available commands you can type the following:
```console
> npx run-tsk help
```

### To add a new use case
> With the CLI functions we can create our UseCase common templates and its dependencies, so you can try something like...

With the following command you will create a use case named CreatedOrderUseCase and his controller and containerController. Try it!!

```console
> run-tsk add-use-case api-name=orders use-case=CreateOrder endpoint=/v1/orders/ http-method=POST
```

So, now you could add a new use case to the Orders API with the next command. Try it!!

```console
> run-tsk add-use-case api-name=orders use-case=UpdateOrder endpoint=/v1/orders/ http-method=PUT
```

> It's exciting, now command to create use case supports any order and aliases for their args, for example:
	
```console
> run-tsk add-uc u=Logout e=/v1/auth/logout m=get a=auth
```
or 
```console
> run-tsk add-uc u=Create e=/v1/products m=post a=products
> run-tsk add-uc u=Update e=/v1/products m=put a=products
```

It's very easy to create repetitive code to focus in the important things, application and domain logic, right. But you must know how it works, so continue reading...

Here is where the excitement of development begins, so let's say we need to create a use case to get a user, for example, then what we must do is go to our solution, go to the path **/src/application/modules/** and there look for the module to which our use case belongs, in this case, the user module.

Then once we are in our module, we go to the **useCases directory** and there we create the directory for our use case and in this case we create a **new directory called get**, and inside this we create an index file as follows:

```ts
// src/application/modules/users/useCases/get/index.ts
export class GetUserUseCase extends BaseUseCase {
  
}
```

Next step we define the input parameter that the use case will have, and in turn the output parameter. In this case to obtain a user we will most likely use a unique identifier such as their email, their internal identifier within the system or some other parameter that will be a string in most cases, or the one that is required depending on each case. 
And as output type we will have a User class through the Result object with type T (ResultT).

```ts
// src/application/modules/users/useCases/get/index.ts
export class GetUserUseCase extends BaseUseCase<string> {
  
  async execute(locale: LocaleTypeEnum, trace: UseCaseTrace, userId: string): Promise<IResultT<User>> {
    this.setLocale(locale);
    // Output type result
    const result = new ResultT<User>();

    return result;
  }
}
```

Once we have the input and output defined, we evaluate which providers (repositories or external services) our use case will need and invoke them in the constructor method based on their abstractions. 
In this step we also implement the use case base class constructor as it will be shown in the example.

```ts
// src/application/modules/users/useCases/get/index.ts
export class GetUserUseCase extends BaseUseCase<string> {
  constructor(
    readonly logProvider: ILogProvider,
    private readonly userRepository: IUserRepository,
  ) {
    // Use case context and log provider for Use Case Base Class.
    super(GetUserUseCase.name, logProvider);
  }

  async execute(locale: LocaleTypeEnum, trace: UseCaseTrace, userId: string): Promise<IResultT<User>> {
    this.setLocale(locale);
    const result = new ResultT<User>();

    /* Here your application business logic */

    return result;
  }
}
```
It goes without saying that you must import the types as you use them to eliminate the errors for lack of importing types and modules.

And here it only remains to implement the logic of our use case, and once this step has been completed, then it is time to implement the component test that is recommended to be in this same directory to avoid confusion and have all the resources in the same directory context, and to implement the test cases you can follow the example in the base template.

You should also keep in mind that when you are implementing your business logic, you will have to create new provider and repository contracts or add more responsibility to your existing contracts, and this should go in the **providerContracts directory of the module in question**.

Now what we have left is to expose the use case in the adapters layer, and for this we go to the controller that handles the context of our use case, in this case the users in the path **/src/adapters/controllers/users/Users.controller.ts**.
Once there, we create our method and the corresponding path as shown below:

```ts
// src/adapters/controllers/users/Users.controller.ts
export class UsersController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(UsersController.name, serviceContainer, ServiceContext.USERS);
  }

  singUp: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {

  };

  get: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {

  };

  initializeRoutes(router: IRouter): void {
    this.setRouter(router())
      .addRoute({
        method: HttpMethodEnum.POST,
        path: "/v1/users/sign-up",
        handlers: [authorization(), this.singUp],
        produces: [
          {
            applicationStatus: ApplicationStatus.CREATED,
            httpStatus: HttpStatusEnum.CREATED,
          },
          {
            applicationStatus: ApplicationStatus.UNAUTHORIZED,
            httpStatus: HttpStatusEnum.UNAUTHORIZED,
          },
        ],
      })
      .addRoute({
        method: HttpMethodEnum.GET,
        path: "/v1/users/:userId",
        handlers: [authorization(), this.get],
        produces: [
          {
            applicationStatus: ApplicationStatus.SUCCESS,
            httpStatus: HttpStatusEnum.SUCCESS,
          },
          {
            applicationStatus: ApplicationStatus.UNAUTHORIZED,
            httpStatus: HttpStatusEnum.UNAUTHORIZED,
          },
        ],
      });
  }
}
```

Once we have the above, then we must go to the container directory located in this same directory and there we register our use case in the dependency injection container to be able to use it inside our controller.
In this we inject the use case and export the type as shown below:

```ts
// src/adapters/controllers/users/container/index.ts
kernel.addScoped(
  GetUserUseCase.name,
  () =>
    new GetUserUseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<UserRepository>(CONTEXT, UserRepository.name),
    ),
);

export { RegisterUserUseCase, GetUserUseCase };
export default kernel;
```

Then we go back to our controller and implement the method we had created previously.

```ts
// src/adapters/controllers/users/Users.controller.ts
export class UsersController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(UsersController.name, serviceContainer, ServiceContext.USERS);
  }

  get: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    const userId = req.params?.userId;

    return this.handleResult(
      res,
      next,
      this.servicesContainer
        .get<GetUserUseCase>(this.CONTEXT, RegisterUserUseCase.name)
        .execute(req.locale, res.trace, userId),
    );
  };

  initializeRoutes(router: IRouter): void {
    this.setRouter(router())
      .addRoute({
        method: HttpMethodEnum.POST,
        path: "/v1/users/sign-up",
        handlers: [this.singUp],
        produces: [
          {
            applicationStatus: ApplicationStatus.CREATED,
            httpStatus: HttpStatusEnum.CREATED,
          },
          {
            applicationStatus: ApplicationStatus.UNAUTHORIZED,
            httpStatus: HttpStatusEnum.UNAUTHORIZED,
          },
        ],
      })
      .addRoute({
        method: HttpMethodEnum.GET,
        path: "/v1/users/:userId",
        handlers: [this.get],
        produces: [
          {
            applicationStatus: ApplicationStatus.SUCCESS,
            httpStatus: HttpStatusEnum.SUCCESS,
          },
          {
            applicationStatus: ApplicationStatus.UNAUTHORIZED,
            httpStatus: HttpStatusEnum.UNAUTHORIZED,
          },
        ],
      });
  }
}
```

And following these steps you can add all the use cases that your application requires, taking into account that you will have to create your contracts and the implementation of these.

**[⬆ go to the future](#table-of-contents)**


## Workers

For cpu intensive tasks you have the possibility to use the **WorkerProvider** which enables you to run any script in an abstracted way, for example:

```ts
  private async encryptPassword(user: User): Promise<string> {
    const task: WorkerTask = new WorkerTask(TaskDictionaryEnum.ENCRYPT_PASSWORD);
    const workerArgs = {
      text: new PasswordBuilder(
        TypeParser.cast<Email>(user.email).value as string,
        TypeParser.cast<User>(user as User).password as string,
      ).value,
      encryptionKey: AppSettings.EncryptionKey,
      iterations: AppSettings.EncryptionIterations,
    };
    task.setArgs(workerArgs);
    const workerResult = await this.workerProvider.executeTask<string>(task);

    return workerResult;
  }
```

At the application layer level the **WorkerTask** class allows you to create a work task in which you pass the type through an enum in which you can add your tasks and assign some parameters to it.

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

**[⬆ go to the future](#table-of-contents)**


## Sockets

This project template support this functionality, so if you need it, ask me ;)

**[⬆ go to the future](#table-of-contents)**


## Infrastructure

In this layer you can add the connections services of all services, your repository models, and other services.

The infrastructure includes a customizable **HttpClient** with its **response model** in **src/infrastructure/httpClient/TResponse.ts** for error control, and at the application level a class strategy **src/application/shared/result/...** is included as a standardized response model.

The infrastructure has his container for the Model Repositories, LogProvider, connections and other essential services that we will need to start before any service in our app, this container is located in **src/infrastructure/container** and this service is initialized at the beginning of **AppWrapper** file as follow: 
```ts
import infraContainer from "../container";
infraContainer.load();
```

**[⬆ go to the future](#table-of-contents)**


## Installation

Depending on your need you have two options, **local** and with **docker compose**, but first of all we need to set up the **.env file**:

Go to project root directory, create a **.env file** and inside it copy and paste this content:

```txt
NODE_ENV=dev
SERVICE_CONTEXT=
SERVER_ROOT=/api
SERVER_HOST=localhost
SERVER_PORT=3003
ORIGINS=http://localhost:3003
ENCRYPTION_KEY=JUS9192ZliRlDBWm0BmmJoZO1PbNkZt3kiXNlaGLkIT49uEdgGe79TPCbr0D
ENCRYPTION_ITERATIONS=4e4
ENCRYPTION_KEY_SIZE=128
JWT_SECRET_KEY=2NtC29d33z1AF1HdPSpn
JWT_EXPIRE_IN_SECONDS=3600
```

**SERVICE_CONTEXT** env can be empty or delete it if you don't pretend use multi service feature.

### Local

Is very important if you are using `npm` or `pnpm`, use it correctly.

> First, we must install the dependencies, run: 

```console
npm install
// or 
pnpm install
```

> Second, we must update the dependencies, run: 

```console
npm update
// or
pnpm update
```

> Third, run project in hot reload mode (Without debug, for it go to [Debug instructions](#application-debugger))

```console
npm run dev
// Or 
pnpm run dev
```

or to execute directly,

With NPM
```console
npm run build
npm run start
```

With PNPM
```console
pnpm run build
pnpm run start
```

> Finally, in any web browser go to:

**localhost:3003/api/status**

> And you can use **PostMan** as follow:

Try import this request. So, click to Import > Select Raw text, and paste the next code:

```console
curl --location --request POST 'localhost:3003/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "nodetskeleton@email.com",
    "passwordB64": "Tm9kZVRza2VsZXRvbio4"
}'
```

The passwordB64 is equivalent for "NodeTskeleton*8" in Base64 format.

>> Register a new user
```console
curl --location --request POST 'localhost:3003/api/v1/users/sign-up' \
--header 'Accept-Language: es' \
--header 'Authorization: Bearer jwt' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "Nikola",
    "lastName": "Tesla",
    "gender": "Male",
    "passwordB64": "Tm9kZVRza2VsZXRvbio4",
    "email": "nodetskeleton@conemail.com"
}'
```

**[⬆ go to the future](#table-of-contents)**

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
docker compose up -d --build
```

> Finally, in any internet explorer go to:

**localhost:3003/api/status**

> And you can use PostMan too:

Try import this request. So, click to Import > Select Raw text, and paste the next code:

>> User login
```console
curl --location --request POST 'localhost:3003/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "harvic3@protonmail.com",
    "passwordB64": "Tm9kZVRza2VsZXRvbio4"
}'
```

The passwordB64 is equivalent for "NodeTskeleton" in Base64 format.

>> Register a new user
```console
curl --location --request POST 'localhost:3003/api/v1/users/sign-up' \
--header 'Accept-Language: es' \
--header 'Authorization: Bearer jwt' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "Nikola",
    "lastName": "Tesla",
    "gender": "Male",
    "passwordB64": "Tm9kZVRza2VsZXRvbio4",
    "email": "nodetskeleton@conemail.com"
}'
```
**[⬆ go to the future](#table-of-contents)**


## Run Test

> The end to end tests are implemented for each use case in its respective folder. 

> Ideally, each use case of your application should be supported by its respective test.

> The tests use the **Jest** library and can be run in two ways:

```console
npm t
```

or 

```console
npm run test
```

**[⬆ go to the future](#table-of-contents)**


## Application debugger

If you are using VS Code the easiest way to debug the solution is to follow these instructions:

> The short way is the next:

Press **Ctrl + J** keys and later **click in down arrow** to add other terminal and select **JavaScript Debug Terminal** and later 

```console
$ npm run dev
```

> The complicated way is:

First go to **package.json** file.

Second, into package.json file locate the **debug** command just above the **scripts** section and click on it.

Third, choose the **dev script** when the execution options appear.

So, wait a moment and then you will see something like this on the console.

```console
$ npm run dev

> nodetskeleton@1.0.0 dev
> ts-node-dev --respawn -- src/index.ts

[INFO] XX:XX:XX ts-node-dev ver. 1.1.8 (using ts-node ver. 9.1.1, typescript ver. 4.6.2)
Running in dev mode
Initializing controllers for NodeTskeleton ServiceContext
AuthController was loaded
StatusController was loaded
Server NodeTskeleton running on localhost:3003/api
```

To stop the debug just press **Ctrl C** and close the console that was opened to run the debug script.

This method will allow you to develop and have the solution be attentive to your changes (hot reload) without the need to restart the service, VS Code does it for you automatically.

**[⬆ go to the future](#table-of-contents)**


## Build for production

> To get the code you can use in a productive environment run:

```console
npm run build
```

> The result code will be stored in the **dist** directory.

> You can also add your **scripts** in the **package.json** file and use them with your deployment strategies, even with **docker**.

> To be able to **debug**, the system generates **javascript map files** in the **dist** directory, but this is only for testing purposes. When the **build** command runs, everything inside the **dist** directory is removed and only the **necessary code** is generated.

```console
tsc
```
> With the previous command you can also generate the code of the **dist** directory but this command is configured in the **TS config file** to generate the **map files** needed by the application to perform the **debugging** process.


## Test your Clean Architecture

Something important is to know if we really did the job of building our clean architecture well, and this can be found very easily by following these steps: 

1. Make sure you don't have any pending changes in your application to upload to your repository, otherwise upload them if you do.

2. Identify and remove **adapters** and **infrastructure** **directories** from your solution, as well as the **index.ts** file.

3. Execute the test command **npm t** or **npm run test** and the build command **tsc** or **npm run build** too, and everything should run smoothly, otherwise you violated the principle of dependency inversion or due to bad practice, application layers were coupled that should not be coupled.

4. Run the **git checkout .** command to get everything back to normal.

5. Most importantly, no **domain entity** can make use of an **application service** and less of a **provider service** (repository or provider), the **application services use the entities**, the flow goes from the **most external part** of the application **to the most internal part** of it.

**[⬆ go to the future](#table-of-contents)**


## Coupling

For the purpose of giving clarity to the following statement we will define **coupling** as the action of dependence, that is to say that **X depends on Y to function**.

Coupling is not bad if it is well managed, but in a software solution **there should not be coupling** of the **domain and application layers with any other**, but there can be coupling of the infrastructure layer or the adapters layer with the application and/or domain layer, or coupling of the infrastructure layer with the adapters layer and vice-versa*, but avoid the latter as much as possible*.

The clean architecture is very clear in its rules and dictates that the adapter layer cannot depend on the infrastructure layer, but in practice in certain languages like JavaScript (TypeScript) it is quite complicated to achieve this without the use of Dependency Inversion libraries like TypeDi or another one, and for this NodeTsKeleton includes a TSKernel artifact to help you avoid this problem, however in practice having this type of coupling does not represent a major problem over time and I say this from experience, however I leave this decision to your discretion and if you need an example of what to do then check the following lines of the main index file of the application.

```ts
// src/index
import infraContainer from "./infrastructure/container";
infraContainer.load();
```

**[⬆ go to the future](#table-of-contents)**


## Clustering the App (Node Cluster)

NodeJs solutions run on a single thread, so it is important not to run CPU-intensive tasks, however NodeJs in Cluster Mode can run on several cores, so if you want to get the most out of your solution running on a multi-core machine, this is probably a good option, but if your machine has no more than one core, this will not help.

So, for Cluster de App, replace **src/index.ts** code for the next code example.


### Observation 👀
If you plan to use cluster mode, you must inject the controllers to the **AppWrapper** class instance as shown in the following code sample, otherwise if you are not going to use the cluster mode then you can skip the import of the controllers and let the loading be done dynamically by the **AppWrapper** internal class method.

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
import statusController from "./adapters/controllers/status/Status.controller";
import authController from "./adapters/controllers/auth/Auth.controller";
// End Controllers

const controllers: BaseController[] = [statusController, authController];

function startApp(): void {
  const appWrapper = new AppWrapper(controllers);
  const server = new HttpServer(appWrapper);
  server.start();

  process.on("uncaughtException", (error: NodeJS.UncaughtExceptionListener) => {
    errorHandlerMiddleware.manageNodeException("UncaughtException", error);
  });

  process.on(
    "unhandledRejection",
    (reason: NodeJS.UnhandledRejectionListener, promiseError: Promise<unknown>) => {
      errorHandlerMiddleware.manageNodeException(
        `UnhandledRejection - Reason: ${reason}`,
        promiseError,
      );
    },
  );
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

process.on(
  "unhandledRejection",
  (reason: NodeJS.UnhandledRejectionListener, promiseError: Promise<unknown>) => {
    errorHandlerMiddleware.manageNodeException(
      `UnhandledRejection - Reason: ${reason}`,
      promiseError,
    );
  },
);

// Node App without Cluster mode with controllers load by constructor.
import "express-async-errors";
import AppWrapper from "./infrastructure/app/AppWrapper";
import { HttpServer } from "./infrastructure/app/server/HttpServer";
import errorHandlerMiddleware from "./infrastructure/middleware/error";

// Controllers
import BaseController from "./adapters/controllers/base/Base.controller";
import statusController from "./adapters/controllers/status/Status.controller";
import authController from "./adapters/controllers/auth/Auth.controller";
// End Controllers

const controllers: BaseController[] = [statusController, authController];

const appWrapper = new AppWrapper(controllers);
const server = new HttpServer(appWrapper);
server.start();

process.on("uncaughtException", (error: NodeJS.UncaughtExceptionListener) => {
  errorHandlerMiddleware.manageNodeException("UncaughtException", error);
});

process.on(
  "unhandledRejection",
  (reason: NodeJS.UnhandledRejectionListener, promiseError: Promise<unknown>) => {
    errorHandlerMiddleware.manageNodeException(
      `UnhandledRejection - Reason: ${reason}`,
      promiseError,
    );
  },
);
```
**[⬆ go to the future](#table-of-contents)**


## Strict mode

TypeScript's strict mode is quite useful because it helps you maintain the type safety of your application making the development stage of your solution more controlled and thus avoiding the possible errors that not having this option enabled can bring.

This option is enabled by default in NodeTskeleton and is managed in the **tsconfig.json** file of your solution, but if you are testing and don't want to have headaches you can disable it.

```json
  "strict": true,
```

## Multi service monorepo

With this simple option you can develop a single code base and by means of the configuration file through the **ENVs** (environment variables) decide which service context to put online, so with the execution of different PipeLines.

Note that the system take the **ServiceContext** Server parameter in the **config file** from value of your **.env file** as follows:

```ts
// infrastructure/config/index
const serviceContext = process.env.SERVICE_CONTEXT || ServiceContext.NODE_TS_SKELETON;
...
Controllers: {
  ContextPaths: [
    // Status Controller should always be included, and others by default according to your needs.
    Normalize.pathFromOS(
      Normalize.absolutePath(__dirname, "../../adapters/controllers/status/*.controller.??"), 
    ),
    Normalize.pathFromOS(
      Normalize.absolutePath(
        __dirname,
        `../../adapters/controllers/${serviceContext}/*.controller.??`,
      ),
    ),
  ],
  // If the SERVICE_CONTEXT parameter is not set in the environment variables file, then the application will load by default all controllers that exist in the home directory.
  DefaultPath: [
    Normalize.pathFromOS(
      Normalize.absolutePath(__dirname, "../../adapters/controllers/**/*.controller.??"),
    ),
  ],
  Ignore: [Normalize.pathFromOS("**/base")],
},
Server: {
  ...
  ServiceContext: {
    // This is the flag that tells the application whether or not to load the drivers per service context.
    LoadWithContext: !!process.env.SERVICE_CONTEXT,
    Context: serviceContext,
  },
}
```

Note that by default all solution **Controllers** are set to the **NodeTskeleton context** which is the default value **DefaultPath**, but you are free to create as many contexts as your solution needs and load your **Controllers** on the context that you set in **SERVICE_CONTEXT** env.
The **HealthController** must always words for any context **ContextPaths** or for **NodeTskeleton context**, it cannot change because you need a status check point for each exposed service.

For example, the application have the SECURITY context and you can get it as follow:

```ts
// In your ENV file set context as users, like this:
NODE_ENV=dev
SERVICE_CONTEXT=users
SERVER_ROOT=/api
```

So the path into ContextPaths settings that contains ${serviceContext} constant will have the following value:
`../../adapters/controllers/users/*.controller.??`
Then in the **AppWrapper** class, the system will load the controllers that must be exposed according to the service context.

The **ServiceContext** file is located in the infrastructure server directory: 

```ts
// NodeTskeleton is the only context created, but you can create more o change this.
export enum ServiceContext {
  NODE_TS_SKELETON = "NodeTskeleton",
  SECURITY = "auth",
  USERS = "users",
}
```

### How it working?

So, how can you put the multi-service mode to work?

It is important to note (understand) that the service contexts must be the names of the directories you will have inside the controllers directory, and you can add as many controllers as you need to each context, for example, in this application we have two contexts, users (USERS) and auth (SECURITY).

```ts
adapters
  controllers 
    auth // Context for SECURITY (auth)
      Auth.controller.ts
    users // Context for USERS (users)
      Users.controller.ts
    otherContext // And other service contexts according to your needs
      ...
application
...
```

All the above works for **dynamic loading of controllers**, therefore, if you are going to work the solution in **CLUSTER** mode you must inject the controllers by constructor as indicated in the **cluster mode explanation** and you must assign the context to each controller as shown in the following example: 

```ts
// For example, the application have the SECURITY context and the Authentication Controller responds to this context as well:
class AuthController extends BaseController {
  constructor() {
    super(ServiceContext.SECURITY);
  }
  ...
}
```

So, for this feature the project has a basic **api-gateway** to route an entry point to the different ports exposed by each service (context).

You should note that you need, **Docker** installed on your machine and once you have this ready, then you should do the following:

Before anything else, you need to create a .env file in tsk-gateway root directory

```txt
WITH_DOCKER_HOST=true
PORT=8080
```

> So, first, open your console a go to the root directory of NodeTskeleton project and install packages to create lock json file.
```console
npm install
cd tsk-gateway
npm install
```

> Second, execute the next sequence of commands:

>> Build the **tskeleton image**
```console
docker build . -t tskeleton-image
```

>> Build the **tsk gateway image**
```console
cd tsk-gateway
docker build . -t tsk-gateway-image
```

>> Run docker compose for launch our solution
```console
docker compose up -d --build
```

And latter you can use **Postman** or web browser for use the exposed endpoints of two services based in NodeTskeleton project

> Security service
>> Status
```console
curl --location --request GET 'localhost:8080/security/api/status'
```
>> Login
```console
curl --location --request POST 'localhost:8080/security/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "nodetskeleton@email.com",
    "passwordB64": "Tm9kZVRza2VsZXRvbio4"
}'
```

> Users service
>> Status
```console
curl --location --request GET 'localhost:8080/management/api/status'
```
>> Register a new user
```console
curl --location --request POST 'localhost:8080/management/api/v1/users/sign-up' \
--header 'Accept-Language: es' \
--header 'Authorization: Bearer jwt' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "Nikola",
    "lastName": "Tesla",
    "gender": "Male",
    "passwordB64": "Tm9kZVRza2VsZXRvbio4",
    "email": "nodetskeleton@conemail.com"
}'
```


### Observation
If you are not going to use this functionality you can delete the **tsk-gateway** directory.


## Conclusions

- The clean architecture allows us to develop the **use cases** and the **domain** (business logic) of an application without worrying about the type of database, web server framework, protocols, services, providers, among other things that can be trivial and that the same application during the development will tell us what could be the best choice for the infrastructure and adapters of our application.

- The clean architecture, the hexagonal architecture, the onion architecture and the ports and adapters architecture in the background can be the same, the final purpose is to decouple the **business layer** of our application from the **outside world**, basically it leads us to think about designing our solutions from the **inside to outside** and **not** from the **outside to inside**.

- When we develop with clean architecture we can more **easily change** any **"external dependency"** of our application without major concerns, obviously there are some that will require more effort than others, for example migrating from a NoSql schema to a SQL schema where probably the queries will be affected, however our business logic can remain intact and work for both models.

- The advantages that clean architecture offers us are very significant; it is one of the **best practices for making scalable software** that **works for your business** and **not for your preferred framework**.

- Clean architecture is basically based on the famous and well-known five **SOLID principles** that we had not mentioned until this moment and that we very little internalized.

- If you liked it and you learned or use something from this project, give this project a star, that's the way you can thank me, don't be a damn selfish person who doesn't recognize the effort of others.


### Observation 👀

"The world is selfish" because I am surprised by the number of people who visit this project to use it and browse through all its modules and files, but they don't even leave a star.

**[⬆ go to the future](#table-of-contents)**


## Code of Conduct

The Contributor Covenant Code of Conduct for this project is based on Covenant Contributor which you can find at the following link:

- <a href="https://www.contributor-covenant.org/version/2/0/code_of_conduct/code_of_conduct.md" target="_blank" >Go to Code of Conduct</a>

**[⬆ go to the future](#table-of-contents)**


## Warning

> Use this resource at your own risk.

-**You are welcome to contribute to this project, dare to do so.**

-**If you are interested you can contact me by this means.**

- 📫 <a href="mailto:harvic3@protonmail.com" target="_blank" >Write to him</a>

**[⬆ go to the future](#table-of-contents)**


## Future tasks
- [x] Update documentation about many topics and features of the project.
- [x] Implement other necessary OpenApi data schemes models for service documentation. 
- [x] Implement security schemes for OpenApi documentation.


## Acknowledgments

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/vickodev)
