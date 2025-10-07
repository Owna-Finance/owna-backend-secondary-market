import { IsString, IsNotEmpty, Matches, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
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
  @IsNumberString()
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
  @IsNumberString()
  @IsNotEmpty()
  takerAmount: string;
}
