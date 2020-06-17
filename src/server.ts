// // For KoaJs
// import config from "./config";
// import * as router from "./routes";

// const app = new config.coreModules.Server();
// const bodyParser = config.coreModules.BodyParser;

// app.use(bodyParser());
// app.use(router.routes());
// app.use(router.allowebMethods());

// app.on('error', (err, context) => {
//   if (err.status){
//     console.log('Handled application error', err.message);
//   } else {
//     console.log('Non controlled application error', err);
//   }
// });

// export const start = app.listen(config.server.port, () =>{
//   console.log(`server running on ${config.server.host}:${config.server.port}`);
// });



// For ExpressJs
import config from "./config";
import routes from "./routes";

const app = config.coreModules.Server();

app.use(config.server.root, routes);

app.use(function(err, req, res, next) {
  if (err.status) {
    console.log("Handled application error", err.message);
  } else {
    console.log("Non controlled application error", err);
  }
  res.status(err.status || 500).send(err.message);
});

export const start = app.listen(config.server.port, () =>{
  console.log(`server running on ${config.server.host}:${config.server.port}`);
});

