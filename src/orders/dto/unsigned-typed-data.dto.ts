import { Address, TypedDataDomain } from 'viem';

export class UnsignedTypedDataDto {
  account: Address;
  domain: TypedDataDomain;
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
  primaryType: 'Order';
  message: {
    maker: string;
    makerToken: string;
    makerAmount: string;
    takerToken: string;
    takerAmount: string;
    salt: string;
  };
}
