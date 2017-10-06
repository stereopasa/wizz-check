import { EventEmitter } from "events";
import { MongoService } from "./services";
import { WizzCheck } from "./check/wizz";
import * as dotenv from "dotenv";

dotenv.load();

console.log("*** STARTING ***");
console.log(new Date().toLocaleString());

new WizzCheck().check()
  .then(() => {
    console.log("*** END ***")
    console.log(new Date().toLocaleString());
  });

// listen for TERM signal .e.g. kill
process.on("SIGTERM", gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on("SIGINT", gracefulShutdown);

function gracefulShutdown() {
  console.log("*** SHUTTING DOWN ***");
  MongoService.shutdown();
}