/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, RequestHandler } from 'express';
import { z, ZodType, ZodTypeDef, ZodObject } from 'zod';

export type RouteHandler = RequestHandler<any, any, any, any, Record<string, any>>;

type ExtractSchema<T> = T extends ZodObject<infer U>
  ? { [K in keyof U]: U[K] extends ZodType<any, ZodTypeDef, any> ? U[K] : never }
  : never;

type ExtractableKeys = 'params' | 'body' | 'query' | 'file';
type FilterSchema<T> = Pick<T, ExtractableKeys & keyof T>;

export type TypedRequest<TSchema extends ZodType<any, ZodTypeDef, any>> = Request<
  z.infer<FilterSchema<ExtractSchema<TSchema>>['params']>,
  any,
  z.infer<FilterSchema<ExtractSchema<TSchema>>['body']>,
  z.infer<FilterSchema<ExtractSchema<TSchema>>['query']>,
  z.infer<FilterSchema<ExtractSchema<TSchema>>['file']>
>;
