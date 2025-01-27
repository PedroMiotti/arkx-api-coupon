import Server from 'express';

const Router = Server.Router;

export { Router as RouterType, json as BodyParser } from 'express';

export type { Response, NextFunction, Application } from 'express';

export { Server, Router };
