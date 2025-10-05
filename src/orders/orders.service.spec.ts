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
        'Failed to fetch decimals',
      );
    });

    it('should handle errors when database creation fails', async () => {
      const error = new Error('Database error');
      mockPrismaService.orders.create.mockRejectedValue(error);

      await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
        'Database error',
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
      mockPrismaService.orders.update.mockResolvedValue(mockUpdatedOrder);

      const result = await service.verifySignedOrder(
        mockUnsignedTypedData,
        mockSignature,
      );

      expect(result).toBe(true);
    });

    it('should verify signature and return false when signature is invalid', async () => {
      const mockPublicClient = {
        verifyTypedData: jest.fn().mockResolvedValue(false),
      };

      mockBlockchainService.getPublicClient.mockReturnValue(mockPublicClient);
      mockPrismaService.orders.update.mockResolvedValue(mockUpdatedOrder);

      const result = await service.verifySignedOrder(
        mockUnsignedTypedData,
        mockSignature,
      );

      expect(result).toBe(false);
    });

    it('should call verifyTypedData with correct parameters', async () => {
      const mockPublicClient = {
        verifyTypedData: jest.fn().mockResolvedValue(true),
      };

      mockBlockchainService.getPublicClient.mockReturnValue(mockPublicClient);
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

      await expect(
        service.verifySignedOrder(mockUnsignedTypedData, mockSignature),
      ).rejects.toThrow('Blockchain verification failed');
    });

    it('should handle errors when database update fails', async () => {
      const mockPublicClient = {
        verifyTypedData: jest.fn().mockResolvedValue(true),
      };

      mockBlockchainService.getPublicClient.mockReturnValue(mockPublicClient);

      const error = new Error('Database update failed');
      mockPrismaService.orders.update.mockRejectedValue(error);

      await expect(
        service.verifySignedOrder(mockUnsignedTypedData, mockSignature),
      ).rejects.toThrow('Database update failed');
    });

    it('should handle case when order with salt does not exist', async () => {
      const mockPublicClient = {
        verifyTypedData: jest.fn().mockResolvedValue(true),
      };

      mockBlockchainService.getPublicClient.mockReturnValue(mockPublicClient);

      const error = new Error('Record not found');
      mockPrismaService.orders.update.mockRejectedValue(error);

      await expect(
        service.verifySignedOrder(mockUnsignedTypedData, mockSignature),
      ).rejects.toThrow('Record not found');
    });

    it('should update order even when signature is invalid', async () => {
      const mockPublicClient = {
        verifyTypedData: jest.fn().mockResolvedValue(false),
      };

      mockBlockchainService.getPublicClient.mockReturnValue(mockPublicClient);
      mockPrismaService.orders.update.mockResolvedValue({
        ...mockUpdatedOrder,
        status: OrderStatus.ACTIVE,
      });

      const result = await service.verifySignedOrder(
        mockUnsignedTypedData,
        mockSignature,
      );

      expect(result).toBe(false);
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
  });
});
