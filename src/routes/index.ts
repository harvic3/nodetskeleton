// // For KoaJs
// import config from "../config";
// const apiRoot = config.server.root;

// // Region controllers
// import * as HwController from "../controllers/hwController";
// // End controllers

// const router = new config.coreModules.Router();

// // Region routes
// router.get(`${apiRoot}/ping`, HwController.pong);
// router.get(`${apiRoot}/hello`, HwController.hello);
// router.post(`${apiRoot}/echo`, HwController.echo);
// router.post(`${apiRoot}/sum/two/numbers`, HwController.sumTwoNumbers);
// router.post(`${apiRoot}/sum/array/numbers`, HwController.sumArrayNumbers);
// // End routes

// export function routes() {
//   return router.routes();
// }

// export function allowebMethods() {
//   return router.allowedMethods();
// }



// For ExpressJs
import config from "../config";
const bodyParser = config.coreModules.BodyParser;

// Region controllers
import * as HwController from "../controllers/hwController";
// End controllers

const jsonParser = bodyParser.json();

const router = config.coreModules.Router();

// Region routes
router.get('/ping', HwController.pong);
router.get('/hello', HwController.hello);
router.post('/echo', jsonParser, HwController.echo);
router.post('/sum/two/numbers', jsonParser, HwController.sumTwoNumbers);
router.post('/sum/array/numbers', jsonParser, HwController.sumArrayNumbers);
// End routes

export default router;