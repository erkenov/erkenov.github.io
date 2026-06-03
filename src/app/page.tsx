/**
 * Homepage → preview-v7 (Shamil 2026-06-03).
 *
 * The preview-v7 page is now the production homepage. We re-export
 * its default to avoid duplicating the large client component,
 * so both `/` and `/preview-v7` always render the same thing.
 *
 * preview-v7 = dragon-cell + roaming bot + 3D laptop variant.
 * The prior preview-v6 homepage is still reachable at /preview-v6,
 * and the original v3 cell-dragon homepage is preserved in git
 * history at commit 869e8a8 if we ever need to roll back.
 */

export { default } from "./preview-v7/page";
