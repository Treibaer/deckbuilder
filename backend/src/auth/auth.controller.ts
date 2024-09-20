import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard, Public } from "./auth.guard";
import { AuthService } from "./auth.service";

@Controller("api/v1")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(
      signInDto.email,
      signInDto.email,
      signInDto.password,
      signInDto.client,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("register")
  register(@Body() registerDto: Record<string, any>) {
    if (!registerDto.username || !registerDto.email || !registerDto.password) {
      throw new BadRequestException("Missing required fields");
    }
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }
    // check if email is valid
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerDto.email)) {
      throw new BadRequestException("Invalid email");
    }
    if (registerDto.password.length < 8) {
      throw new BadRequestException(
        "Password must be at least 8 characters long",
      );
    }

    return this.authService.register(
      registerDto.username,
      registerDto.email,
      registerDto.password,
      registerDto.client,
    );
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile() {
    return "yo.";
  }
}
