Scans wifi for useful information.

This was built to monitor and test wifi networks.

Usage:
======

```ts
import { WIFI } from "./wifi"

var w = new WIFI();

w.watch("SOMESSID", 1); // update every 1 second

w.on("data", (data) => { 
    console.log("\n===="+(new Date().toISOString())+"=====");
    console.log(data);
});
```