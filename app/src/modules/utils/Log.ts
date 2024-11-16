import ConsoleLogger from '@/utils/ConsoleLogger.js';
import type Logger from '@/utils/Logger.js';

/**
 * Application facade for logging functionality
 */
class Log {
    private static logger = new ConsoleLogger();

    private static shouldDebug = false;

    private constructor() {
        throw new Error('Log class is not instantiable');
    }

    public static error(msg: string): void {
        this.logger.error(msg);
    }

    public static warn(msg: string): void {
        this.logger.warn(msg);
    }

    public static info(msg: string): void {
        this.logger.info(msg);
    }

    public static debug(msg: string): void {
        if (this.shouldDebug) {
            this.logger.debug(msg);
        }
    }

    public static setUp(logger: Logger): void {
        this.logger = logger;
    }

    public static setDebug(debug: boolean): void {
        this.shouldDebug = debug;
    }
}

export default Log;