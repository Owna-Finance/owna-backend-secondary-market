import { UnsignedTypedDataDto } from './unsigned-typed-data.dto';
import { IsString, IsNotEmpty, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignedTypedDataResponseDto {
  @ApiProperty({
    description: 'The unsigned typed data that was signed',
    type: UnsignedTypedDataDto
  })
  @ValidateNested()
  @Type(() => UnsignedTypedDataDto)
  typedData: UnsignedTypedDataDto;

  @ApiProperty({
    description: 'The signature of the typed data',
    example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    pattern: '^0x[a-fA-F0-9]{130}$'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{130}$/, {
    message: 'signature must be a valid Ethereum signature',
  })
  signature: string;
}
