import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  EVENTS_SERVICE_PORT: Joi.number().default(6003),
  DATABASE_URL: Joi.string().required(),
  KAFKA_BROKER: Joi.string().default('localhost:29092'),
  JWT_SECRET: Joi.string().required(),
});
