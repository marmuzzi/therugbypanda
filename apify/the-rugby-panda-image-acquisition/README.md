# The Rugby Panda Image Acquisition Actor

This Actor collects editorial image candidates for The Rugby Panda.

It does **not** publish images and does **not** automatically approve images for commercial use.

## Purpose

The Actor searches approved open-media sources, normalizes the results, filters unsafe sources, removes duplicates, classifies candidates and outputs records that match The Rugby Panda Editorial Image Archive model.

## Current sources

- Openverse
- Wikimedia Commons

Google Images is intentionally not used in this Actor because it is discovery-only for this project and must never be treated as an approval source.

## Safety rules

The Actor tries to avoid unsuitable images before and after acquisition.

It rejects or avoids:

- Non-commercial licences
- No-derivatives licences
- Missing or unclear licences
- Getty Images
- Alamy
- Shutterstock
- iStock
- Adobe Stock
- Dreamstime
- Depositphotos
- 123RF
- AP / Associated Press
- Reuters
- PA Images
- Sportsfile
- Rights-managed or purchase-required wording

Allowed licence candidates:

- `cc0`
- `pdm`
- `by`
- `by-sa`

Passing these filters does not mean an image is approved. All output records remain lifecycle `Candidate` until manually validated.

## First-run settings

Use this for the first controlled test:

```json
{
  "searchPack": "evergreen",
  "sources": ["openverse", "wikimedia"],
  "resultsPerQueryPerSource": 3,
  "allowedLicenses": ["cc0", "pdm", "by", "by-sa"],
  "dryRun": true
}
```

Expected output record types:

- `run-summary`
- `candidate`
- `rejected`

## How to install manually in Apify

1. Open the Apify Actor `the-rugby-panda-image-acquisition`.
2. Replace `package.json` with this folder's `package.json`.
3. Replace `INPUT_SCHEMA.json` with this folder's `INPUT_SCHEMA.json`.
4. Create the `src` folder.
5. Copy every file from this folder's `src` directory into the Apify `src` folder.
6. Build the Actor.
7. Run the first test with the settings above.

## Output handling

The Actor outputs metadata only. It does not download or store image files.

Approved image files should later be uploaded to Sanity Asset Store after manual validation.

## Editorial lifecycle

All acquired external images start as:

```text
Candidate
```

The full lifecycle is:

```text
Candidate -> Pending Validation -> Approved -> Published -> Archived
```

Only `Approved` or `Published` records can be used on production pages.
