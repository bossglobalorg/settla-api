import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { AppLoggerService } from './modules/system/logger/services/app-logger/app-logger.service'
import { json } from 'body-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
// import hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  /*
    Required to be executed before async storage middleware
    and not loose context on POST requests
   */
  app.use(json())

  app.use(helmet())

  app.enableShutdownHooks()

  // app.use(hbs);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  )

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  const logger = app.get(AppLoggerService)
  app.useLogger(logger)

  // API docs
  const config = new DocumentBuilder()
    .setTitle('Settla API')
    .setDescription(
      `API for Settla, a platform for managing your international remittance.`
    )
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const port = process.env.PORT || 3000

  await app.listen(port, '0.0.0.0')

  logger.log(`App started on http://localhost:${port}`)
}

bootstrap()
