import { Injectable } from '@nestjs/common';

@Injectable()
export class StringUtilService {
  generateSalt(): string {
    return Math.random().toString(36).slice(2);
  }
}
