# DashDm — Apresentador da Daily

Aplicação Angular para exibir quem apresenta a reunião daily. Lista circular ordenada alfabeticamente, avanço automático um por dia e opção de pular para o próximo. Persistência via `data.json` no repositório + `localStorage` para o índice atual.

## Dados (data.json)

A lista de nomes e o estado inicial vêm de `public/data.json`. Edite esse arquivo no repositório para alterar os nomes. O índice atual (quem está na frente) e a data do último avanço são guardados no `localStorage` do navegador (por dispositivo).

Exemplo de `public/data.json`:

```json
{
  "names": ["Ana", "Bruno", "Carla", "Diego", "Elena"],
  "currentIndex": 0,
  "lastAdvancedDate": "2025-02-26"
}
```

- **names:** lista de nomes (será ordenada alfabeticamente ao carregar).
- **currentIndex:** índice inicial do apresentador (0 = primeiro da lista).
- **lastAdvancedDate:** data ISO do último avanço automático (usado para avançar um por dia).

## Deploy no GitHub Pages

- O build de produção usa `baseHref: "/dash-dm/"`. Se o repositório tiver outro nome, altere em `angular.json` (configuração `production` → `baseHref`) para `"/seu-repo/"`.
- O workflow `.github/workflows/deploy-pages.yml` faz o deploy ao dar push na branch `main`. Ative GitHub Pages no repositório (Settings → Pages → Source: GitHub Actions).

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
