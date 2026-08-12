import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

const setRequestProperty = <T>(req: Request, key: "body" | "query", value: T) => {
  Object.defineProperty(req, key, {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
};

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse(req.body);
    setRequestProperty(req, "body", parsed);
    next();
  };

export const validateParams =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.params);
    next();
  };

export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse(req.query);
    setRequestProperty(req, "query", parsed);
    next();
  };
