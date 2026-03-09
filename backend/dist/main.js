"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const corsOrigins = process.env.CORS_ORIGIN;
    const origins = corsOrigins
        ? corsOrigins.split(',').map((origin) => origin.trim()).filter(Boolean)
        : true;
    app.enableCors({ origin: origins });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const server = await app.listen(process.env.PORT ?? 3000);
    server.setTimeout(30000);
    logger.log(`Application running on port ${process.env.PORT ?? 3000}`);
}
bootstrap().catch((err) => {
    console.error('Failed to start application:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map