# Public repository scope

This repository follows a deny-by-default publication policy: when ownership, sensitivity, or operational impact is uncertain, exclude the material.

## Allowed

- The explicitly authorized, client-side ArcVelocity homepage presentation source.
- Generic documentation about local development and the public repository boundary.
- Public business links already intended for broad distribution.
- Dependencies required to lint and statically build the project.
- ArcVelocity brand marks, homepage media, and public-page captures only when explicitly approved, metadata-cleaned, and integrity-locked in `public/asset-manifest.json`.

## Prohibited

- Any secret, credential, token, key, cookie, session value, environment value, or credential fingerprint.
- Account, customer, manager, campaign, deployment, tenant, project, resource, stream, messaging, telephony, or analytics identifiers.
- Customer, lead, reviewer, employee, contractor, or private contact data.
- Property imagery, GPS metadata, addresses, project records, or other location-specific evidence.
- Production source outside the approved homepage presentation boundary, route handlers, server actions, webhooks, dashboards, authentication, rate limits, infrastructure topology, runbooks, rollback procedures, or incident evidence.
- Advertising strategy, budgets, bids, spend, conversion data, search terms, negative keywords, campaign structure, or mutation tooling.
- Images, video, audio, copy, reviews, logos, or trademarks without documented authorization for repository redistribution.
- Git history from the production repository or any file outside the explicitly authorized homepage presentation boundary.

## Change review

Before committing:

1. Confirm the change is necessary for the public showcase.
2. Confirm every value and asset is intended for unlimited public access.
3. Search the complete staged diff for secrets, identifiers, personal data, and metadata.
4. Run `npm run safety`, `npm run lint`, `npm run build`, and `npm audit`.
5. Prefer deletion over redaction when context is unnecessary.

If any check is uncertain, do not merge the change.
