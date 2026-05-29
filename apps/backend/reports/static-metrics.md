# Relatório de Métricas Estáticas

Gerado em: 2026-05-28T15:22:14.851Z

## Resumo

| Métrica | Valor |
| --- | --- |
| Arquivos analisados | 42 |
| Complexidade ciclomática média (por módulo) | 4.69 |
| Funções analisadas | 0 |
| Acoplamento efferente médio | 1.33 |
| Acoplamento afferente médio | 1.21 |
| Índice de instabilidade (Ce/(Ce+Ca)) | 0.52 |

## Coesão por camada (proxy via maintainability)

| Camada | Módulos | Maintainability médio | Coesão (proxy) |
| --- | --- | --- | --- |
| other | 14 | 122.09 | moderate |
| controllers | 5 | 107.77 | moderate |
| facades | 1 | 134.04 | single-responsibility module |
| factories | 1 | 126.41 | single-responsibility module |
| metrics | 1 | 128.15 | single-responsibility module |
| middlewares | 5 | 115.77 | moderate |
| models | 3 | 119.26 | high |
| repositories | 3 | 123.37 | high |
| serializers | 1 | 115.06 | single-responsibility module |
| services | 4 | 104.62 | high |
| strategies | 4 | 137.76 | high |

## Acoplamento entre camadas

- other -> other: 10 dependência(s)
- other -> middlewares: 7 dependência(s)
- controllers -> services: 4 dependência(s)
- controllers -> metrics: 1 dependência(s)
- facades -> factories: 1 dependência(s)
- facades -> repositories: 1 dependência(s)
- factories -> strategies: 3 dependência(s)
- middlewares -> other: 2 dependência(s)
- middlewares -> metrics: 1 dependência(s)
- repositories -> models: 4 dependência(s)
- other -> controllers: 5 dependência(s)
- services -> models: 1 dependência(s)
- services -> other: 7 dependência(s)
- services -> repositories: 3 dependência(s)
- services -> facades: 1 dependência(s)
- services -> serializers: 1 dependência(s)
- services -> metrics: 1 dependência(s)
- strategies -> strategies: 3 dependência(s)

## Top 10 módulos por complexidade ciclomática

| Módulo | CC | Maintainability | LOC lógicas |
| --- | --- | --- | --- |
| services/PostService.js | 24 | 92.84 | 140 |
| controllers/PostController.js | 19 | 89.26 | 110 |
| middlewares/SchemaValidator.js | 12 | 109.86 | 45 |
| services/UserService.js | 12 | 112.56 | 33 |
| metrics/MetricsService.js | 8 | 128.15 | 22 |
| controllers/UserController.js | 7 | 90.08 | 62 |
| schemas/UserSchema.js | 7 | 111.68 | 58 |
| serializers/PostSerializer.js | 7 | 115.06 | 23 |
| config/redis.js | 6 | 120.25 | 22 |
| models/User.js | 6 | 122.12 | 23 |
