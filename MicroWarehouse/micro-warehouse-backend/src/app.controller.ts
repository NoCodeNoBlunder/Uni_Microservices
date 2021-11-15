/**
 * The app.controller.ts is the place where the browser will send its request to and it will
 * respond with the appropriate answer, binding the URL request to an operation
 */

import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';
import Command from './modules/builder/command';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Binds this operation to the URL requested in @Get
   * key is a placeholder for a path that comes after query.
   */
  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    // async allows the browser to function normally why we wait for the request.
    return this.appService.getQuery(key); // Returns the Promise object which will be populated as soon as the result is computed.
  }

  @Post('cmd')
  async postCommand(@Body() command: Command) {
    try {
      console.log(`got command ${JSON.stringify(command, null, 3)}`);
      const c = await this.appService.handleCommand(command);
      return c;
    } catch (error) {
      return error;
    }
  }

  /**
   * This operation is mapped to the path localhost:3000
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
