import { Strategy } from 'passport-jwt';
import { AdminService } from '../../admin/admin.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private adminService;
    private readonly logger;
    constructor(adminService: AdminService);
    validate(payload: any): Promise<{
        id: number;
        username: string;
        role: string;
    }>;
}
export {};
