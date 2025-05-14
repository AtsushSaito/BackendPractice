import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'temporary_secret_key',
      ),
    });
  }

  async validate(payload: any) {
    // ペイロードからユーザー情報を抽出して返す
    // このオブジェクトはリクエストのuserプロパティに追加される
    return { userId: payload.sub, username: payload.username };
  }
}
