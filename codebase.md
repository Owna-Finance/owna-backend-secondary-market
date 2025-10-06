# .gitignore

```
# compiled output
/dist
/node_modules
/build

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# temp directory
.temp
.tmp

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

/generated/prisma

```

# .prettierrc

```
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

# eslint.config.mjs

```mjs
// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn'
    },
  },
);
```

# nest-cli.json

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}

```

# package.json

```json
{
  "name": "owna-backend-secondary-market",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/core": "^11.0.1",
    "@nestjs/mapped-types": "*",
    "@nestjs/platform-express": "^11.0.1",
    "@prisma/client": "6.16.3",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "viem": "^2.37.12"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.18.0",
    "@nestjs/cli": "^11.0.0",
    "@nestjs/config": "^4.0.2",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.1",
    "@types/express": "^5.0.0",
    "@types/jest": "^30.0.0",
    "@types/node": "^22.10.7",
    "@types/supertest": "^6.0.2",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.2",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-prettier": "^5.2.2",
    "globals": "^16.0.0",
    "jest": "^30.0.0",
    "prettier": "^3.4.2",
    "prisma": "^6.16.3",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.20.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "moduleNameMapper": {
      "^src/(.*)$": "<rootDir>/$1"
    }
  }
}

```

# pnpm-workspace.yaml

```yaml
onlyBuiltDependencies:
  - '@nestjs/core'
  - '@prisma/engines'
  - prisma

```

# prisma\migrations\20251004105147_00001_init\migration.sql

```sql
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_SIGNATURE', 'ACTIVE', 'FILLED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_SIGNATURE',
    "maker" VARCHAR(255) NOT NULL,
    "makerToken" VARCHAR(255) NOT NULL,
    "makerTokenDecimals" INTEGER NOT NULL,
    "makerAmount" DECIMAL(78,0) NOT NULL,
    "taker" VARCHAR(255),
    "takerToken" VARCHAR(255) NOT NULL,
    "takerTokenDecimals" INTEGER NOT NULL,
    "takerAmount" DECIMAL(78,0) NOT NULL,
    "salt" VARCHAR(255) NOT NULL,
    "tx_hash" VARCHAR(255),
    "signature" VARCHAR(255) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_salt_key" ON "Order"("salt");

```

# prisma\migrations\20251004123032_00002_add_date_in_orders\migration.sql

```sql
/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Order";

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_SIGNATURE',
    "maker" VARCHAR(255) NOT NULL,
    "makerToken" VARCHAR(255) NOT NULL,
    "makerTokenDecimals" INTEGER NOT NULL,
    "makerAmount" DECIMAL(78,0) NOT NULL,
    "taker" VARCHAR(255),
    "takerToken" VARCHAR(255) NOT NULL,
    "takerTokenDecimals" INTEGER NOT NULL,
    "takerAmount" DECIMAL(78,0) NOT NULL,
    "salt" VARCHAR(255) NOT NULL,
    "tx_hash" VARCHAR(255),
    "signature" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Orders_salt_key" ON "Orders"("salt");

```

# prisma\migrations\20251004133707_00003_make_signature_nullable_in_orders\migration.sql

```sql
-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "signature" DROP NOT NULL;

```

# prisma\migrations\migration_lock.toml

```toml
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"

```

# prisma\schema.prisma

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  // output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum OrderStatus {
  PENDING_SIGNATURE
  ACTIVE
  FILLED
  CANCELLED
}

model Orders {
  id                 Int         @id @default(autoincrement())
  status             OrderStatus @default(PENDING_SIGNATURE)
  maker              String      @db.VarChar(255)
  makerToken         String      @db.VarChar(255)
  makerTokenDecimals Int
  makerAmount        Decimal     @db.Decimal(78, 0)
  taker              String?     @db.VarChar(255)
  takerToken         String      @db.VarChar(255)
  takerTokenDecimals Int
  takerAmount        Decimal     @db.Decimal(78, 0)
  salt               String      @unique @db.VarChar(255)
  tx_hash            String?     @db.VarChar(255)
  signature          String?     @db.VarChar(255)
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @default(now())
}

```

# README.md

```md
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

\`\`\`bash
$ pnpm install
\`\`\`

## Compile and run the project

\`\`\`bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
\`\`\`

## Run tests

\`\`\`bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
\`\`\`

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

\`\`\`bash
$ pnpm install -g @nestjs/mau
$ mau deploy
\`\`\`

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```

# src\app.controller.spec.ts

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

```

# src\app.controller.ts

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

```

