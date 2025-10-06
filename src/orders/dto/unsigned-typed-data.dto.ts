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
