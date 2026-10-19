const ONE_YEAR = 60 * 60 * 24 * 365;

export const getCookie = (name: string): string | undefined => {
	const match = document.cookie.match(
		new RegExp(`(?:^|; )${name}=([^;]*)`)
	);
	return match ? decodeURIComponent(match[1]) : undefined;
};

export const setCookie = (name: string, value: string): void => {
	document.cookie = `${name}=${encodeURIComponent(
		value
	)};max-age=${ONE_YEAR};path=/;samesite=lax`;
};
