import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  public logger: Console;

  constructor() {
    this.logger = console;
  }

  log(message: string) {
    this.logger.log(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string) {
    this.logger.error(message);
  }
}
