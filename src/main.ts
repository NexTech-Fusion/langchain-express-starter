import 'reflect-metadata';
import { fixModuleAlias } from './utils/fix-module-alias';
fixModuleAlias(__dirname);
import { appConfig } from '@base/config/app';
import { Container } from 'typedi';
import express from 'express';
import { useContainer as routingControllersUseContainer, useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import * as swaggerUiExpress from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { routingControllersToSpec } from "routing-controllers-openapi";
import cors from 'cors';
import { FileStorageService } from "./infrastructure/services/file-storage.service";
import { HistoryService } from "./api/services/history.service";
import { TrainerService } from "./infrastructure/services/trainer.service";

export class App {
  private port: Number = appConfig.port;
  private app: express.Application = express();
  private fileStorageService: FileStorageService;
  private trainService: TrainerService;

  public constructor() {
    this.bootstrap();
  }

  public async bootstrap() {
    this.useContainers();
    this.serveStaticFiles();
    this.setupMiddlewares();
    this.registerRoutingControllers();
    this.setupSwagger();
    this.registerServices();

    this.loadHistory();
    this.trainData();
  }

  public async emergencySaveWorlds(): Promise<void> {
    this.fileStorageService?.saveAll();
  }

  private registerServices() {
    const historyService = Container.get(HistoryService);
    this.fileStorageService = Container.get(FileStorageService);
    this.trainService = Container.get(TrainerService);

    this.fileStorageService.setHistoryService(historyService);
  }

  private loadHistory() {
    this.fileStorageService.loadHistory();
  }

  private trainData() {
    this.trainService.train();
  }

  private useContainers() {
    routingControllersUseContainer(Container);
  }

  private serveStaticFiles() {
    this.app.use('/public', express.static('public'));
  }

  private setupMiddlewares() {
    this.app.use(cors());

    // For file upload
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: '25mb' }));
  }

  private registerRoutingControllers() {
    useExpressServer(this.app, {
      validation: { stopAtFirstError: true },
      classTransformer: true,
      defaultErrorHandler: false,
      routePrefix: appConfig.routePrefix,
      controllers: [__dirname + appConfig.controllersDir]
    });

    const server = require('http').Server(this.app);
    server.listen(this.port, () => console.log(`🚀 Server started at http://localhost:${this.port}\n🚨️ Environment: ${process.env.NODE_ENV}`));
  }

  private setupSwagger() {
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(
      storage,
      { routePrefix: appConfig.routePrefix },
      {
        components: {
          securitySchemes: {
          },
        },
      },
    );
    this.app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
  }
}

const app = new App();


// === Handle process events to save data before exit ===
process.on('beforeExit', async (code) => {
  console.log(`Process will exit with code: ${code}`)
  await app.emergencySaveWorlds();
  console.log('History saved');
  process.exit(0);
})

process.on('uncaughtException', async (err) => {
  console.log('uncaughtException', err);
  await app.emergencySaveWorlds().then(() => {
    console.log('History saved');
    process.exit(0);
  });
})
process.on('SIGINT', async () => {
  console.log('Received SIGINT signal');
  await app.emergencySaveWorlds();
  process.exit(0);
});
