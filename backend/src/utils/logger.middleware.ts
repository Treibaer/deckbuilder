import { NextFunction, Request, Response } from "express";

export function logger(req: Request, _res: Response, next: NextFunction) {
  console.log(`Request... ${req.url} ${req.method}`);
  // throw new HttpException("Forbidden", 408);
  next();
}
