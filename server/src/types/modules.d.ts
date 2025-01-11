declare module 'bcrypt' {
	export function hash(
		data: string,
		saltOrRounds: string | number
	): Promise<string>;
	export function compare(data: string, encrypted: string): Promise<boolean>;
}

declare module 'jsonwebtoken' {
	export function sign(
		payload: any,
		secretOrPrivateKey: string,
		options?: any
	): string;
	export function verify(
		token: string,
		secretOrPublicKey: string,
		callback?: (error: any, decoded: any) => void
	): any;
}
