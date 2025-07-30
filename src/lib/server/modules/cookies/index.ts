// Cookie encryption functionality disabled temporarily  
// Requires jose library and environment variables

/*
import * as jose from 'jose';
import { ENCRYPTION_SECRET } from '$env/static/private';

async function getKey() {
	if (ENCRYPTION_SECRET.length !== 32) {
		throw new Error('Invalid key length. Key must be 32 characters long');
	}
	return new TextEncoder().encode(ENCRYPTION_SECRET);
}

export async function encryptCookie(payload: Record<string, any>): Promise<string> {
	const key = await getKey();
	const jwt = await new jose.EncryptJWT(payload)
		.setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
		.setIssuedAt()
		.setExpirationTime('2h')
		.encrypt(key);

	return jwt;
}

export async function decryptCookie(encrypted: string): Promise<Record<string, any> | null> {
	try {
		const key = await getKey();
		const { payload } = await jose.jwtDecrypt(encrypted, key);
		return payload;
	} catch (error) {
		console.error('Failed to decrypt cookie:', error);
		return null;
	}
}

export function createSecureCookieOptions() {
	return {
		httpOnly: true,
		secure: true,
		sameSite: 'strict' as const,
		maxAge: 60 * 60 * 2, // 2 hours
		path: '/'
	};
}
*/

// Temporary stubs for cookie functionality
export async function encryptCookie(payload: Record<string, any>): Promise<string> {
	return JSON.stringify(payload);
}

export async function decryptCookie(encrypted: string): Promise<Record<string, any> | null> {
	try {
		return JSON.parse(encrypted);
	} catch {
		return null;
	}
}

export function createSecureCookieOptions() {
	return {
		httpOnly: true,
		secure: false, // Set to true in production
		sameSite: 'strict' as const,
		maxAge: 60 * 60 * 2, // 2 hours
		path: '/'
	};
}
