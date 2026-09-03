# 3 September 2026 — Primary corroboration source expansion

## Measured production constraint

Recovery run `33717576889`, using the stricter cross-source evidence contract from PR #401, discovered 177 leads from 25 successful sources and built 10 corroborated candidates. The evidence gate correctly rejected the measured generic fixture-index candidate and the mixed Caelan Doris / Triston Reilly candidate before model spend, but only four candidates remained eligible. The workflow therefore failed closed before generation and Zoho was not sent.

The run demonstrated that the stricter gate is working, but also showed that current discovery lacks primary-source depth for some genuinely current Australian stories already present in the candidate pool.

## Evidence for source expansion

Current 3 September reporting includes:

- ACT Brumbies official coverage naming Triston Reilly captain of the First Nations & Pasifika XV for the Tonga President's XV clash; and
- Western Force official confirmation of James O'Connor's 2027 return to the club.

Those primary domains were not present in the owner-editable source registry, so the discovery/corroboration worker could not use them even when Google News surfaced the same developments through RugbyPass or The42.

## Change

The source registry now adds three authoritative Australian primary sources:

- Rugby Australia — `rugby.com.au`
- ACT Brumbies — `brumbies.rugby`
- Western Force — `westernforce.rugby`

Each is discovery- and evidence-enabled with `rumourPolicy: reject`. This expands the evidence pool; it does not lower the two-source, cross-source coherence, freshness, diversity, Publication Review, image or delivery gates.

## Verification required

A fresh bounded recovery must demonstrate that discovery can find at least five evidence-coherent current candidates under the PR #401 contract. Any candidate still lacking independent corroboration must remain rejected before model spend. Zoho must remain unsent until exactly five drafts also pass final image verification.
