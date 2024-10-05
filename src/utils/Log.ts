import ConsoleLogger from "./ConsoleLogger.js";
import Logger from "./Logger.js";

/**
 * Application facade for logging functionality
 */
class Log {
    private static logger = new ConsoleLogger();

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
        this.logger.debug(msg);
    }

    static setUp(logger: Logger) {
        this.logger = logger;
    }
}

export default Log;