/**
 * Homepage → preview-v6 (Shamil 2026-05-25 evening).
 *
 * The preview-v6 page is now the production homepage. We re-export
 * its default to avoid duplicating the ~1000-line client component,
 * so both `/` and `/preview-v6` always render the same thing.
 *
 * The previous v3 cell-dragon homepage (Header + SphereScrollStage +
 * five static scenes) is preserved in git history at commit 869e8a8
 * if we ever need to roll back.
 */

export { default } from "./preview-v6/page";
