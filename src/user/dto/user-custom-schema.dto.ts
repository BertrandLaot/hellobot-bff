import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserCustomSchemaDto {
  @ApiProperty({ description: 'UID utilisateur', example: '123456' })
  uid: string;

  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  mail: string;

  @ApiProperty({ description: 'Manager', example: 'manager@example.com' })
  manager: string;

  @ApiProperty({ description: 'Prénom', example: 'John' })
  givenName: string;

  @ApiProperty({ description: 'Nom complet', example: 'John Doe' })
  cn: string;

  @ApiProperty({ description: 'Nom de famille', example: 'Doe' })
  sn: string;

  @ApiProperty({ description: 'Pays', example: 'FR' })
  co: string;

  @ApiPropertyOptional({ description: 'Photo JPEG encodée', example: '' })
  jpegPhoto?: string;

  @ApiProperty({ description: 'Catégorie métier', example: 'Developer' })
  businessCategory: string;

  @ApiProperty({ description: 'Date de début de contrat', example: '2024-01-01' })
  privContractStartDate: string;
}
