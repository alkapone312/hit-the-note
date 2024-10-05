import ConsoleLogger from "./ConsoleLogger.js";
import Logger from "./Logger.js";

/**
 * Application facade for logging functionality
 */
class Log {
    private static logger = new ConsoleLogger();

    private static shouldDebug = false;

    private constructor() {
        throw new Error("Log class is not instantiable");
    }

    static error(msg: string): void {
        this.logger.error(msg);
    }

    static warn(msg: string): void {
        this.logger.warn(msg);
    }

    static info(msg: string): void {
        this.logger.info(msg);
    }

    static debug(msg: string): void {
        if(this.shouldDebug) {
            this.logger.debug(msg);
        }
    }

    static setUp(logger: Logger) {
        this.logger = logger;
    }

    static setDebug(debug: boolean): void {
        this.shouldDebug = debug;
    }
}

export default Log;