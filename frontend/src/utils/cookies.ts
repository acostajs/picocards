/**
 * Shared utility functions for managing browser cookies.
 */

export function getCookie(name: string): string | null {
    if (typeof document === "undefined") {
        return null;
    }
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    for (const cookie of cookies) {
        const parts = cookie.split("=");
        const key = parts[0];
        const value = parts[1];
        if (key === name && value !== undefined) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

export function deleteCookie(name: string): void {
    if (typeof document === "undefined") {
        return;
    }
    // Delete for root subdomain
    // biome-ignore lint/suspicious/noDocumentCookie: Purge root-domain SSO cookie on logout.
    document.cookie = `${name}=; path=/; domain=.hub.ca; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    // Delete for local current domain
    // biome-ignore lint/suspicious/noDocumentCookie: Purge local domain SSO cookie on logout.
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}
