import { Session } from "express-session";
import express from "express";

declare module "express-session" {
  interface Session {
    accessToken: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: Record<string, any>;
    }
  }
}
