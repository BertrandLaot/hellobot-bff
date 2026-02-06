import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WatchLaterDto {
  @ApiProperty({ description: 'ID du module à ajouter', example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  moduleId: string;
}
