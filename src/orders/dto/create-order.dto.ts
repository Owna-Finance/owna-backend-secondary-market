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
