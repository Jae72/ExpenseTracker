interface LoggerLevels {
    [index: string]: number;
}
interface LoggerInterface {
    debug(level: any[]): void;
    info(level: any[]): void;
    warn(level: any[]): void;
    error(level: any[]): void;
}
export declare const LOG_LEVELS: LoggerLevels;
declare class Logger implements LoggerInterface {
    levelToSet: string;
    level: number;
    constructor(levelToSet?: string);
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
}
export declare const logger: Logger;
export {};
