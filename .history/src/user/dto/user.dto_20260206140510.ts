import { ApiProperty } from '@nestjs/swagger';
import { UserMetaDto } from './user-meta.dto';
import { UserCustomSchemaDto } from './user-custom-schema.dto';
import { UserEmailNotificationsDto } from './user-email-notifications.dto';
import { UniverseLightDto } from './universe-light.dto';

export class UserDto {
  @ApiProperty({ description: 'Titre/Poste', example: 'Developer' })
  title: string;

  @ApiProperty({ description: 'Langue préférée', example: 'fr' })
  preferredLanguage: string;

  @ApiProperty({ description: 'Métadonnées utilisateur', type: UserMetaDto })
  meta: UserMetaDto;

  @ApiProperty({ description: 'ID utilisateur', example: '123456' })
  id: string;

  @ApiProperty({ description: 'Schémas SCIM', example: ['urn:scim:schemas:core:1.0'] })
  schemas: string[];

  @ApiProperty({ 
    description: 'Extension custom SCIM', 
    type: UserCustomSchemaDto,
    name: 'urn:scim:schemas:extension:custom:1.0'
  })
  'urn:scim:schemas:extension:custom:1.0': UserCustomSchemaDto;

  @ApiProperty({ description: 'Univers de l\'utilisateur', type: UniverseLightDto })
  universe: UniverseLightDto;

  @ApiProperty({ description: 'Est administrateur', example: false })
  isAdmin: boolean;

  @ApiProperty({ description: 'A accepté les cookies', example: true })
  hasAcceptedCookies: boolean;

  @ApiProperty({ description: 'Préférences notifications email', type: UserEmailNotificationsDto })
  emailNotifications: UserEmailNotificationsDto;
}
