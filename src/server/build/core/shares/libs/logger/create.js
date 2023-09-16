"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const client_logger_1 = require("./client_logger");
const server_logger_1 = require("./server_logger");
const createLogger = (flavor) => {
    if (typeof window !== 'undefined') {
        return new client_logger_1.ClientLogger(flavor);
    }
    else {
        return new server_logger_1.ServerLogger(flavor);
    }
};
exports.createLogger = createLogger;
