/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  UserData,
  ValidationData,
} from '../grpc/types/auth/auth';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  async validateUser(
    request: ValidationData,
    metadata: Metadata,
    ...rest: any
  ): Promise<UserData> {
    console.log('request', request.accessToken);
    return await this.authService.validateUser(request.accessToken);
  }
}
