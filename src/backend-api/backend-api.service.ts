import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class BackendApiService {
  private readonly baseUrl: string;
  private readonly bearerToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('BACKEND_API_URL');
    this.bearerToken = this.configService.get<string>('BACKEND_BEARER_TOKEN');

    if (!this.baseUrl) {
      throw new Error('BACKEND_API_URL is not defined in environment variables');
    }
    if (!this.bearerToken) {
      throw new Error('BACKEND_BEARER_TOKEN is not defined in environment variables');
    }
  }

  /**
   * Effectue une requête GET vers l'API backend
   */
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.bearerToken}`,
      ...config?.headers,
    };

    const response = await firstValueFrom(
      this.httpService.get<T>(url, { ...config, headers }),
    );

    return response.data;
  }

  /**
   * Effectue une requête POST vers l'API backend
   */
  async post<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.bearerToken}`,
      ...config?.headers,
    };

    const response = await firstValueFrom(
      this.httpService.post<T>(url, data, { ...config, headers }),
    );

    return response.data;
  }

  /**
   * Effectue une requête PUT vers l'API backend
   */
  async put<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.bearerToken}`,
      ...config?.headers,
    };

    const response = await firstValueFrom(
      this.httpService.put<T>(url, data, { ...config, headers }),
    );

    return response.data;
  }

  /**
   * Effectue une requête PATCH vers l'API backend
   */
  async patch<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.bearerToken}`,
      ...config?.headers,
    };

    const response = await firstValueFrom(
      this.httpService.patch<T>(url, data, { ...config, headers }),
    );

    return response.data;
  }

  /**
   * Effectue une requête DELETE vers l'API backend
   */
  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.bearerToken}`,
      ...config?.headers,
    };

    const response = await firstValueFrom(
      this.httpService.delete<T>(url, { ...config, headers }),
    );

    return response.data;
  }
}
