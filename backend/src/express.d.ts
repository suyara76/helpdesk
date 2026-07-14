import { UserAuth } from './auth/interfaces/UserAuth';

declare module 'express' {
  interface Request {
    user?: UserAuth; // Adds type safety for req.user
  }
}
