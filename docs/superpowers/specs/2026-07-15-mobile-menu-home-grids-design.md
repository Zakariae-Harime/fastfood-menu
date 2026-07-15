# Mobile Menu and Homepage Grids Design

## Goal

Improve the mobile browsing and ordering experience while preserving Snack Maestro's existing visual identity. The work focuses on the `/menu` page and the homepage specialties and values sections. Desktop behavior should remain familiar and stable.

## Design direction

Use a food-first mobile hybrid: a compact, sticky browsing interface for the menu; a swipeable specialties rail on the homepage; and a compact two-column values grid. The design should feel like a more deliberate version of the existing site, not a rebrand.

### Existing tokens to preserve

- Warm paper: approximately `#FCF8EE` (`--background`)
- Dark ink: approximately `#473830` (`--foreground`)
- Paprika/yellow-orange: approximately `#C65F32` (`--primary`)
- Soft food highlight: approximately `#F8E7C2` (`--accent`)
- Card white: `#FFFFFF` (`--card`)
- WhatsApp green: approximately `#25D366` (`--whatsapp`)
- Display type: Archivo
- Body and controls: Inter
- Darija text: the existing Arabic font configured by the layout

The implementation will continue to consume the existing CSS custom properties rather than introducing duplicate hard-coded colors.

## Menu page

### Header and navigation

- Keep the back control, compact brand mark, and language toggle.
- Reduce the vertical space consumed by the mobile header.
- Replace the mobile category dropdown with a horizontally scrollable row of category chips.
- Keep the selected chip visible after selection and expose selection through `aria-pressed`.
- Retain the search field but make it visually subordinate to category browsing.
- Preserve a visible keyboard focus state and a minimum 44-pixel touch target.

### Menu cards

- Use a compact image-led card optimized for a narrow viewport.
- Keep the image, name, ingredients, price, and customize/add action visible without requiring a hover state.
- Strengthen the price hierarchy and reduce decorative padding so more useful content appears above the fold.
- Use `next/image` with explicit dimensions and responsive `sizes` for menu images.
- Cards without images receive a branded color rail rather than an empty media area.
- Preserve the existing customize sheet, cart behavior, search filtering, bilingual naming, and WhatsApp ordering flow.

### Loading, empty, and error states

- Loading placeholders must match the revised card proportions to prevent layout jumping.
- Existing translated error and empty messages remain in use.
- Search results continue to update through the existing deferred query behavior.

## Homepage grids

### Specialties

- On mobile, show featured dishes in a horizontal snap rail with one full card and a visible portion of the next card as a swipe cue.
- Use larger food imagery, a strong price badge, and concise ingredient copy.
- On tablet and desktop, retain a three-column grid.
- Keep the “Discover the full menu” action immediately after the rail.

### Values

- On mobile, use a two-column grid for the first two values.
- Let the third value span both columns to avoid a visually orphaned tile.
- Use compact icon/title groupings and shorter vertical spacing while preserving all existing copy.
- On wider screens, retain the existing three-column composition.

## Motion and accessibility

- Use only transform, opacity, color, border, and shadow transitions in the 150–300 ms range for interactions.
- Preserve the existing reduced-motion behavior and avoid relying on animation to explain state.
- Maintain semantic sections, headings, navigation labels, meaningful image alternative text, and logical DOM order.
- Prevent horizontal page overflow; only the specialties rail and category row may scroll horizontally.
- Support left-to-right French and right-to-left Darija layouts.

## Responsive scope

- Primary target: 375–430 px mobile viewports.
- Checkpoints: 375 px, 768 px, 1024 px, and 1440 px.
- Mobile receives the largest layout changes. Existing tablet and desktop layouts should only change where needed for consistency or image optimization.

## Component boundaries

- `MenuClient` owns search, active-category state, and menu-page composition.
- `MenuItemCard` owns only the presentation and action for one menu item.
- `SpecialtiesGrid` owns featured-item loading and responsive rail/grid presentation.
- The homepage values section remains data-driven from the existing `VALUES` collection.
- No menu-data schema or cart-state changes are required.

## Verification

- Add focused tests for any new extracted state or presentation helpers before implementation.
- Run the project linter and production build.
- Verify the menu and homepage at the responsive checkpoints, including French and Darija direction.
- Confirm category selection, search, customization, add-to-cart, and existing WhatsApp ordering still work.
- Confirm focus visibility, touch-target sizing, reduced motion, image alternative text, and absence of unintended horizontal page scrolling.

## Out of scope

- Rebranding, palette changes, typography replacement, menu-data changes, checkout changes, or redesigning the map and QR sections.
- Broad desktop redesign beyond responsive consistency.
