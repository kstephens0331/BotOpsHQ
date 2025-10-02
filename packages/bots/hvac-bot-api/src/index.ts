import express from 'express';
import { BotCore } from '@botopshq/bot-core';

export const createHVACBot = (tenantConfig: any) => {
  const app = express();
  const bot = new BotCore(tenantConfig);
  
  // HVAC-specific routes and logic
  return app;
};