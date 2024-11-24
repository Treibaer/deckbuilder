import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./utils/all-exceptions.filter";
import { LoggingInterceptor } from "./utils/logger.interceptor";
import { SocketIoAdapter } from "./utils/ws-adapter";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn"],
  });
  app.enableCors();
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new LoggingInterceptor());
  const port = process.env.PORT || 3000;
  console.log(`Listening on port ${port}`);

  const configService = app.get(ConfigService);
  app.useWebSocketAdapter(new SocketIoAdapter(configService));

  await app.listen(port);
}
bootstrap();
