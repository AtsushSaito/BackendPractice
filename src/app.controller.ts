import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return `
    <h1>Thread Board API</h1>
    <p>API documentation is available at <a href="/api">/api</a> (Swagger UI)</p>
    <p>To access Swagger UI, go to <a href="/api">localhost:3000/api</a></p>
    `;
  }
}
