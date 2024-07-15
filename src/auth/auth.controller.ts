import { Metadata } from '@grpc/grpc-js';
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
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  UserData,
  ValidationData,
} from '../grpc/types/auth/auth';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    metadata: Metadata,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...rest: any
  ): Promise<UserData> {
    return await this.authService.validateUser(request.accessToken);
  }
}
