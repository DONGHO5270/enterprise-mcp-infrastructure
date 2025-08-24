/**
 * Mock Authentication Service
 * 개발 환경을 위한 간단한 인증 서비스
 */
import { Response, NextFunction } from 'express';
export declare const authRoutes: (app: any) => void;
export declare function authenticateToken(req: any, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=mock-auth.d.ts.map