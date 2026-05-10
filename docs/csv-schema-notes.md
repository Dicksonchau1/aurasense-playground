# Aura Rehearse capture CSV — schema notes

## presence_confidence — reserved

Original schema had a `presence_confidence` column. In practice MediaPipe
Hands only emits a single `score` per detection (tracking confidence),
not a separate presence score. Writing the same value to both columns
adds noise.

Decision: rename the column to `presence_confidence_reserved`.
- Populate it only when a future MediaPipe API or alternative tracker
  provides a distinct presence value.
- Otherwise leave the cell empty.
- Downstream consumers must treat the column as optional.

Compatibility: for one release cycle, also emit a legacy
`presence_confidence` column equal to `tracking_confidence`, then drop
it in the next release. Document the deprecation in the dataset
changelog.

Decision date: 2026-05-11
Author: Dickson Chau
