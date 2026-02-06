# Itération 2 - Extension du BFF avec routes avancées

## Objectif
Étendre le BFF avec les endpoints les plus utilisés de l'API Developer Hub : User, Modules avancés, Categories, et routes d'agrégation.

## Endpoints à implémenter

### 1. Module User (`/user/*`)
Routes prioritaires pour la gestion utilisateur :
- ✅ `GET /user/:ldap` - Informations globales utilisateur
- ✅ `GET /user/:ldap/watchLater` - Liste des modules "À voir plus tard"
- ✅ `POST /user/:ldap/watchLater` - Ajouter un module à watchLater
- ✅ `DELETE /user/:ldap/watchLater/:moduleId` - Retirer un module de watchLater

### 2. Module Modules - Routes avancées
Extension des fonctionnalités modules :
- ✅ `GET /modules` - Liste paginée avec filtres (catégories, niveaux, types, durée, langues, statuts, tri)
- ✅ `GET /modules/latest` - X derniers modules (paramètre limit)
- ✅ `GET /modules/popular` - 10 modules les plus populaires
- ✅ `GET /modules/forwarded` - Modules transférés

### 3. Module Categories
Gestion des catégories de modules :
- ✅ `GET /categories` - Toutes les catégories
- ✅ `GET /categories/beginner` - Catégories pour débutants avec comptage
- ✅ `GET /categories/:id` - Détails d'une catégorie

### 4. Routes d'agrégation
Routes custom combinant plusieurs appels backend :
- ✅ `GET /products/:id/with-modules` - Produit avec tous ses modules liés

## DTOs à créer

### User
```typescript
UserDto {
  title: string
  preferredLanguage: string
  meta: UserMeta
  id: string
  schemas: string[]
  'urn:scim:schemas:extension:custom:1.0': UserCustomSchema
  universe: Universe
  isAdmin: boolean
  hasAcceptedCookies: boolean
  emailNotifications: UserEmailNotifications
}

WatchLaterDto {
  moduleId: string
}

ModuleLightDto {
  _id: string
  title: string
  type: string
  // ... autres champs light
}
```

### Modules (étendu)
```typescript
ModuleQueryDto {
  page: number
  limit: number
  onlySelectedUniverse?: boolean
  query?: string
  categories: string[]
  levels: string[]
  types: string[]
  duration: string[]
  langKeys: string[]
  status?: string
  sortBy?: string
  sortOrder?: string
  // ... autres filtres
}
```

### Categories
```typescript
CategoryResponseDto {
  _id: string
  label: string
}

BeginnerCategoryResponseDto {
  category: CategoryResponseDto
  nbModules: number
}
```

### Aggregation
```typescript
ProductWithModulesDto {
  product: ProductDto
  modules: ModuleLightDto[]
}
```

## Architecture

### Structure des nouveaux modules
```
src/
├── user/
│   ├── user.module.ts
│   ├── user.service.ts
│   ├── user.controller.ts
│   └── dto/
│       ├── user.dto.ts
│       ├── watch-later.dto.ts
│       └── user-meta.dto.ts
├── categories/
│   ├── categories.module.ts
│   ├── categories.service.ts
│   ├── categories.controller.ts
│   └── dto/
│       ├── category-response.dto.ts
│       └── beginner-category-response.dto.ts
├── modules/
│   ├── dto/
│   │   ├── module-query.dto.ts (nouveau)
│   │   └── module-light.dto.ts (nouveau)
│   └── modules.controller.ts (étendu)
├── products/
│   ├── dto/
│   │   └── product-with-modules.dto.ts (nouveau)
│   └── products.controller.ts (étendu)
└── app.module.ts (mis à jour)
```

## Fonctionnalités par module

### UserModule
- Service utilisant `BackendApiService` pour tous les appels
- Cache 24h sur les routes GET
- Validation des paramètres (ldap en nombre)
- Documentation Swagger complète

### CategoriesModule
- Routes read-only (GET uniquement)
- Cache 24h pour optimiser performances
- DTOs mappés depuis les schémas backend

### ModulesModule (étendu)
- Query params complexes avec validation
- Transformation des filtres en query string
- Gestion de la pagination
- Cache intelligent selon les filtres

### ProductsModule (route d'agrégation)
- Appel combiné : `/products/:id` + `/products/:id/modules`
- Assemblage des données côté BFF
- Cache 24h sur le résultat agrégé
- Gestion d'erreurs si produit ou modules introuvables

## Avantages de cette itération

1. **User-centric** : Endpoints essentiels pour l'expérience utilisateur
2. **Performance** : Cache 24h sur toutes les routes GET
3. **Agrégation** : Réduction des appels depuis le frontend
4. **Filtrage avancé** : Recherche et filtres sur modules
5. **Documentation** : Swagger complet pour tous les nouveaux endpoints

## Tests manuels

Une fois l'implémentation terminée :
```bash
# Lancer le BFF
npm run start:dev

# Tester User
curl http://localhost:3000/user/12345
curl http://localhost:3000/user/12345/watchLater

# Tester Modules
curl "http://localhost:3000/modules?page=1&limit=10&categories[]=web&levels[]=beginner"
curl http://localhost:3000/modules/latest?limit=5
curl http://localhost:3000/modules/popular

# Tester Categories
curl http://localhost:3000/categories
curl http://localhost:3000/categories/beginner

# Tester agrégation
curl http://localhost:3000/products/123/with-modules
```

## Prochaines étapes (Itération 3)

- Routes Onboarding (création, templates, suivi)
- Routes Events (liste, filtres, inscriptions)
- Routes Feedback Campaigns
- Tests unitaires et e2e
- Métriques et monitoring
