# Testes e métricas (backend)

## Testes unitários

```bash
cd apps/backend
npm test              # execução única
npm run test:watch    # modo watch
npm run test:coverage # relatório em ./coverage
```

A suíte cobre os padrões GoF do feed (Factory, Facade, Strategy), cache/ordenação em `PostService`, likes, serializer e métricas operacionais.

O arquivo `tests/unit/PostService.feed.test.js` documenta os cenários da funcionalidade evoluída (feed ordenável + Redis), alinhado à evidência de TDD pedida na disciplina.

## Métricas estáticas

```bash
npm run metrics
```

Gera:

- `reports/static-metrics.json`
- `reports/static-metrics.md`

Inclui complexidade ciclomática média, acoplamento (afferent/efferent) e coesão por camada (proxy via maintainability index).
