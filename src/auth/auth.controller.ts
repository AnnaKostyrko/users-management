import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('token')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Get()
  async generateToken() {

    const token = await this.authService.generateToken()
    return {
      success: true,
      token
    }
  }
}
