# Contributing

Contributions must preserve the strict public/private boundary described in [PUBLIC-SCOPE.md](PUBLIC-SCOPE.md).

Before opening a pull request:

```bash
npm ci
npm run safety
npm run lint
npm run build
npm audit
```

Do not submit production code outside the authorized homepage boundary, data, unapproved screenshots or media, logs, environment files, account identifiers, operational documentation, or copied history. Every permitted binary must be explicitly reviewed and integrity-locked in `public/asset-manifest.json`. Public issues and pull requests are permanently unsuitable for sensitive reports; use the process in [SECURITY.md](SECURITY.md).
