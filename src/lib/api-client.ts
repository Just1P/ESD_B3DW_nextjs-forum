/**
 * Client API de base pour standardiser les appels HTTP
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Client API centralisé avec gestion d'erreurs
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  /**
   * Construit l'URL avec les paramètres de requête
   */
  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = `${this.baseUrl}${path}`;

    if (!params) return url;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * Gère la réponse et les erreurs HTTP
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        errorData.error || errorData.message || "Une erreur est survenue",
        response.status,
        errorData
      );
    }

    // Gérer les réponses vides (204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  /**
   * Effectue une requête GET
   */
  async get<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      ...options,
      method: "GET",
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Effectue une requête POST
   */
  async post<T, D = unknown>(
    path: string,
    data?: D,
    options?: ApiRequestOptions
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Effectue une requête PATCH
   */
  async patch<T, D = unknown>(
    path: string,
    data?: D,
    options?: ApiRequestOptions
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      ...options,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Effectue une requête PUT
   */
  async put<T, D = unknown>(
    path: string,
    data?: D,
    options?: ApiRequestOptions
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Effectue une requête DELETE
   */
  async delete<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      ...options,
      method: "DELETE",
    });
    return this.handleResponse<T>(response);
  }
}

// Instance par défaut
export const apiClient = new ApiClient();
