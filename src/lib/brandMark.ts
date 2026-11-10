/*
 * Gate mark geometry (brand v1.4, section 04 "The Gate Mark"). The single
 * source for every place the mark is drawn: the header and footer lockups, the
 * admin screens, the Open Graph image and the app icons. Do not copy these
 * paths elsewhere.
 *
 * The mark: a top-left and a bottom-right drafting corner bracket, with a
 * checkmark between them rising towards the open top-right corner. Brackets are
 * ink, the check is teal. Proportions are measured from the approved primary
 * lockup in the brand PDF.
 *
 * Rules from the brand guide:
 * - One approved mark, no alternates.
 * - Icon-only for favicon, app icon, social avatar; full lockup for headers.
 * - Minimum 24px. Clear space is half the mark's width on every side.
 * - Never close the corners, recolour the check off-teal, place it on a busy
 *   or mid-tone background, stretch, rotate, or add a shadow.
 */
export const MARK_VIEWBOX = "0 0 32 32";
export const MARK_BRACKETS = "M4 12V4h8M28 20v8h-8";
export const MARK_CHECK = "M10.5 16.5l4 4 7-9";
export const MARK_BRACKET_STROKE = 2;
export const MARK_CHECK_STROKE = 2.5;
export const MARK_MIN_SIZE = 24;

/*
 * Lockup proportions, from the approved lockup. `size` is the rendered box of
 * the mark; the drawn mark is 26/32 of that box.
 * - Wordmark: Geist Sans 700, "Architecture" in ink and "AI" in teal, with a
 *   cap height of 0.42 of the drawn mark (font size 0.48 of the box).
 * - Gap: 0.41 of the drawn mark between mark and wordmark (0.24 of the box,
 *   since the box already has 3/32 of padding on its right).
 */
export const wordmarkSize = (size: number) => Math.round(size * 0.48);
export const lockupGap = (size: number) => Math.round(size * 0.24);
