export function validateEnv(): void {
  const requiredEnvVars = [
    { name: 'PORT', type: 'number', default: '3000' },
    { name: 'MONGODB_URI', type: 'string' },
    { name: 'IPINFO_TOKEN', type: 'string' }
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar.name]);
  const invalidEnvVars = requiredEnvVars.filter(envVar => {
    if (envVar.type === 'number' && process.env[envVar.name]) {
      return isNaN(Number(process.env[envVar.name]));
    }
    return false;
  });

  if (missingEnvVars.length > 0) {
    const errorMessage = [
      'Missing required environment variables:',
      ...missingEnvVars.map(envVar => `  - ${envVar.name}${envVar.default ? ` (default: ${envVar.default})` : ''}`),
      '\nPlease check your .env file and ensure all required variables are set.'
    ].join('\n');
    throw new Error(errorMessage);
  }

  if (invalidEnvVars.length > 0) {
    const errorMessage = [
      'Invalid environment variables:',
      ...invalidEnvVars.map(envVar => `  - ${envVar.name} must be a number`),
      '\nPlease check your .env file and ensure all variables have correct types.'
    ].join('\n');
    throw new Error(errorMessage);
  }

  // Set default values for optional variables
  if (!process.env.PORT) {
    process.env.PORT = '3000';
  }
} 