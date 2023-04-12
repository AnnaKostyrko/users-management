import { Injectable } from '@nestjs/common';
import {Token} from "./entities/token.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import * as crypto from "crypto";

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

  async checkToken(token: string): Promise<string> {

      if (!token){
          return "Not authorized.";
      }

     const tokenEntity = await this.tokenRepository.findOneBy({token});

     if (!tokenEntity){
       return "Not authorized.";
     }

     if (tokenEntity.created_at < new Date(Date.now() - 40 * 60 * 1000)) {
         return "The token expired.";
     }


     if (!tokenEntity.isActive) {
         return "The token expired.";
     }

      tokenEntity.isActive = false;
      await this.tokenRepository.save(tokenEntity);

      return '';
  }
}

