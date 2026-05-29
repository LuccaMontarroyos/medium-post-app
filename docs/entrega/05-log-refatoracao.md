# 5. Log de Refatoração

Este capítulo documenta a evolução do código do fluxo de **listagem do feed**, onde os smells eram mais evidentes antes da aplicação dos padrões GoF e da separação em camadas.

---

## 5.1 Smell: método longo + condicionais de ordenação (Long Method / Switch Statements)

### Antes (código legado — estrutura típica pré-refatoração)

O serviço ou controller concentrava consulta Sequelize, escolha de `order`, includes, contagem de likes e montagem do JSON em um único bloco:

```javascript
// PostService ou PostController — ANTES (trecho representativo)
async listPosts({ limit, cursor, search, sort }) {
  const where = buildWhere(cursor, search);

  let order;
  if (sort === "most_liked") {
    order = [[literal('"totalLikes"'), "DESC"]];
  } else if (sort === "trending") {
    order = [[literal('"totalLikes"'), "DESC"]], ["post_date", "DESC"]];
  } else {
    order = [["post_date", "DESC"], ["id", "DESC"]];
  }

  const posts = await Post.findAll({
    where,
    include: [{ model: User, as: "users" }],
    attributes: { include: [/* subqueries de likes */] },
    order,
    limit,
  });

  const formatted = posts.map((post) => ({
    id: post.id,
    title: post.title,
    image: post.image ? `${backendUrl}${post.image}` : null,
    totalLikes: Number(post.totalLikes || 0),
    allowEdit: currentUserId === post.user_id,
    // ... mais campos
  }));

  return { posts: formatted, nextCursor: buildCursor(posts) };
}
```

**Problemas:**

- Violação de **SRP** (persistência + regra de ordenação + apresentação).
- Dificuldade de testar ordenações isoladamente.
- Risco de **Shotgun Surgery** ao adicionar novo `sort`.

### Depois (código atual)

**Técnicas aplicadas:** *Replace Conditional with Strategy*, *Extract Class* (Repository, Serializer), *Facade*.

```javascript
// PostService.js — DEPOIS (trecho)
const posts = await FeedFacade.getFeed(sort, {
  where,
  attributesToInclude,
  limit,
  currentUserId,
});

const formatted = PostSerializer.serializeMany(
  posts,
  currentUserId,
  backendUrl,
);
```

```javascript
// NewestPostsStrategy.js — DEPOIS
class NewestPostsStrategy extends FeedStrategy {
  async execute(repository, params) {
    return repository.findPosts({
      ...params,
      order: [["post_date", "DESC"], ["id", "DESC"]],
    });
  }
}
```

**Ganhos:** cada ordenação em uma classe; testes unitários por estratégia; `PostService` mais legível.

---

## 5.2 Smell: acesso direto ao ORM fora do especialista (Feature Envy)

### Antes

```javascript
// Controller chamando model diretamente — ANTES
const posts = await Post.findAll({ /* ... */ });
```

### Depois

**Técnica:** *Move Method* → `PostRepository.findPosts`.

```javascript
// PostRepository.js — DEPOIS
async findPosts({ where, attributesToInclude, limit, order }) {
  return Post.findAll({
    where,
    include: [{ model: User, as: "users", attributes: ["id", "name", "email"] }],
    attributes: { include: attributesToInclude },
    order,
    limit,
    subQuery: false,
  });
}
```

**Ganho:** GRASP **Information Expert** — o repositório é o especialista em como ler posts.

---

## 5.3 Smell: formatação duplicada da resposta (Duplicate Code)

### Antes

Mapeamento manual repetido em listagem e detalhe do post.

### Depois

**Técnica:** *Extract Class* → `PostSerializer`.

```javascript
// PostSerializer.js — DEPOIS
serialize(post, currentUserId, backendUrl) {
  const data = post.toJSON();
  return {
    id: data.id,
    title: data.title,
    image: data.image ? `${backendUrl}${data.image}` : null,
    totalLikes: Number(data.totalLikes || 0),
    allowEdit: currentUserId === data.user_id,
    // ...
  };
}
```

**Ganho:** um único ponto para alterar contrato da API.

---

## 5.4 Smell: acoplamento do serviço às estratégias concretas

### Antes (hipotético após primeiro corte)

```javascript
const strategy = sort === "most_liked"
  ? new MostLikedPostsStrategy()
  : new NewestPostsStrategy();
await strategy.execute(PostRepository, params);
```

### Depois

**Técnicas:** *Factory Method* + *Facade*.

```javascript
// FeedFacade.js
const strategy = FeedStrategyFactory.create(sort);
return strategy.execute(PostRepository, params);
```

**Ganho:** `PostService` depende apenas de `FeedFacade.getFeed`.

---

## 5.5 Métrica antes/depois (indicativo)

| Aspecto | Antes (estimado) | Depois (medido) |
|---------|------------------|-----------------|
| Classes no fluxo do feed | 1–2 arquivos monolíticos | 8+ módulos coesos |
| CC de `PostService` | Concentrada em um método | CC módulo = 24, mas ordenação externalizada |
| Testabilidade da ordenação | Apenas via HTTP/DB | Testes isolados em `feedStrategies.test.js` |
| Acoplamento efferente médio do projeto | — | 1,33 (relatório estático) |

---

## 5.6 Prints para o PDF

> **[INSERIR FIGURA 8]** — Screenshot do trecho “Antes” (pode ser o bloco da seção 5.1 formatado no PDF).  
> **[INSERIR FIGURA 9]** — Screenshot do arquivo real `NewestPostsStrategy.js` + `FeedFacade.js` no IDE.

*Nota para a equipe:* se houver commit antigo no Git com o código anterior, preferir print do `git show <commit>:path` como evidência autêntica; caso contrário, o trecho “Antes” representativo acima descreve fielmente a estrutura substituída.
