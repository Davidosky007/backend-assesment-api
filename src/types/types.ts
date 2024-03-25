import { Request } from 'express';

export interface AuthenticatedRequest<T> extends Request {
  identity: {
    _id: string; // Adjust the type according to your user ID type
  };
}
