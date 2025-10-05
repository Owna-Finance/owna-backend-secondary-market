import { UnsignedTypedDataDto } from './unsigned-typed-data.dto';

export class SignedTypedDataResponseDto {
  typedData: UnsignedTypedDataDto;
  signature: string;
}
