"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerLogger = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const logger_1 = require("./logger");
class ServerLogger extends logger_1.Logger {
    constructor() {
        super(...arguments);
        this.logFileDir = './backlog.txt';
    }
    translate(args) {
        if (this.translator) {
            return args.map(arg => (typeof arg === 'string' ? this.translator.tr(arg) : arg));
        }
        return args;
    }
    info(...args) {
        // tslint:disable-next-line: no-console
        console.info(chalk_1.default.blueBright(...this.translate(args)));
    }
    error(...args) {
        // tslint:disable-next-line: no-console
        console.error(chalk_1.default.redBright(...this.translate(args)));
        if (this.mode === "prod" /* Prod */ && typeof window === 'undefined') {
            if (this.fileStreamLoader === undefined) {
                this.fileStreamLoader = Promise.resolve().then(() => tslib_1.__importStar(require('fs')));
            }
            this.fileStreamLoader.then(fs => {
                if (!fs.existsSync(this.logFileDir)) {
                    fs.writeFileSync(this.logFileDir, `[${new Date().toISOString()}]: ${JSON.stringify(args)}\n`);
                }
                else {
                    fs.appendFileSync(this.logFileDir, `[${new Date().toISOString()}]: ${JSON.stringify(args)}\n`);
                }
            });
        }
    }
    debug(...args) {
        if (this.mode !== "prod" /* Prod */) {
            // tslint:disable-next-line: no-console
            console.log(chalk_1.default.green(...this.translate(args)));
        }
    }
    async dump() {
        process.stdin.setRawMode && process.stdin.setRawMode(true);
        return new Promise(resolve => {
            process.stdin.resume();
            process.stdin.once('data', data => {
                process.stdin.setRawMode && process.stdin.setRawMode(false);
                const command = data.toString().trim();
                if (command === 'c') {
                    process.exit();
                }
                else if (command === 'g') {
                    process.stdin.pause();
                }
                resolve();
            });
        });
    }
}
exports.ServerLogger = ServerLogger;
