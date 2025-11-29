import { JwtAuthGuard, LocalAuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('should create local and jwt guards', () => {
    expect(new LocalAuthGuard()).toBeDefined();
    expect(new JwtAuthGuard()).toBeDefined();
  });
});
