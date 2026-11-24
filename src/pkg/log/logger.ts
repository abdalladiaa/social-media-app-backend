class Logger {
  private static instance: Logger;
  constructor() {
    if (!Logger.instance) {
      Logger.instance = this;
    }
    return Logger.instance;
  }

  log(level: string, message: string, metaData = {}) {
    let messageObj = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...metaData,
    };
    console.log(JSON.stringify(messageObj));
  }
  error(message: string, metaData = {}) {
    this.log("error", message, metaData);
  }
  debug(message: string, metaData = {}) {
    this.log("debug", message, metaData);
  }
  info(message: string, metaData = {}) {
    this.log("info", message, metaData);
  }
}

export const logger = new Logger();
