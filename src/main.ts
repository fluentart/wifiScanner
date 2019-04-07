import { WIFI } from "./wifi"

var w = new WIFI();

w.watch("SOMESSID", 1);

w.on("data", (data) => { 
    console.log("\n===="+(new Date().toISOString())+"=====");
    console.log(data);
});