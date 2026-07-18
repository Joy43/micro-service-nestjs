import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  API_GATEWAY_PORT: Joi.number().default(6000),
  KAFKA_BROKER: Joi.string().default('localhost:29092'),
});
