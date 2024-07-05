import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('feature')
export class FeatureController {
  @Get('public')
  getPublicFeature() {
    return 'this is a public feature';
  }

  @Get('private')
  @UseGuards(JwtAuthGuard)
  getPrivateFeature() {
    return 'This is private feature';
  }
}
