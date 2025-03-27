"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LOG_LEVELS = void 0;
exports.LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};
class Logger {
    constructor(levelToSet = "warn") {
        this.levelToSet = levelToSet;
        if (!(levelToSet in exports.LOG_LEVELS)) {
            this.level = exports.LOG_LEVELS["debug"];
        }
        this.level = exports.LOG_LEVELS[levelToSet];
    }
    debug(...args) {
        if (this.level <= exports.LOG_LEVELS["debug"])
            console.debug(args);
    }
    info(...args) {
        if (this.level <= exports.LOG_LEVELS["info"])
            console.info(args);
    }
    warn(...args) {
        if (this.level <= exports.LOG_LEVELS["warn"])
            console.warn(args);
    }
    error(...args) {
        if (this.level <= exports.LOG_LEVELS["error"])
            console.error(args);
    }
}
exports.logger = new Logger();
