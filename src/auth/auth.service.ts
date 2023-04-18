import { Injectable } from '@nestjs/common';
import {Token} from "./entities/token.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import * as crypto from "crypto";
import {UnsuccessfulApiCallException} from "../exceptions/validation-exception";

@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(Token)
      private tokenRepository: Repository<Token>,
  ) {}

  async generateToken() {
    const token = crypto.randomBytes(64).toString('hex');

    await this.tokenRepository.save({token, created_at: new Date()})

    return token;
  }

  async checkAndInvalidateToken(token: string): Promise<void> {
      if (!token){
          this.throwAuthError("Not authorized.");
      }

      const tokenEntity = await this.tokenRepository.findOneBy({token});
      if (!tokenEntity){
          this.throwAuthError("Not authorized.");
      }

      if (tokenEntity.created_at < new Date(Date.now() - 40 * 60 * 1000) || !tokenEntity.isActive) {
          this.throwAuthError("The token expired.");
      }

      tokenEntity.isActive = false;
      await this.tokenRepository.save(tokenEntity);
  }

    private throwAuthError(error: string) {
        throw new UnsuccessfulApiCallException(null, error, 401);
    }
}

