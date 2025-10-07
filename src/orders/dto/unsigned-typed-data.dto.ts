import type { Address, TypedDataDomain } from 'viem';
import {
  IsString,
  IsNotEmpty,
  Matches,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderMessageDto {
  @ApiProperty({
    description: 'The Ethereum address of the order maker',
    example: '0x1234567890123456789012345678901234567890',
    pattern: '^0x[a-fA-F0-9]{40}$'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'maker must be a valid Ethereum address',
  })
  maker: string;

  @ApiProperty({
    description: 'The token address that the maker is offering',
    example: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    pattern: '^0x[a-fA-F0-9]{40}$'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'makerToken must be a valid Ethereum address',
  })
  makerToken: string;

  @ApiProperty({
    description: 'The amount of maker tokens being offered',
    example: '1000000000000000000',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  makerAmount: string;

  @ApiProperty({
    description: 'The token address that the maker wants in exchange',
    example: '0xfedcbafedcbafedcbafedcbafedcbafedcbafed',
    pattern: '^0x[a-fA-F0-9]{40}$'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'takerToken must be a valid Ethereum address',
  })
  takerToken: string;

  @ApiProperty({
    description: 'The amount of taker tokens desired',
    example: '2000000000000000000',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  takerAmount: string;

  @ApiProperty({
    description: 'Random salt value for uniqueness',
    example: '123456789',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  salt: string;

  [key: string]: unknown;
}

export class UnsignedTypedDataDto {
  @ApiProperty({
    description: 'The Ethereum account address',
    example: '0x1234567890123456789012345678901234567890',
    pattern: '^0x[a-fA-F0-9]{40}$'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'account must be a valid Ethereum address',
  })
  account: Address;

  @ApiProperty({
    description: 'EIP-712 domain separator',
    example: {
      name: 'OwnaFinance',
      version: '1',
      chainId: 1,
      verifyingContract: '0x1234567890123456789012345678901234567890'
    }
  })
  @IsObject()
  @IsNotEmpty()
  domain: TypedDataDomain;

  @ApiProperty({
    description: 'EIP-712 types definition',
    example: {
      Order: [
        { name: 'maker', type: 'address' },
        { name: 'makerToken', type: 'address' },
        { name: 'makerAmount', type: 'uint256' },
        { name: 'takerToken', type: 'address' },
        { name: 'takerAmount', type: 'uint256' },
        { name: 'salt', type: 'string' }
      ]
    }
  })
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

  @ApiProperty({
    description: 'Primary type for EIP-712',
    example: 'Order',
    enum: ['Order']
  })
  @IsString()
  @IsNotEmpty()
  primaryType: 'Order';

  @ApiProperty({
    description: 'The order message to be signed',
    type: OrderMessageDto
  })
  @ValidateNested()
  @Type(() => OrderMessageDto)
  message: OrderMessageDto;
}
