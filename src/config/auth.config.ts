import { registerAs } from '@nestjs/config';

export default registerAs('externalAuth', () => ({
  baseUrl: process.env.EXTERNAL_AUTH_API_URL,
  clientId: process.env.EXTERNAL_AUTH_CLIENT_ID,
  clientSecret: process.env.EXTERNAL_AUTH_CLIENT_SECRET,
  timeout: parseInt(process.env.EXTERNAL_AUTH_TIMEOUT || '5000', 10),
})); 