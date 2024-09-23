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
      signInDto.username,
      signInDto.password,
      signInDto.client,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("register")
  register(@Body() registerDto: Record<string, any>) {
    if (!registerDto.username || !registerDto.password) {
      throw new BadRequestException("Missing required fields");
    }
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }
    if (registerDto.password.length < 6) {
      throw new BadRequestException(
        "Password must be at least 6 characters long",
      );
    }

    return this.authService.register(
      registerDto.username,
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
