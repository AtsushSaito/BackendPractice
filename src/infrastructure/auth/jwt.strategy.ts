import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'temporary_secret_key', // 本番環境では環境変数から取得するべき
    });
  }

  async validate(payload: any) {
    // ペイロードからユーザー情報を抽出して返す
    // このオブジェクトはリクエストのuserプロパティに追加される
    return { userId: payload.sub, username: payload.username };
  }
} 