import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function registerOpenApi(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('backend demo api doc')
        .setDescription('backend demo api doc')
        .setVersion('1.0')
        .build()

    const document = SwaggerModule.createDocument(app, config)

    SwaggerModule.setup('api-doc', app, document)
}
