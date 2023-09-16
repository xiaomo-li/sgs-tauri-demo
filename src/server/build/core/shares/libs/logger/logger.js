"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(mode = "dev" /* Dev */) {
        this.mode = mode;
    }
    set Translator(translator) {
        this.translator = translator;
    }
    translate(args) {
        if (this.translator) {
            return args.map(arg => (typeof arg === 'string' ? this.translator.tr(arg) : arg));
        }
        return args;
    }
}
exports.Logger = Logger;
