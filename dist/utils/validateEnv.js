"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
function validateEnv() {
    const requiredEnvVars = ['PORT', 'MONGODB_URI', 'IPINFO_TOKEN'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
            'Please check your .env file and ensure all required variables are set.');
    }
}
