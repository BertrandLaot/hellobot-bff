import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { UrlMappingConfigDto } from './dto/url-mapping.dto';

@Injectable()
export class ConfigService {
  private readonly configPath: string;

  constructor() {
    // Path to the url-mapping.json file in the hello-bot-plan project
    this.configPath = join(
      process.cwd(),
      '..',
      'hello-bot-plan',
      'public',
      'config',
      'url-mapping.json',
    );
  }

  /**
   * Récupère la configuration du mapping d'URLs pour le widget
   */
  getUrlMappingConfig(): UrlMappingConfigDto {
    try {
      const fileContent = readFileSync(this.configPath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      throw new Error(`Failed to load URL mapping configuration: ${error.message}`);
    }
  }
}