# src\app.module.ts

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [ConfigModule.forRoot(), OrdersModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

# src\app.service.ts

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

```

# src\main.ts

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

```

# src\orders\dto\create-order.dto.ts

```ts
import { IsString, IsNotEmpty, Matches, IsNumberString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'maker must be a valid Ethereum address',
  })
  maker: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'makerToken must be a valid Ethereum address',
  })
  makerToken: string;

  @IsNumberString()
  @IsNotEmpty()
  makerAmount: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'takerToken must be a valid Ethereum address',
  })
  takerToken: string;

  @IsNumberString()
  @IsNotEmpty()
  takerAmount: string;
}

```

# src\orders\dto\paginated-orders-response.dto.ts

```ts
import { IsArray, IsInt, IsPositive, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationMetaDto {
  @IsInt()
  @Min(0)
  total: number;

  @IsInt()
  @IsPositive()
  page: number;

  @IsInt()
  @IsPositive()
  limit: number;

  @IsInt()
  @Min(0)
  totalPages: number;
}

export class PaginatedOrdersResponseDto {
  @IsArray()
  data: any[];

  @ValidateNested()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}

```

# src\orders\dto\pagination-query.dto.ts

```ts
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

```

# src\orders\dto\signed-typed-data-response.dto.ts

```ts
import { UnsignedTypedDataDto } from './unsigned-typed-data.dto';
import { IsString, IsNotEmpty, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SignedTypedDataResponseDto {
  @ValidateNested()
  @Type(() => UnsignedTypedDataDto)
  typedData: UnsignedTypedDataDto;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{130}$/, {
    message: 'signature must be a valid Ethereum signature',
  })
  signature: string;
}

```

# src\orders\dto\unsigned-typed-data.dto.ts

```ts
import type { Address, TypedDataDomain } from 'viem';
import {
  IsString,
  IsNotEmpty,
  Matches,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderMessageDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'maker must be a valid Ethereum address',
  })
  maker: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'makerToken must be a valid Ethereum address',
  })
  makerToken: string;

  @IsString()
  @IsNotEmpty()
  makerAmount: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'takerToken must be a valid Ethereum address',
  })
  takerToken: string;

  @IsString()
  @IsNotEmpty()
  takerAmount: string;

  @IsString()
  @IsNotEmpty()
  salt: string;

  [key: string]: unknown;
}

export class UnsignedTypedDataDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'account must be a valid Ethereum address',
  })
  account: Address;

  @IsObject()
  @IsNotEmpty()
  domain: TypedDataDomain;

  @IsObject()
  @IsNotEmpty()
  types: {
    Order: readonly [
      { name: 'maker'; type: 'address' },
      { name: 'makerToken'; type: 'address' },
      { name: 'makerAmount'; type: 'uint256' },
      { name: 'takerToken'; type: 'address' },
      { name: 'takerAmount'; type: 'uint256' },
      { name: 'salt'; type: 'string' },
    ];
  };

  @IsString()
  @IsNotEmpty()
  primaryType: 'Order';

  @ValidateNested()
  @Type(() => OrderMessageDto)
  message: OrderMessageDto;
}

```

# src\orders\orders.controller.ts

```ts
import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UnsignedTypedDataDto } from './dto/unsigned-typed-data.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedOrdersResponseDto } from './dto/paginated-orders-response.dto';
import { SignedTypedDataResponseDto } from './dto/signed-typed-data-response.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('')
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<UnsignedTypedDataDto> {
    return await this.ordersService.create(createOrderDto);
  }

  @Post('verify')
  async verifySignedOrder(
    @Body() order: UnsignedTypedDataDto,
    @Body() signature: string,
  ) {
    return await this.ordersService.verifySignedOrder(order, signature);
  }

  @Get()
  async getOrders(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedOrdersResponseDto> {
    return await this.ordersService.getOrders(paginationQuery);
  }

  @Get(':orderId/execute')
  async executeOrder(
    @Param('orderId') orderId: string,
  ): Promise<SignedTypedDataResponseDto> {
    return await this.ordersService.executeOrder(+orderId);
  }
}

```

# src\orders\orders.module.ts

```ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [SharedModule, ConfigModule],
})
export class OrdersModule {}

```

# src\orders\orders.service.spec.ts

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/shared/prisma.service';
import { BlockchainService } from 'src/shared/blockhain.service';
import { StringUtilService } from 'src/shared/string-util.service';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from './dto/create-order.dto';
import { baseSepolia } from 'viem/chains';
import { UnsignedTypedDataDto } from './dto/unsigned-typed-data.dto';
import { OrderStatus } from '@prisma/client';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;
  let blockchainService: BlockchainService;
  let stringUtilService: StringUtilService;
  let configService: ConfigService;

  const mockPrismaService = {
    orders: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockBlockchainService = {
    getDecimalsERC20: jest.fn(),
    getPublicClient: jest.fn(),
  };

  const mockStringUtilService = {
    generateSalt: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: BlockchainService,
          useValue: mockBlockchainService,
        },
        {
          provide: StringUtilService,
          useValue: mockStringUtilService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
    blockchainService = module.get<BlockchainService>(BlockchainService);
    stringUtilService = module.get<StringUtilService>(StringUtilService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockCreateOrderDto: CreateOrderDto = {
      maker: '0x1234567890123456789012345678901234567890',
      makerToken: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      makerAmount: '1000000000000000000',
      takerToken: '0x9876543210987654321098765432109876543210',
      takerAmount: '2000000000000000000',
    };

    const mockSalt = 'mock-salt-123456';
    const mockMakerTokenDecimals = 18;
    const mockTakerTokenDecimals = 6;
    const mockContractAddress = '0xcontract1234567890123456789012345678901234';

    const mockCreatedOrder = {
      id: 1,
      maker: mockCreateOrderDto.maker,
      makerToken: mockCreateOrderDto.makerToken,
      makerAmount: BigInt(mockCreateOrderDto.makerAmount),
      takerToken: mockCreateOrderDto.takerToken,
      takerAmount: BigInt(mockCreateOrderDto.takerAmount),
      salt: mockSalt,
      makerTokenDecimals: mockMakerTokenDecimals,
      takerTokenDecimals: mockTakerTokenDecimals,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      mockBlockchainService.getDecimalsERC20.mockResolvedValueOnce(
        mockMakerTokenDecimals,
      );
      mockBlockchainService.getDecimalsERC20.mockResolvedValueOnce(
        mockTakerTokenDecimals,
      );
      mockStringUtilService.generateSalt.mockReturnValue(mockSalt);
      mockConfigService.getOrThrow.mockReturnValue(mockContractAddress);
      mockPrismaService.orders.create.mockResolvedValue(mockCreatedOrder);
    });

    it('should create an order and return unsigned typed data', async () => {
      const result = await service.create(mockCreateOrderDto);

      expect(result).toEqual({
        account: mockCreateOrderDto.maker,
        domain: {
          name: 'Owna',
          version: '1',
          chainId: baseSepolia.id,
          verifyingContract: mockContractAddress,
        },
        types: {
          Order: [
            { name: 'maker', type: 'address' },
            { name: 'makerToken', type: 'address' },
            { name: 'makerAmount', type: 'uint256' },
            { name: 'takerToken', type: 'address' },
            { name: 'takerAmount', type: 'uint256' },
            { name: 'salt', type: 'string' },
          ],
        },
        primaryType: 'Order',
        message: {
          maker: mockCreatedOrder.maker,
          makerToken: mockCreatedOrder.makerToken,
          makerAmount: mockCreatedOrder.makerAmount.toString(),
          takerToken: mockCreatedOrder.takerToken,
          takerAmount: mockCreatedOrder.takerAmount.toString(),
          salt: mockCreatedOrder.salt,
        },
      });
    });

    it('should fetch decimals for both maker and taker tokens', async () => {
      await service.create(mockCreateOrderDto);

      expect(blockchainService.getDecimalsERC20).toHaveBeenCalledTimes(2);
      expect(blockchainService.getDecimalsERC20).toHaveBeenCalledWith(
        mockCreateOrderDto.makerToken,
      );
      expect(blockchainService.getDecimalsERC20).toHaveBeenCalledWith(
        mockCreateOrderDto.takerToken,
      );
    });

    it('should generate a salt for the order', async () => {
      await service.create(mockCreateOrderDto);

      expect(stringUtilService.generateSalt).toHaveBeenCalledTimes(1);
    });

    it('should save the order to the database with correct data', async () => {
      await service.create(mockCreateOrderDto);

      expect(prismaService.orders.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateOrderDto,
          makerTokenDecimals: mockMakerTokenDecimals,
          takerTokenDecimals: mockTakerTokenDecimals,
          salt: mockSalt,
        },
      });
    });

    it('should retrieve the contract address from config', async () => {
      await service.create(mockCreateOrderDto);

      expect(configService.getOrThrow).toHaveBeenCalledWith(
        'SECONDARY_MARKET_CONTRACT_ADDRESS',
      );
    });

    it('should handle errors when fetching token decimals fails', async () => {
      const error = new Error('Failed to fetch decimals');
      mockBlockchainService.getDecimalsERC20.mockReset();
      mockBlockchainService.getDecimalsERC20.mockRejectedValue(error);

      await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
        'Failed to fetch token decimals: Failed to fetch decimals',
      );
    });

    it('should handle errors when database creation fails', async () => {
      // Reset blockchain mock to succeed, so database error can be triggered
      mockBlockchainService.getDecimalsERC20.mockReset();
      mockBlockchainService.getDecimalsERC20.mockResolvedValueOnce(
        mockMakerTokenDecimals,
      );
      mockBlockchainService.getDecimalsERC20.mockResolvedValueOnce(
        mockTakerTokenDecimals,
      );

      const error = new Error('Database error');
      mockPrismaService.orders.create.mockRejectedValue(error);

      await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
        'Failed to create order: Database error',
      );
    });
  });

  describe('verifySignedOrder', () => {
    const mockUnsignedTypedData: UnsignedTypedDataDto = {
      account: '0x1234567890123456789012345678901234567890',
      domain: {
        name: 'Owna',
        version: '1',
        chainId: baseSepolia.id,
        verifyingContract: '0xcontract1234567890123456789012345678901234',
      },
      types: {
        Order: [
          { name: 'maker', type: 'address' },
          { name: 'makerToken', type: 'address' },
          { name: 'makerAmount', type: 'uint256' },
          { name: 'takerToken', type: 'address' },
          { name: 'takerAmount', type: 'uint256' },
          { name: 'salt', type: 'string' },
        ] as const,
      },
      primaryType: 'Order' as const,
      message: {
        maker: '0x1234567890123456789012345678901234567890',
        makerToken: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        makerAmount: '1000000000000000000',
        takerToken: '0x9876543210987654321098765432109876543210',
        takerAmount: '2000000000000000000',
        salt: 'test-salt-123456',
      },
    };

    const mockSignature =
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12';

    const mockUpdatedOrder = {
      id: 1,
      status: OrderStatus.ACTIVE,
      maker: mockUnsignedTypedData.message.maker,
      makerToken: mockUnsignedTypedData.message.makerToken,
      makerAmount: BigInt(mockUnsignedTypedData.message.makerAmount),
      takerToken: mockUnsignedTypedData.message.takerToken,
      takerAmount: BigInt(mockUnsignedTypedData.message.takerAmount),
      salt: mockUnsignedTypedData.message.salt,
      signature: mockSignature,
      makerTokenDecimals: 18,
      takerTokenDecimals: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should verify signature successfully and return true', async () => {
      const mockPublicClient = {
        verifyTypedData: jest.fn().mockResolvedValue(true),
      };

      mockBlockchainService.getPublicClient.mockReturnValue(mockPublicClient);
      mockPrismaService.orders.findUnique.mockResolvedValue({
        ...mockUpdatedOrder,
        status: OrderStatus.PENDING_SIGNATURE,
      });
      mockPrismaService.orders.update.mockResolvedValue(mockUpdatedOrder);

      const result = await service.verifySignedOrder(
        mockUnsignedTypedData,
        mockSignature,
      );

      expect(result).toBe(true);
    });

    it('should throw BadRequestException when signature is invalid', async () => {
      const mockPublicClient = {
        verifyTypedData: jest.fn().mockResolvedValue(false),
      };

      mockBlockchainService.getPublicClient.mockReturnValue(mockPublicClient);
      mockPrismaService.orders.findUnique.mockResolvedValue({
        ...mockUpdatedOrder,
        status: OrderStatus.PENDING_SIGNATURE,
      });

      await expect(
        service.verifySignedOrder(mockUnsignedTypedData, mockSignature),
      ).rejects.toThrow(new BadRequestException('Invalid signature'));
    });

    it('should call verifyTypedData with correct parameters', async () => {
      const mockPublicClient = {
        verifyTypedData: jest.fn().mockResolvedValue(true),
      };

      mockBlockchainService.getPublicClient.mockReturnValue(mockPublicClient);
      mockPrismaService.orders.findUnique.mockResolvedValue({
        ...mockUpdatedOrder,
        status: OrderStatus.PENDING_SIGNATURE,
      });
      mockPrismaService.orders.update.mockResolvedValue(mockUpdatedOrder);

      await service.verifySignedOrder(mockUnsignedTypedData, mockSignature);

      expect(mockPublicClient.verifyTypedData).toHaveBeenCalledTimes(1);
      expect(mockPublicClient.verifyTypedData).toHaveBeenCalledWith({
        address: mockUnsignedTypedData.account,
        domain: mockUnsignedTypedData.domain,
        types: mockUnsignedTypedData.types,
        primaryType: mockUnsignedTypedData.primaryType,
        message: mockUnsignedTypedData.message,
        signature: mockSignature,
      });
    });

    it('should update order status to ACTIVE and save signature', async () => {
      const mockPublicClient = {
        verifyTypedData: jest.fn().mockResolvedValue(true),
      };

      mockBlockchainService.getPublicClient.mockReturnValue(mockPublicClient);
      mockPrismaService.orders.findUnique.mockResolvedValue({
        ...mockUpdatedOrder,
        status: OrderStatus.PENDING_SIGNATURE,
      });
      mockPrismaService.orders.update.mockResolvedValue(mockUpdatedOrder);

      await service.verifySignedOrder(mockUnsignedTypedData, mockSignature);

      expect(mockPrismaService.orders.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.orders.update).toHaveBeenCalledWith({
        where: {
          salt: mockUnsignedTypedData.message.salt,
        },
        data: {
          status: OrderStatus.ACTIVE,
          signature: mockSignature,
        },
      });
    });

    it('should call getPublicClient from blockchain service', async () => {
      const mockPublicClient = {
        verifyTypedData: jest.fn().mockResolvedValue(true),
      };

      mockBlockchainService.getPublicClient.mockReturnValue(mockPublicClient);
      mockPrismaService.orders.findUnique.mockResolvedValue({
        ...mockUpdatedOrder,
        status: OrderStatus.PENDING_SIGNATURE,
      });
      mockPrismaService.orders.update.mockResolvedValue(mockUpdatedOrder);

      await service.verifySignedOrder(mockUnsignedTypedData, mockSignature);

      expect(mockBlockchainService.getPublicClient).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when blockchain verification fails', async () => {
      const error = new Error('Blockchain verification failed');
      const mockPublicClient = {
        verifyTypedData: jest.fn().mockRejectedValue(error),
      };

      mockBlockchainService.getPublicClient.mockReturnValue(mockPublicClient);
      mockPrismaService.orders.findUnique.mockResolvedValue({
        ...mockUpdatedOrder,
        status: OrderStatus.PENDING_SIGNATURE,
      });

      await expect(
        service.verifySignedOrder(mockUnsignedTypedData, mockSignature),
      ).rejects.toThrow(InternalServerErrorException);
      await expect(
        service.verifySignedOrder(mockUnsignedTypedData, mockSignature),
      ).rejects.toThrow('Failed to verify signature: Blockchain verification failed');
    });

    it('should handle errors when database update fails', async () => {
      const mockPublicClient = {
        verifyTypedData: jest.fn().mockResolvedValue(true),
      };

      mockBlockchainService.getPublicClient.mockReturnValue(mockPublicClient);
      mockPrismaService.orders.findUnique.mockResolvedValue({
        ...mockUpdatedOrder,
        status: OrderStatus.PENDING_SIGNATURE,
      });

      const error = new Error('Database update failed');
      mockPrismaService.orders.update.mockRejectedValue(error);

      await expect(
        service.verifySignedOrder(mockUnsignedTypedData, mockSignature),
      ).rejects.toThrow(InternalServerErrorException);
      await expect(
        service.verifySignedOrder(mockUnsignedTypedData, mockSignature),
      ).rejects.toThrow('Failed to update order: Database update failed');
    });

    it('should throw NotFoundException when order with salt does not exist', async () => {
      mockPrismaService.orders.findUnique.mockResolvedValue(null);

      await expect(
        service.verifySignedOrder(mockUnsignedTypedData, mockSignature),
      ).rejects.toThrow(new NotFoundException('Order not found'));
    });

    it('should throw BadRequestException when signature format is invalid', async () => {
      const invalidSignature = '0xinvalid';

      await expect(
        service.verifySignedOrder(mockUnsignedTypedData, invalidSignature),
      ).rejects.toThrow(new BadRequestException('Invalid signature format'));
    });

    it('should throw BadRequestException when order is not in PENDING_SIGNATURE status', async () => {
      mockPrismaService.orders.findUnique.mockResolvedValue({
        ...mockUpdatedOrder,
        status: OrderStatus.ACTIVE,
      });

      await expect(
        service.verifySignedOrder(mockUnsignedTypedData, mockSignature),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('executeOrder', () => {
    const mockOrderId = 1;
    const mockContractAddress = '0xcontract1234567890123456789012345678901234';
    const mockSignature =
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12';

    const mockActiveOrder = {
      id: mockOrderId,
      maker: '0x1234567890123456789012345678901234567890',
      makerToken: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      makerAmount: BigInt('1000000000000000000'),
      takerToken: '0x9876543210987654321098765432109876543210',
      takerAmount: BigInt('2000000000000000000'),
      salt: 'test-salt-123456',
      signature: mockSignature,
      status: OrderStatus.ACTIVE,
      makerTokenDecimals: 18,
      takerTokenDecimals: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      mockConfigService.getOrThrow.mockReturnValue(mockContractAddress);
    });

    it('should execute order successfully and return signed typed data', async () => {
      mockPrismaService.orders.findUnique.mockResolvedValue(mockActiveOrder);

      const result = await service.executeOrder(mockOrderId);

      expect(result).toEqual({
        signature: mockSignature,
        typedData: {
          account: mockActiveOrder.maker,
          domain: {
            name: 'Owna',
            version: '1',
            chainId: baseSepolia.id,
            verifyingContract: mockContractAddress,
          },
          types: {
            Order: [
              { name: 'maker', type: 'address' },
              { name: 'makerToken', type: 'address' },
              { name: 'makerAmount', type: 'uint256' },
              { name: 'takerToken', type: 'address' },
              { name: 'takerAmount', type: 'uint256' },
              { name: 'salt', type: 'string' },
            ],
          },
          primaryType: 'Order',
          message: {
            maker: mockActiveOrder.maker,
            makerToken: mockActiveOrder.makerToken,
            makerAmount: mockActiveOrder.makerAmount.toString(),
            takerToken: mockActiveOrder.takerToken,
            takerAmount: mockActiveOrder.takerAmount.toString(),
            salt: mockActiveOrder.salt,
          },
        },
      });
    });

    it('should throw NotFoundException when order is not found', async () => {
      mockPrismaService.orders.findUnique.mockResolvedValue(null);

      await expect(service.executeOrder(mockOrderId)).rejects.toThrow(
        new NotFoundException('Order not found'),
      );
    });

    it('should throw BadRequestException when order is not active', async () => {
      const inactiveOrder = {
        ...mockActiveOrder,
        status: OrderStatus.PENDING_SIGNATURE,
      };

      mockPrismaService.orders.findUnique.mockResolvedValue(inactiveOrder);

      await expect(service.executeOrder(mockOrderId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.executeOrder(mockOrderId)).rejects.toThrow(
        `Order is not active. Current status: ${OrderStatus.PENDING_SIGNATURE}`,
      );
    });

    it('should throw BadRequestException when order is not signed', async () => {
      const unsignedOrder = {
        ...mockActiveOrder,
        signature: null,
      };

      mockPrismaService.orders.findUnique.mockResolvedValue(unsignedOrder);

      await expect(service.executeOrder(mockOrderId)).rejects.toThrow(
        new BadRequestException('Order is not signed'),
      );
    });

    it('should query order with correct ID', async () => {
      mockPrismaService.orders.findUnique.mockResolvedValue(mockActiveOrder);

      await service.executeOrder(mockOrderId);

      expect(mockPrismaService.orders.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockOrderId,
        },
      });
    });

    it('should retrieve contract address from config', async () => {
      mockPrismaService.orders.findUnique.mockResolvedValue(mockActiveOrder);

      await service.executeOrder(mockOrderId);

      expect(configService.getOrThrow).toHaveBeenCalledWith(
        'SECONDARY_MARKET_CONTRACT_ADDRESS',
      );
    });

    it('should handle different order statuses correctly', async () => {
      const statuses = [
        OrderStatus.PENDING_SIGNATURE,
        OrderStatus.CANCELLED,
        OrderStatus.FILLED,
      ];

      for (const status of statuses) {
        const orderWithStatus = {
          ...mockActiveOrder,
          status,
        };

        mockPrismaService.orders.findUnique.mockResolvedValue(
          orderWithStatus,
        );

        await expect(service.executeOrder(mockOrderId)).rejects.toThrow(
          BadRequestException,
        );
      }
    });

    it('should throw BadRequestException for invalid order ID', async () => {
      await expect(service.executeOrder(0)).rejects.toThrow(
        new BadRequestException('Invalid order ID'),
      );

      await expect(service.executeOrder(-1)).rejects.toThrow(
        new BadRequestException('Invalid order ID'),
      );
    });

    it('should throw InternalServerErrorException when database query fails', async () => {
      const error = new Error('Database error');
      mockPrismaService.orders.findUnique.mockRejectedValue(error);

      await expect(service.executeOrder(mockOrderId)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.executeOrder(mockOrderId)).rejects.toThrow(
        'Failed to fetch order: Database error',
      );
    });
  });

  describe('getOrders', () => {
    const mockOrders = [
      {
        id: 1,
        maker: '0x1234567890123456789012345678901234567890',
        makerToken: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        makerAmount: BigInt('1000000000000000000'),
        takerToken: '0x9876543210987654321098765432109876543210',
        takerAmount: BigInt('2000000000000000000'),
        salt: 'test-salt-1',
        signature: '0xsignature1',
        status: OrderStatus.ACTIVE,
        makerTokenDecimals: 18,
        takerTokenDecimals: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        maker: '0x2234567890123456789012345678901234567890',
        makerToken: '0xbbcdefabcdefabcdefabcdefabcdefabcdefabcd',
        makerAmount: BigInt('3000000000000000000'),
        takerToken: '0x8876543210987654321098765432109876543210',
        takerAmount: BigInt('4000000000000000000'),
        salt: 'test-salt-2',
        signature: '0xsignature2',
        status: OrderStatus.ACTIVE,
        makerTokenDecimals: 18,
        takerTokenDecimals: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return paginated orders with default pagination', async () => {
      mockPrismaService.orders.findMany.mockResolvedValue(mockOrders);
      mockPrismaService.orders.count.mockResolvedValue(2);

      const result = await service.getOrders({});

      expect(result).toEqual({
        data: mockOrders,
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });

      expect(mockPrismaService.orders.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          status: OrderStatus.ACTIVE,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(mockPrismaService.orders.count).toHaveBeenCalledWith({
        where: {
          status: OrderStatus.ACTIVE,
        },
      });
    });

    it('should return paginated orders with custom pagination', async () => {
      mockPrismaService.orders.findMany.mockResolvedValue(mockOrders);
      mockPrismaService.orders.count.mockResolvedValue(25);

      const result = await service.getOrders({ page: 2, limit: 5 });

      expect(result).toEqual({
        data: mockOrders,
        meta: {
          total: 25,
          page: 2,
          limit: 5,
          totalPages: 5,
        },
      });

      expect(mockPrismaService.orders.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        where: {
          status: OrderStatus.ACTIVE,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should throw InternalServerErrorException when database query fails', async () => {
      const error = new Error('Database error');
      mockPrismaService.orders.findMany.mockRejectedValue(error);

      await expect(service.getOrders({})).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.getOrders({})).rejects.toThrow(
        'Failed to fetch orders: Database error',
      );
    });

    it('should calculate total pages correctly', async () => {
      mockPrismaService.orders.findMany.mockResolvedValue(mockOrders);
      mockPrismaService.orders.count.mockResolvedValue(23);

      const result = await service.getOrders({ page: 1, limit: 10 });

      expect(result.meta.totalPages).toBe(3);
    });
  });
});

```

# src\orders\orders.service.ts

```ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/shared/prisma.service';
import { BlockchainService } from 'src/shared/blockhain.service';
import { Address } from 'viem';
import { StringUtilService } from 'src/shared/string-util.service';
import { UnsignedTypedDataDto } from './dto/unsigned-typed-data.dto';
import { baseSepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '@prisma/client';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedOrdersResponseDto } from './dto/paginated-orders-response.dto';
import { SignedTypedDataResponseDto } from './dto/signed-typed-data-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly blockchainService: BlockchainService,
    private readonly stringUtilService: StringUtilService,
    private readonly configService: ConfigService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<UnsignedTypedDataDto> {
    const maker = createOrderDto.maker as Address;
    const makerToken = createOrderDto.makerToken as Address;
    const takerToken = createOrderDto.takerToken as Address;

    let makerTokenDecimals: number;
    let takerTokenDecimals: number;

    try {
      [makerTokenDecimals, takerTokenDecimals] = await Promise.all([
        this.blockchainService.getDecimalsERC20(makerToken),
        this.blockchainService.getDecimalsERC20(takerToken),
      ]);
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch token decimals: ${error.message}`,
      );
    }

    let order;
    try {
      order = await this.prismaService.orders.create({
        data: {
          ...createOrderDto,
          makerTokenDecimals: makerTokenDecimals,
          takerTokenDecimals: takerTokenDecimals,
          salt: this.stringUtilService.generateSalt(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create order: ${error.message}`,
      );
    }

    return {
      account: maker,
      domain: {
        name: 'Owna',
        version: '1',
        chainId: baseSepolia.id,
        verifyingContract: this.configService.getOrThrow<Address>(
          'SECONDARY_MARKET_CONTRACT_ADDRESS',
        ),
      },
      types: {
        Order: [
          { name: 'maker', type: 'address' },
          { name: 'makerToken', type: 'address' },
          { name: 'makerAmount', type: 'uint256' },
          { name: 'takerToken', type: 'address' },
          { name: 'takerAmount', type: 'uint256' },
          { name: 'salt', type: 'string' },
        ] as const,
      },
      primaryType: 'Order' as const,
      message: {
        maker: order.maker,
        makerToken: order.makerToken,
        makerAmount: order.makerAmount.toString(),
        takerToken: order.takerToken,
        takerAmount: order.takerAmount.toString(),
        salt: order.salt,
      },
    };
  }

  async verifySignedOrder(
    order: UnsignedTypedDataDto,
    signature: string,
  ): Promise<boolean> {
    const { account, domain, types, primaryType, message } = order;

    // Validate signature format
    if (!signature || !signature.match(/^0x[a-fA-F0-9]{130}$/)) {
      throw new BadRequestException('Invalid signature format');
    }

    // Check if order exists and is in correct state
    const existingOrder = await this.prismaService.orders.findUnique({
      where: { salt: message.salt },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    if (existingOrder.status !== OrderStatus.PENDING_SIGNATURE) {
      throw new BadRequestException(
        `Order is not pending signature. Current status: ${existingOrder.status}`,
      );
    }

    // Verify signature
    let valid: boolean;
    try {
      valid = await this.blockchainService
        .getPublicClient()
        .verifyTypedData({
          address: account,
          domain: domain,
          types: types,
          primaryType: primaryType,
          message: message,
          signature: signature as `0x${string}`,
        });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to verify signature: ${error.message}`,
      );
    }

    if (!valid) {
      throw new BadRequestException('Invalid signature');
    }

    // Update order only if signature is valid
    try {
      await this.prismaService.orders.update({
        where: {
          salt: message.salt,
        },
        data: {
          status: OrderStatus.ACTIVE,
          signature: signature,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update order: ${error.message}`,
      );
    }

    return valid;
  }

  async executeOrder(orderId: number): Promise<SignedTypedDataResponseDto> {
    // Validate orderId
    if (!orderId || orderId <= 0) {
      throw new BadRequestException('Invalid order ID');
    }

    let order;
    try {
      order = await this.prismaService.orders.findUnique({
        where: {
          id: orderId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch order: ${error.message}`,
      );
    }

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== OrderStatus.ACTIVE) {
      throw new BadRequestException(
        `Order is not active. Current status: ${order.status}`,
      );
    }
    if (!order.signature) {
      throw new BadRequestException('Order is not signed');
    }

    return {
      signature: order.signature,
      typedData: {
        account: order.maker as Address,
        domain: {
          name: 'Owna',
          version: '1',
          chainId: baseSepolia.id,
          verifyingContract: this.configService.getOrThrow<Address>(
            'SECONDARY_MARKET_CONTRACT_ADDRESS',
          ),
        },
        types: {
          Order: [
            { name: 'maker', type: 'address' },
            { name: 'makerToken', type: 'address' },
            { name: 'makerAmount', type: 'uint256' },
            { name: 'takerToken', type: 'address' },
            { name: 'takerAmount', type: 'uint256' },
            { name: 'salt', type: 'string' },
          ] as const,
        },
        primaryType: 'Order' as const,
        message: {
          maker: order.maker,
          makerToken: order.makerToken,
          makerAmount: order.makerAmount.toString(),
          takerToken: order.takerToken,
          takerAmount: order.takerAmount.toString(),
          salt: order.salt,
        },
      },
    };
  }

  async getOrders(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedOrdersResponseDto> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prismaService.orders.findMany({
          skip,
          take: limit,
          where: {
            status: OrderStatus.ACTIVE,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prismaService.orders.count({
          where: {
            status: OrderStatus.ACTIVE,
          },
        }),
      ]);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch orders: ${error.message}`,
      );
    }
  }
}

```

# src\shared\blockhain.service.ts

```ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Address,
  erc20Abi,
  createPublicClient,
} from 'viem';

@Injectable()
export class BlockchainService {
  constructor(
    @Inject('PUBLIC_CLIENT') private readonly client: ReturnType<typeof createPublicClient>,
  ) {}

  getPublicClient() {
    return this.client;
  }

  async getDecimalsERC20(address: Address): Promise<number> {
    try {
      const decimals = await this.client.readContract({
        address: address,
        abi: erc20Abi,
        functionName: 'decimals',
      });

      return decimals;
    } catch (error) {
      throw new BadRequestException(
        `Failed to get decimals for token at address ${address}. Please ensure this is a valid ERC20 contract address on Base Sepolia testnet.`,
      );
    }
  }
}

```

# src\shared\prisma.service.ts

```ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

```

# src\shared\shared.module.ts

```ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { PrismaService } from './prisma.service';
import { BlockchainService } from './blockhain.service';
import { StringUtilService } from './string-util.service';

@Module({
  providers: [
    PrismaService,
    StringUtilService,
    {
      provide: 'PUBLIC_CLIENT',
      useFactory: (configService: ConfigService) => {
        return createPublicClient({
          chain: baseSepolia,
          transport: http(
            configService.get<string>('BASE_SEPOLIA_RPC_URL'),
          ),
        });
      },
      inject: [ConfigService],
    },
    BlockchainService,
  ],
  exports: [PrismaService, BlockchainService, StringUtilService],
})
export class SharedModule {}

```

# src\shared\string-util.service.ts

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class StringUtilService {
  generateSalt(): string {
    return Math.random().toString(36).slice(2);
  }
}

```

# test\app.e2e-spec.ts

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

```

# test\jest-e2e.json

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}

```

# tsconfig.build.json

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}

```

# tsconfig.json

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "resolvePackageJsonExports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "noFallthroughCasesInSwitch": false
  }
}

```

