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

    await this.tokenRepository.save({token})

    return token;
  }
}

