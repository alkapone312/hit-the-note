import type Logger from '@/utils/Logger';

/**
 * Logger that outputs information to console.
 */
class ConsoleLogger implements Logger {
    public error(msg: string): void {
        console.error(msg);
    }

    public warn(msg: string): void {
        console.warn(msg);
    }

    public info(msg: string): void {
        console.info(msg);
    }
    
    public debug(msg: string): void {
        console.debug(msg);
    }
}

export default ConsoleLogger;