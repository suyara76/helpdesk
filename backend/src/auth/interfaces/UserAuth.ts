import { UserRole } from '@prisma/client';

export interface UserAuth {
  userId: string;
  role: UserRole;
}
