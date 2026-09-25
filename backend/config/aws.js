// AWS SDK configuration — loads credentials ONLY from environment variables or IAM roles.
// NEVER hardcode credentials in this file.
//
// Setup:
//   1. Add AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY to your .env
//   2. In production, prefer IAM roles or AWS Secrets Manager (see fetchFromSecretsManager below)
//
// Usage:
//   const { s3Client, sesClient, fetchFromSecretsManager } = require('./config/aws');

const logger = require('../utils/logger');

// ── Validate required env vars ───────────────────────────────
const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  logger.warn('AWS', 'Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY in environment — AWS services will be unavailable');
}

// ── Credential object (for SDK v3 clients) ───────────────────
// The SDK will auto-resolve from env vars, IAM roles, or credential chain.
// We export explicit config only if env vars are set.
const awsCredentials =
  AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
    ? {
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
      }
    : { region: AWS_REGION };
// When credentials are omitted, the SDK falls back to the default
// credential provider chain: env vars → shared credentials file →
// ECS container credentials → EC2 instance metadata (IAM role).

// ── Secrets Manager helper (optional, for production) ────────
// Fetches a secret by name from AWS Secrets Manager.
// Install @aws-sdk/client-secrets-manager before using:
//   npm install @aws-sdk/client-secrets-manager
//
// Example:
//   const dbPassword = await fetchFromSecretsManager('prod/smartschemes/db-password');

async function fetchFromSecretsManager(secretName) {
  try {
    // Dynamic import — fails gracefully if SDK not installed
    const { SecretsManagerClient, GetSecretValueCommand } =
      require('@aws-sdk/client-secrets-manager');

    const client = new SecretsManagerClient(awsCredentials);
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);

    if (response.SecretString) {
      return JSON.parse(response.SecretString);
    }

    // Binary secret
    const buff = Buffer.from(response.SecretBinary, 'base64');
    return buff.toString('utf-8');
  } catch (error) {
    logger.error('AWS', `Failed to fetch secret "${secretName}": ${error.message}`);
    throw error;
  }
}

module.exports = {
  awsCredentials,
  fetchFromSecretsManager,
  AWS_REGION,
};
