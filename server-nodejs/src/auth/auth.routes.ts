import { Router } from 'express';
import { asyncHandler } from '../utils/http';
import { register, login, refresh, logout } from './auth.controller';

const r = Router();
r.post('/register', asyncHandler(register));
r.post('/login', asyncHandler(login));
r.post('/refresh', asyncHandler(refresh));
r.post('/logout', asyncHandler(logout));
export default r;
