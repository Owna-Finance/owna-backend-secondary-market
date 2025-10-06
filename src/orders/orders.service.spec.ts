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
