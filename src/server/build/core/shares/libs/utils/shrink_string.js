"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompress = exports.compress = void 0;
const buffer_1 = require("buffer");
const util_1 = require("util");
const zlib_1 = require("zlib");
const gz = util_1.promisify(zlib_1.gzip);
const ugz = util_1.promisify(zlib_1.gunzip);
const compress = async (s = '') => {
    const compressed = await gz(s);
    return buffer_1.Buffer.from(compressed).toString('base64');
};
exports.compress = compress;
const decompress = async (s = '') => {
    const decompressed = await ugz(buffer_1.Buffer.from(buffer_1.Buffer.from(s, 'base64')));
    return decompressed.toString();
};
exports.decompress = decompress;
