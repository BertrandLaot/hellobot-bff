import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Delete('cache')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vide entièrement le cache en mémoire' })
  @ApiResponse({
    status: 200,
    description: 'Cache vidé avec succès',
    schema: { example: { message: 'Cache cleared successfully' } },
  })
  async clearCache(): Promise<{ message: string }> {
    await this.adminService.clearCache();
    return { message: 'Cache cleared successfully' };
  }
}
