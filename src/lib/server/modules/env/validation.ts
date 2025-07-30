/**
 * Environment Variable Validation
 *
 * Validates required environment variables on application startup
 * to prevent runtime failures and provide clear error messages.
 */

interface EnvironmentVariable {
	name: string;
	required: boolean;
	description: string;
	validator?: (value: string) => boolean;
	errorMessage?: string;
}

/**
 * Required environment variables configuration
 */
const REQUIRED_ENV_VARS: EnvironmentVariable[] = [
	{
		name: 'BLAND_AI_API_KEY',
		required: true,
		description: 'API key for Bland AI service',
		validator: (value) => value.length > 10 && value.startsWith('sk-'),
		errorMessage: 'BLAND_AI_API_KEY must be a valid API key starting with "sk-"'
	},
	{
		name: 'OPENAI_API_KEY',
		required: true,
		description: 'API key for OpenAI service',
		validator: (value) => value.length > 10 && value.startsWith('sk-'),
		errorMessage: 'OPENAI_API_KEY must be a valid API key starting with "sk-"'
	},
	{
		name: 'NODE_ENV',
		required: false,
		description: 'Node.js environment (development, production, etc.)'
	}
];

/**
 * Validation result interface
 */
interface ValidationResult {
	valid: boolean;
	errors: string[];
	warnings: string[];
}

/**
 * Validate all required environment variables
 */
export function validateEnvironmentVariables(): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	for (const envVar of REQUIRED_ENV_VARS) {
		const value = process.env[envVar.name];

		// Check if required variable is missing
		if (envVar.required && (!value || value.trim() === '')) {
			errors.push(`Missing required environment variable: ${envVar.name} - ${envVar.description}`);
			continue;
		}

		// Skip validation if variable is not required and not present
		if (!envVar.required && (!value || value.trim() === '')) {
			continue;
		}

		// Run custom validator if provided
		if (value && envVar.validator && !envVar.validator(value)) {
			errors.push(envVar.errorMessage || `Invalid value for ${envVar.name}`);
		}
	}

	// Additional validations
	if (process.env.NODE_ENV === 'production') {
		// In production, warn about development-specific settings
		if (process.env.VITE_DEV_MODE === 'true') {
			warnings.push('VITE_DEV_MODE is enabled in production environment');
		}
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings
	};
}

/**
 * Validate environment variables and exit process if invalid
 */
export function validateAndExit(): void {
	const result = validateEnvironmentVariables();

	// Log warnings
	if (result.warnings.length > 0) {
		console.warn('⚠️  Environment warnings:');
		result.warnings.forEach((warning) => console.warn(`  - ${warning}`));
	}

	// Handle errors
	if (!result.valid) {
		console.error('❌ Environment validation failed:');
		result.errors.forEach((error) => console.error(`  - ${error}`));
		console.error(
			'\nPlease check your .env file and ensure all required environment variables are set.'
		);
		console.error('See .env.example for reference.');
		process.exit(1);
	}

	// Success message
	const envType = process.env.NODE_ENV || 'development';
	console.log(`✅ Environment validation passed (${envType})`);
}

/**
 * Get environment variable with validation
 */
export function getRequiredEnv(name: string): string {
	const value = process.env[name];
	if (!value || value.trim() === '') {
		throw new Error(`Required environment variable ${name} is not set`);
	}
	return value.trim();
}

/**
 * Get optional environment variable with default
 */
export function getOptionalEnv(name: string, defaultValue: string = ''): string {
	const value = process.env[name];
	return value ? value.trim() : defaultValue;
}

/**
 * Check if we're in production environment
 */
export function isProduction(): boolean {
	return process.env.NODE_ENV === 'production';
}

/**
 * Check if we're in development environment
 */
export function isDevelopment(): boolean {
	return process.env.NODE_ENV !== 'production';
}
