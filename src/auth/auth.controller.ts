import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {

  constructor(private authService:AuthService) {}

  @Post('/register')
  register(@Body() registerUserDto:RegisterUserDto):Promise<User> {
    return this.authService.register(registerUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.authService.login(loginUserDto);
  }

  @Post('/refresh-token')
  refreshToken(@Body() {refresh_token}): Promise<any> {
    return this.authService.refreshToken(refresh_token);
  }
}
