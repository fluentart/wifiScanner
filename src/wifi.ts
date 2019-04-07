import * as fs from "fs"
import { EventEmitter } from "events";
const { exec } = require('child_process');

export class WIFI extends EventEmitter {
    
    watcher;

    constructor() {
        super();
    }

    watch(ssid, seconds) {
        this.watcher = setInterval( ()=>{
            this.scan( (scan) => {
                var wifi = this.decodeWifiScan(scan);
                console.log(wifi);
                this.emit("data", wifi);
            })
        }, seconds * 1000)
    }

    testFile(filepath) {
        fs.readFile(filepath, (e:Error, d:any)=>{
            var parsed = this.decodeWifiScan(d.toString())
            console.log(parsed);
        })
    }

    scan(cb) {
        exec('iwlist scan', (err, stdout, stderr) => {
            cb(stdout.toString());
        });
    }

    decodeWifiScan(scantextraw) {
        var data = scantextraw.split("\n")
        data = data.map(l => {return l.trim()} )
        var done = false;
        var l = 0;

        var p:any = { cells: [] }

        var c:any = {}

        while (!done) {
            

            if (data[l].indexOf("Scan completed") >= 0) {
                p.interface = data[l].split(" ")[0]; 
            }
            
            if (data[l].indexOf("Cell")>=0) {
                if (JSON.stringify(c) != "{}") { p.cells.push(c); c = {}; }
                c.address = data[l].split("Address: ")[1]
            }

            if (data[l].indexOf("ESSID:")>=0) {
                c.ssid = data[l].split("ESSID:")[1].split("\"").join("")
            }

            if (data[l].indexOf("Signal level=")>=0) {
                c.rssi = parseInt(data[l].split("Signal level=")[1].split(" ")[0])
            }

            l++;
            
            if (l == data.length) { p.cells.push(c); c = {}; done = true;}
        }

        return p;
    }



}