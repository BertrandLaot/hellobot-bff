import { ApiProperty } from '@nestjs/swagger';

export class UserEmailNotificationsDto {
  @ApiProperty({ description: 'Notifications onboarding activées', example: true })
  onboarding: boolean;

  @ApiProperty({ description: 'Notifications médias activées', example: true })
  medias: boolean;

  @ApiProperty({ description: 'Notifications événements activées', example: false })
  events: boolean;

  @ApiProperty({ description: 'Notifications campagnes feedback activées', example: true })
  feedbackCampaigns: boolean;
}
