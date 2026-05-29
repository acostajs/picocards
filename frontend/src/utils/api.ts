const BASE_URL = "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const headers = new Headers(options.headers);

    if (options.body && !(options.body instanceof FormData)) {
        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
    }

    const config: RequestInit = {
        ...options,
        headers,
        credentials: "include", // Essential for cross-origin SSO session cookie sharing
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
        try {
            const data = await response.json();
            if (data?.detail) {
                errorMsg = data.detail;
            }
        } catch {}
        throw new Error(errorMsg);
    }

    if (response.status === 204) {
        return null as unknown as T;
    }

    try {
        return await response.json();
    } catch {
        return null as unknown as T;
    }
}

export const api = {
    get: <T>(path: string, options?: RequestInit): Promise<T> =>
        request<T>(path, { ...options, method: "GET" }),
    post: <T>(
        path: string,
        body?: unknown,
        options?: RequestInit,
    ): Promise<T> =>
        request<T>(path, {
            ...options,
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        }),
    put: <T>(path: string, body?: unknown, options?: RequestInit): Promise<T> =>
        request<T>(path, {
            ...options,
            method: "PUT",
            body: body ? JSON.stringify(body) : undefined,
        }),
    delete: <T>(path: string, options?: RequestInit): Promise<T> =>
        request<T>(path, { ...options, method: "DELETE" }),
};
