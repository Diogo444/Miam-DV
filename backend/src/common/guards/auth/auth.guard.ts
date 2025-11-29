import { Injectable } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends NestAuthGuard('local') {}

@Injectable()
export class JwtAuthGuard extends NestAuthGuard('jwt') {}
