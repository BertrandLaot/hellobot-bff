## Spécifications techniques
- Développement en NestJS
- Fichier de plan créé pour chaque itération dans `.github/iteration-{N}.md`
- Commits à chaque itération avec messages descriptifs

## Architecture BFF

### Structure du projet
```
src/
├── backend-api/          # Module central pour communication avec l'API backend
│   ├── backend-api.service.ts    # Service HTTP avec bearer auth
│   └── interceptors/             # Intercepteur pour injection du token
├── products/             # Module Products
│   ├── products.controller.ts    # GET /products/:id, GET /products/:id/with-modules
│   └── dto/
│       ├── product.dto.ts
│       └── product-with-modules.dto.ts
├── modules/              # Module Modules
│   ├── modules.controller.ts     # GET /modules/:id, GET /modules, GET /modules/latest, etc.
│   └── dto/
│       ├── module.dto.ts
│       └── module-query.dto.ts
├── user/                 # Module User
│   ├── user.controller.ts        # GET /user/:ldap, GET/POST/DELETE watchLater
│   └── dto/
│       ├── user.dto.ts
│       └── watch-later.dto.ts
├── categories/           # Module Categories
│   ├── categories.controller.ts  # GET /categories, GET /categories/beginner, etc.
│   └── dto/
│       ├── category-response.dto.ts
│       └── beginner-category-response.dto.ts
├── app.module.ts         # Module racine avec cache global
└── main.ts               # Bootstrap avec Swagger
```

### BackendApiService
- Service centralisé pour tous les appels vers http://192.168.1.20:8080/api
- Injection automatique du bearer token via `Authorization: Bearer ${token}`
- Méthodes: `get()`, `post()`, `put()`, `patch()`, `delete()`
- Configuration via variables d'environnement

### Cache
- **Implémentation**: `@nestjs/cache-manager` en mémoire
- **TTL**: 24 heures (86400000 ms)
- **Usage**: Décorateur `@UseInterceptors(CacheInterceptor)` sur les contrôleurs
- Invalidation automatique quotidienne via `@nestjs/schedule`

### Modules exposés
- **ProductsModule**: 
  - `GET /products/:id` - Récupère un produit depuis le backend
  - `GET /products/:id/with-modules` - Produit avec tous ses modules liés (agrégation)
- **ModulesModule**: 
  - `GET /modules/:id` - Récupère un module depuis le backend
  - `GET /modules` - Liste paginée avec filtres complexes
  - `GET /modules/latest` - X derniers modules
  - `GET /modules/popular` - 10 modules les plus populaires
  - `GET /modules/forwarded` - Modules transférés
- **UserModule**:
  - `GET /user/:ldap` - Informations globales utilisateur
  - `GET /user/:ldap/watchLater` - Liste "À voir plus tard"
  - `POST /user/:ldap/watchLater` - Ajouter module à watchLater
  - `DELETE /user/:ldap/watchLater/:moduleId` - Retirer module de watchLater
- **CategoriesModule**:
  - `GET /categories` - Toutes les catégories
  - `GET /categories/beginner` - Catégories débutant avec comptage
  - `GET /categories/:id` - Détails d'une catégorie

## Patterns de développement

### Variables d'environnement (.env)
```env
BACKEND_API_URL=http://192.168.1.20:8080/api
BACKEND_BEARER_TOKEN=your_token_here
PORT=3000
CACHE_TTL=86400
```

### Créer un nouveau DTO
1. Analyser le schéma Swagger du backend
2. Créer le DTO dans `src/{module}/dto/{name}.dto.ts`
3. Utiliser `class-validator` pour validation
4. Documenter avec `@ApiProperty`

### Ajouter un nouveau endpoint
1. Créer module: `src/{name}/{name}.module.ts`
2. Créer service: injecter `BackendApiService`, appeler endpoint backend
3. Créer contrôleur: ajouter `@UseInterceptors(CacheInterceptor)` pour cache 24h
4. Documenter avec Swagger (`@ApiTags`, `@ApiOperation`)
5. Importer dans `AppModule`

### Appel à l'API backend
```typescript
// Dans un service
constructor(private readonly backendApiService: BackendApiService) {}

async getData(id: string) {
  return thi
  - GET http://localhost:3000/products/:id
  - GET http://localhost:3000/products/:id/with-modules
- Modules: 
  - GET http://localhost:3000/modules/:id
  - GET http://localhost:3000/modules?page=1&limit=10&...
  - GET http://localhost:3000/modules/latest?limit=10
  - GET http://localhost:3000/modules/popular
  - GET http://localhost:3000/modules/forwarded
- User:
  - GET http://localhost:3000/user/:ldap
  - GET http://localhost:3000/user/:ldap/watchLater
  - POSTproducts/:id/with-modules` - Produit + modules liés (agrégation avec cache 24h)
- `GET /modules/:id` - Détails d'un module (avec cache 24h)
- `GET /modules` - Liste paginée de modules avec filtres (avec cache 24h)
- `GET /mOnboarding (création, templates, suivi)
- Routes Events (liste, filtres, inscriptions)
- Routes Feedback Campaigns
- Routes custom métier combinant plusieurs appels backend
- Tests unitaires et e2e
- Métriques et monitoringc cache 24h)
- `GET /user/:ldap` - Infos utilisateur (avec cache 24h)
- `GET /user/:ldap/watchLater` - WatchList utilisateur (avec cache 24h)
- `POST /user/:ldap/watchLater` - Ajouter à watchList
- `DELETE /user/:ldap/watchLater/:moduleId` - Retirer de watchList
- `GET /categories` - Toutes les catégories (avec cache 24h)
- `GET /categories/beginner` - Catégories débutant (avec cache 24h)
- `GET /categories/:id` - Détails catégori/watchLater
  - DELETE http://localhost:3000/user/:ldap/watchLater/:moduleId
- Categories:
  - GET http://localhost:3000/categories
  - GET http://localhost:3000/categories/beginner
  - GET http://localhost:3000/categori
```

## Workflows

### Développement
```bash
npm install              # Installation des dépendances
cp .env.example .env     # Configurer les variables d'environnement
npm run start:dev        # Lancement en mode watch
```

### Endpoints disponibles
- Swagger UI: http://localhost:3000/api
- Health: http://localhost:3000
- Products: GET http://localhost:3000/products/:id
- Modules: GET http://localhost:3000/modules/:id

## Spécifications fonctionnelles

### API Backend
- **URL**: http://192.168.1.20:8080/api
- **Auth**: Bearer token configuré dans .env
- **Swagger**: http://192.168.1.20:8080/api (documentation complète)

### Routes publiques actuelles
- `GET /products/:id` - Détails d'un produit (avec cache 24h)
- `GET /modules/:id` - Détails d'un module (avec cache 24h)

### Prochaines itérations
- Routes d'agrégation (ex: product avec ses modules)
- Routes custom métier combinant plusieurs appels backend
- Endpoints supplémentaires du backend selon besoins