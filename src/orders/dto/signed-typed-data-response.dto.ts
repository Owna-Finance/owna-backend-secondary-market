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
