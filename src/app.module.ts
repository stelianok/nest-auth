import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FeatureModule } from './feature/feature.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), FeatureModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
