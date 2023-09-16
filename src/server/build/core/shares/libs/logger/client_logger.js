"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientLogger = void 0;
const logger_1 = require("./logger");
class ClientLogger extends logger_1.Logger {
    constructor(flavor = "prod" /* Prod */) {
        super();
        this.flavor = flavor;
    }
    info(...args) {
        // tslint:disable-next-line: no-console
        console.info(...args);
    }
    error(...args) {
        // tslint:disable-next-line: no-console
        console.error(...args);
    }
    debug(...args) {
        if (this.flavor !== "prod" /* Prod */) {
            // tslint:disable-next-line: no-console
            console.log(...args);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async dump() { }
}
exports.ClientLogger = ClientLogger;
