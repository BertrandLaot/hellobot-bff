# HelloBot BFF

Backend For Frontend pour l'API Developer Hub.

## Description

Ce projet est un BFF (Backend For Frontend) NestJS qui sert de proxy intelligent entre le frontend et l'API Developer Hub (http://192.168.1.20:8080/api). Il gère l'authentification via bearer token, expose des routes publiques sélectives, et implémente un système de cache quotidien pour optimiser les performances.

## Architecture

### Structure du projet

```
src/
├── backend-api/          # Module central pour communication avec l'API backend
│   ├── backend-api.service.ts         # Service HTTP avec bearer auth
│   ├── backend-api.module.ts          # Module d'export
│   └── interceptors/
│       └── bearer-token.interceptor.ts # Intercepteur pour injection du token
├── products/             # Module Products
│   ├── products.controller.ts         # GET /products/:id
│   ├── products.service.ts
│   ├── products.module.ts
│   └── dto/
│       └── product.dto.ts
├── modules/              # Module Modules
│   ├── modules.controller.ts          # GET /modules/:id
│   ├── modules.service.ts
│   ├── modules.module.ts
│   └── dto/
│       └── module.dto.ts
├── app.module.ts         # Module racine avec cache global
└── main.ts               # Bootstrap avec Swagger
```

### Fonctionnalités

- ✅ **Authentification automatique**: Bearer token injecté automatiquement dans toutes les requêtes backend
- ✅ **Cache intelligent**: Cache en mémoire avec TTL de 24 heures pour optimiser les performances
- ✅ **Documentation Swagger**: Interface de test et documentation automatique des routes
- ✅ **Validation**: Validation automatique des requêtes avec `class-validator`
- ✅ **Gestion d'erreurs**: Transformation des erreurs backend en réponses appropriées

## Installation

### Prérequis

- Node.js >= 18
- npm >= 9

### Étapes

1. **Cloner le repository**
```bash
git clone <repository-url>
cd hellobot-bff
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Éditer `.env` et renseigner:
```env
BACKEND_API_URL=http://192.168.1.20:8080/api
BACKEND_BEARER_TOKEN=votre_token_ici
PORT=3000
CACHE_TTL=86400
```

4. **Lancer l'application**
```bash
# Mode développement (avec hot-reload)
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

## Utilisation

### Endpoints disponibles

Une fois l'application lancée, les endpoints suivants sont disponibles:

- **Swagger UI**: http://localhost:3000/api
- **Health check**: http://localhost:3000
- **Products**: `GET http://localhost:3000/products/:id`
- **Modules**: `GET http://localhost:3000/modules/:id`

### Exemples de requêtes

#### Récupérer un produit
```bash
curl http://localhost:3000/products/507f1f77bcf86cd799439011
```

#### Récupérer un module
```bash
curl http://localhost:3000/modules/507f1f77bcf86cd799439012
```

## Développement

### Ajouter un nouveau endpoint

1. **Créer le module**
```bash
# Structure manuelle recommandée
mkdir -p src/mon-module/dto
touch src/mon-module/mon-module.module.ts
touch src/mon-module/mon-module.service.ts
touch src/mon-module/mon-module.controller.ts
touch src/mon-module/dto/mon-dto.dto.ts
```

2. **Créer le DTO** (`src/mon-module/dto/mon-dto.dto.ts`)
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MonDto {
  @ApiProperty({ description: 'ID de la ressource' })
  @IsString()
  _id: string;

  @ApiProperty({ description: 'Nom de la ressource' })
  @IsString()
  name: string;
}
```

3. **Créer le service** (`src/mon-module/mon-module.service.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { BackendApiService } from '../backend-api/backend-api.service';
import { MonDto } from './dto/mon-dto.dto';

@Injectable()
export class MonModuleService {
  constructor(private readonly backendApiService: BackendApiService) {}

  async findOne(id: string): Promise<MonDto> {
    return this.backendApiService.get<MonDto>(`/mon-endpoint/${id}`);
  }
}
```

4. **Créer le contrôleur** (`src/mon-module/mon-module.controller.ts`)
```typescript
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MonModuleService } from './mon-module.service';

@ApiTags('mon-module')
@Controller('mon-module')
@UseInterceptors(CacheInterceptor)  // Active le cache 24h
export class MonModuleController {
  constructor(private readonly monModuleService: MonModuleService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Récupère une ressource par ID' })
  async findOne(@Param('id') id: string) {
    return this.monModuleService.findOne(id);
  }
}
```

5. **Créer le module** (`src/mon-module/mon-module.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { MonModuleController } from './mon-module.controller';
import { MonModuleService } from './mon-module.service';
import { BackendApiModule } from '../backend-api/backend-api.module';

@Module({
  imports: [BackendApiModule],
  controllers: [MonModuleController],
  providers: [MonModuleService],
  exports: [MonModuleService],
})
export class MonModuleModule {}
```

6. **Importer dans AppModule** (`src/app.module.ts`)
```typescript
import { MonModuleModule } from './mon-module/mon-module.module';

@Module({
  imports: [
    // ... autres imports
    MonModuleModule,
  ],
})
export class AppModule {}
```

### Scripts disponibles

```bash
npm run start          # Démarre l'application
npm run start:dev      # Mode développement avec hot-reload
npm run start:prod     # Mode production
npm run build          # Compilation TypeScript
npm run lint           # Vérification du code
npm run format         # Formatage du code
npm run test           # Tests unitaires
npm run test:e2e       # Tests end-to-end
npm run test:cov       # Tests avec couverture
```

## Cache

Le système de cache utilise `@nestjs/cache-manager` avec les caractéristiques suivantes:

- **Type**: En mémoire (cache-manager)
- **TTL global**: 24 heures (86400000 ms)
- **Activation**: Via le décorateur `@UseInterceptors(CacheInterceptor)` sur les contrôleurs
- **Invalidation**: Automatique après 24h, ou redémarrage de l'application

Pour désactiver le cache sur un endpoint spécifique, retirer le décorateur `@UseInterceptors(CacheInterceptor)`.

## API Backend

L'API backend Developer Hub est disponible à:
- **URL**: http://192.168.1.20:8080/api
- **Swagger**: http://192.168.1.20:8080/api
- **Authentification**: Bearer token (configuré dans `.env`)

Le BFF se charge automatiquement d'ajouter le bearer token à toutes les requêtes vers le backend.

## Prochaines étapes

- Ajouter des routes d'agrégation (ex: `GET /products/:id/with-modules`)
- Créer des routes custom métier combinant plusieurs appels backend
- Implémenter des endpoints supplémentaires selon les besoins
- Ajouter des tests unitaires et e2e
- Optimiser le cache avec Redis en production

## Support

Pour toute question ou problème, consulter:
- La documentation Swagger: http://localhost:3000/api
- Les fichiers de plan d'itération: `.github/iteration-*.md`
- Les instructions Copilot: `.github/copilot-instructions.md`
