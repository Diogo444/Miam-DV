import { Strategy } from 'passport-jwt';
import { AdminService } from '../../admin/admin.service';
type JwtPayload = {
    sub: number;
    role: string;
    exp?: number;
    tokenVersion?: number | string;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private adminService;
    private readonly logger;
    constructor(adminService: AdminService);
    validate(payload: JwtPayload): Promise<{
        id: number;
        username: string;
        role: string;
    }>;
}
export {};
