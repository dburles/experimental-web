import Koa from "koa";
import serve from "koa-static";
import createModulePreloadMiddleware from "modulepreload-koa/createModulePreloadMiddleware.mjs";
import spaMiddleware from "./lib/spaMiddleware.js";
import * as config from "../config.js";

const app = new Koa();

app.use(createModulePreloadMiddleware(config.APP_ROOT));
app.use(serve(config.APP_ROOT));
app.use(serve("./node_modules"));
app.use(spaMiddleware);

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});
