---
name: World Champignons
version: 1.0.0
format: DESIGN.md
brand:
  tagline: Vintage Outdoors Apothecary • Secret Society Mushroom Club
  essence: A secret society of nature seekers and knowledge keepers, rooted in mystery, curiosity, and the wild wisdom of the forest.
  attributes:
    - curious
    - rooted
    - mystical
    - heritage
    - scholarly
    - botanical
    - collectible
    - matte
colors:
  cream:
    value: "#E8DFCF"
    role: primary background, parchment panels, card surfaces
    usage: Use as the default page background and as the main light neutral.
  black:
    value: "#1C1B19"
    role: primary ink, headlines, borders, primary buttons
    usage: Use for major type, navigation, outlines, footer backgrounds, and high-contrast UI elements.
  dark-brown:
    value: "#4C3A2E"
    role: secondary ink, worn print texture, warm dark accents
    usage: Use for secondary headings, illustration shadows, hover states, and aged print detail.
  olive:
    value: "#7B7650"
    role: botanical accent, frames, rules, secondary buttons
    usage: Use for borders, botanical graphics, badges, filters, and subtle UI states.
  faded-orange:
    value: "#C96D33"
    role: celestial accent, active states, small emphasis marks
    usage: Use sparingly for stars, bullets, small icons, notification dots, and selected states.
  dusty-teal:
    value: "#7C8D8A"
    role: cool tertiary accent, quiet contrast, secondary metadata
    usage: Use sparingly for subdued tags, secondary links, and quiet visual contrast.
  paper-light:
    value: "#F4EEDF"
    role: lifted parchment surface
    usage: Use for cards, product tiles, form fields, and callout backgrounds.
  ink-muted:
    value: "#6F684F"
    role: subdued label text and divider lines
    usage: Use for labels, captions, table rules, and inactive states.
semanticColors:
  background: "#E8DFCF"
  surface: "#F4EEDF"
  text: "#1C1B19"
  textMuted: "#6F684F"
  border: "#7B7650"
  accent: "#C96D33"
  accentCool: "#7C8D8A"
  success: "#7B7650"
  warning: "#C96D33"
  error: "#7A2F23"
typography:
  display:
    fontFamily: "Rye, Eczar, Georgia, serif"
    fallback: "Georgia, serif"
    fontSize: "clamp(3rem, 8vw, 6.5rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "0.04em"
    textTransform: uppercase
    usage: Hero headlines, collection titles, large brand moments.
  h1:
    fontFamily: "Rye, Eczar, Georgia, serif"
    fallback: "Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 5rem)"
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: "0.035em"
    textTransform: uppercase
  h2:
    fontFamily: "Eczar, Georgia, serif"
    fallback: "Georgia, serif"
    fontSize: "clamp(1.875rem, 3.5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.03em"
    textTransform: uppercase
  h3:
    fontFamily: "Eczar, Georgia, serif"
    fallback: "Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.025em"
  body:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fallback: "Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
  body-small:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fallback: "Georgia, serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  label-caps:
    fontFamily: "Cinzel, Georgia, serif"
    fallback: "Georgia, serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.22em"
    textTransform: uppercase
  nav:
    fontFamily: "Cinzel, Georgia, serif"
    fallback: "Georgia, serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.16em"
    textTransform: uppercase
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  xxl: "64px"
  section: "96px"
rounded:
  none: "0px"
  sm: "2px"
  md: "6px"
  lg: "10px"
  pill: "999px"
borders:
  thin: "1px solid #7B7650"
  hairline: "1px solid rgba(28, 27, 25, 0.35)"
  heavy: "2px solid #1C1B19"
  ornamental: "double 3px #7B7650"
shadows:
  none: "none"
  paper: "0 12px 30px rgba(28, 27, 25, 0.08)"
  pressed: "inset 0 0 0 1px rgba(28, 27, 25, 0.22)"
texture:
  paperNoise: true
  inkDistress: true
  engravingLines: true
  glossyEffects: false
components:
  buttonPrimary:
    background: "#1C1B19"
    color: "#E8DFCF"
    border: "1px solid #1C1B19"
    borderRadius: "2px"
    font: label-caps
    padding: "14px 22px"
    hoverBackground: "#4C3A2E"
    hoverColor: "#F4EEDF"
  buttonSecondary:
    background: transparent
    color: "#1C1B19"
    border: "1px solid #7B7650"
    borderRadius: "2px"
    font: label-caps
    padding: "14px 22px"
    hoverBackground: "#7B7650"
    hoverColor: "#F4EEDF"
  card:
    background: "#F4EEDF"
    border: "1px solid rgba(123, 118, 80, 0.65)"
    borderRadius: "6px"
    shadow: paper
    padding: "24px"
  productCard:
    background: "#F4EEDF"
    border: "1px solid rgba(123, 118, 80, 0.7)"
    borderRadius: "4px"
    imageTreatment: warm parchment or dark ink frame
    hover: subtle lift, dark-brown border, no glossy glow
  input:
    background: "#F4EEDF"
    color: "#1C1B19"
    border: "1px solid rgba(123, 118, 80, 0.8)"
    borderRadius: "2px"
    focusBorder: "#C96D33"
    placeholderColor: "#6F684F"
  badge:
    background: "rgba(123, 118, 80, 0.16)"
    color: "#1C1B19"
    border: "1px solid rgba(123, 118, 80, 0.65)"
    borderRadius: "999px"
    font: label-caps
layout:
  maxWidth: "1180px"
  contentWidth: "760px"
  gridGap: "24px"
  sectionPaddingDesktop: "96px 32px"
  sectionPaddingMobile: "64px 20px"
  preferredAlignment: centered editorial with symmetrical product grids
imagery:
  style: engraved botanical illustration, archival field-guide photography, parchment texture, matte product photography
  avoid:
    - glossy gradients
    - neon psychedelic effects
    - generic stock cannabis/psychedelic clichés
    - plastic UI gloss
    - overly cartoon mushroom imagery
---

# World Champignons DESIGN.md

## Overview

World Champignons is an apparel and lifestyle brand with a vintage outdoors apothecary mood. The site should feel like a field manual discovered in a secret mushroom club archive: earthy, scholarly, collectible, and quietly strange. The design should avoid loud festival psychedelia. It should suggest mystery through restraint, not spectacle.

Use the visual language from Concept 4: cream parchment, distressed black ink, dark brown shadows, olive botanical framing, faded-orange celestial marks, and small dusty-teal accents. The brand should feel tactile, matte, printed, and archival.

## Brand Essence

**Vintage Outdoors Apothecary • Secret Society Mushroom Club**

A secret society of nature seekers and knowledge keepers, rooted in mystery, curiosity, and the wild wisdom of the forest.

The voice should be poetic but not precious. It can be weird, but it should stay intelligent. Think “old field guide meets underground apparel label,” not novelty head shop.

## Logo System

Use three logo modes.

### Primary Logo

The primary crest is best for homepage hero moments, product hang tags, packaging, large print areas, footer seals, collection landing pages, and brand-story panels.

Rules:
- Give the crest generous breathing room.
- Use it large enough that the mushroom engraving and ribbon text remain legible.
- Prefer cream, paper-light, black, or olive-backed sections.
- Do not place the crest over busy photography.
- Do not add drop shadows, glows, bevels, or modern effects.

### Brand Mark

The oval mushroom badge is the compact identity mark. Use it in navigation, favicon-like placements, garment labels, patches, small product stamps, loading states, and social avatars.

Rules:
- Keep it centered and isolated.
- Pair with small caps or the word mark when more context is needed.
- Do not recolor it into bright novelty colors.

### Word Mark

The word mark is best for headers, navigation, footer lockups, simple tees, email headers, and editorial layouts.

Rules:
- Preserve distressed texture.
- Use only on clean backgrounds with strong contrast.
- Pair with the motto “Seek • Study • Preserve” when appropriate.

## Color System

### Core Palette

- **Cream `#E8DFCF`**: primary parchment background. Use broadly.
- **Black `#1C1B19`**: primary ink. Use for text, borders, buttons, and major UI structure.
- **Dark Brown `#4C3A2E`**: secondary ink and warmth. Use for hover states, shadows, and aged print depth.
- **Olive `#7B7650`**: botanical system color. Use for borders, badges, dividers, iconography, and secondary actions.
- **Faded Orange `#C96D33`**: celestial accent. Use sparingly for stars, bullets, active states, and small points of emphasis.
- **Dusty Teal `#7C8D8A`**: quiet cool counterpoint. Use very sparingly for tags, metadata, or small secondary accents.

### Color Use Ratios

Aim for this approximate balance:

- 55 percent cream and paper tones
- 25 percent black and dark ink
- 12 percent olive and dark brown
- 5 percent faded orange
- 3 percent dusty teal

Faded orange is a candle in a cave. Use it where the eye should land, not everywhere.

## Typography Direction

The typography should feel old, literate, and printed. Use serif-first design. Avoid modern tech sans-serif styling unless used only for invisible utility classes.

### Display Type

Use a distressed vintage serif mood for major titles. Good implementation options include **Rye**, **Eczar**, or a similar western/vintage serif. Use all caps, wide spacing, and tight line-height.

Use for:
- Hero titles
- Collection names
- Large campaign lines
- Statement modules

### Supporting Type

Use a classic readable serif such as **Cormorant Garamond** or Georgia. Body copy should feel like editorial prose from an old field journal.

Use for:
- Body paragraphs
- Product descriptions
- Brand-story content
- Journal entries

### Accent Type

Use small caps with generous tracking. **Cinzel** or a similar small-caps serif direction works well.

Use for:
- Navigation
- Labels
- Eyebrows
- Buttons
- Metadata
- Motto treatments

## UI Layout Principles

### Overall Layout

Use a centered editorial grid with generous margins. The site should feel composed, not cramped. White space is parchment, not emptiness.

Recommended structure:
- Max content width: 1180px
- Editorial text width: 680px to 760px
- Section spacing: 64px mobile, 96px desktop
- Grid gap: 24px to 40px

### Borders and Dividers

Use thin ornamental lines and understated double borders. Small diamond, star, dot, or compass dividers can separate sections.

Use:
- Fine horizontal rules
- Double-line frames
- Corner ornaments
- Tiny faded-orange bullet points

Avoid:
- Thick modern card borders everywhere
- Rounded SaaS-style containers
- Neon divider glows

### Surfaces

Use layered paper surfaces. Cards may be slightly lighter than the main background.

Recommended:
- Page background: `#E8DFCF`
- Cards: `#F4EEDF`
- Borders: olive at 50 to 75 percent opacity
- Shadows: subtle warm paper shadow only

## Components

### Header / Navigation

The header should be quiet and archival.

Use:
- Cream or black background
- Centered word mark or compact brand mark
- Small-caps nav labels
- Thin bottom border
- Faded-orange active indicator or small star marker

Avoid sticky headers with glossy blur effects unless extremely subtle.

### Hero Sections

Preferred hero pattern:
- Large distressed serif headline
- Small-caps eyebrow
- Short poetic subcopy
- Primary crest or engraved mushroom artwork
- Two-button CTA group
- Ornamental divider below

Hero background should be cream parchment or deep black ink. If using dark hero sections, keep the artwork cream/olive/rust and do not over-saturate.

### Buttons

Buttons should feel printed, stamped, and intentional.

Primary button:
- Black background
- Cream text
- Small caps
- Square or nearly square corners
- Thin black border

Secondary button:
- Transparent or paper-light background
- Black text
- Olive border
- Small caps

Hover states should deepen ink, shift border color, or add a subtle pressed effect. Do not use glowing hover animations.

### Product Cards

Product cards should feel like cabinet-of-curiosities specimen labels.

Include:
- Product image in a framed paper or dark ink container
- Small-caps category label
- Distressed serif product name
- Price in clear serif or small caps
- Subtle olive border
- Optional small mushroom/star icon

Avoid:
- Generic ecommerce gradients
- Oversized rounded corners
- Bright sale stickers

### Forms

Forms should be simple and printed.

Use:
- Paper-light fields
- Black text
- Olive borders
- Faded-orange focus state
- Small-caps labels

Error states may use dark red-brown rather than bright red.

## Graphic Elements

Use recurring motifs to build consistency.

### Engraved Mushroom Illustration

Use botanical mushroom drawings as hero art, section ornaments, product category icons, and background watermark elements.

### Laurel / Botanical Branches

Use as framing devices around features, product callouts, or membership/club language.

### Compass Star / Celestial Ornament

Use faded orange starbursts for active states, dividers, cursor details, cart count marks, and small points of emphasis.

### Distressed Ink Texture

Use subtle distress on major type, borders, and marks. Texture should feel printed and worn, not dirty or chaotic.

### Ribbon Banner

Use ribbon shapes sparingly for collection labels, limited drops, and motto callouts.

### Ornamental Divider Lines

Use thin rules with center diamonds or star marks to divide editorial sections.

## Imagery Direction

Use imagery that feels natural, matte, and archival.

Good imagery:
- Forest floor details
- Macro mushrooms
- Moss, roots, ferns, bark, soil
- Matte apparel photography
- Field-guide-style botanical illustrations
- Warm studio shots on paper, canvas, wood, stone, or cloth

Avoid imagery that feels:
- Neon rave
- Cheap psychedelic clip art
- Vaporwave
- Glossy dispensary branding
- Medical mushroom supplement cliché

## Motion Direction

Motion should be quiet and ritual-like.

Use:
- Slow fades
- Slight parallax on botanical engravings
- Gentle paper reveal transitions
- Subtle hover lift on cards
- Tiny star/bullet activation animations

Avoid:
- Bouncy animations
- Spinning mushrooms
- Glitch effects
- Neon glow loops
- Overly playful transitions

## Accessibility

Maintain strong contrast between text and background. Black `#1C1B19` on cream `#E8DFCF` should be the default for body copy. Avoid placing olive text on cream for long passages unless contrast is verified. Faded orange should not be used for body text. It is an accent only.

Interactive states must be visible without relying only on color. Use underline, border change, icon shift, or pressed texture.

## Page Patterns

### Homepage

Suggested sections:
1. Hero with crest, headline, short manifesto, and shop/journal CTAs
2. Featured collection grid
3. “Seek • Study • Preserve” brand story panel
4. Product categories with engraved icon cards
5. Journal/field notes preview
6. Newsletter signup as a secret-club invitation
7. Footer with crest, word mark, and ornamental dividers

### Shop / Collection Page

Use a specimen-cabinet structure:
- Small-caps collection title
- Short editorial intro
- Filter chips styled as badges
- Product grid with framed cards
- Subtle texture, no visual clutter

### Product Page

Use a heritage goods layout:
- Large product imagery
- Product title in distressed serif
- Price and options in small caps
- Add-to-cart as black stamped button
- Story panel for the design’s meaning
- Materials and fit as clean accordion sections

### Journal / Brand Story

Use a field-notes editorial layout:
- Narrow text column
- Large serif title
- Pull quotes
- Botanical dividers
- Cream paper surface
- Inline engraved graphics

## Copy Tone

Voice should be:
- Curious
- Grounded
- Mystical
- Literate
- Outdoorsy
- Slightly secretive
- Confident without shouting

Use phrases that feel like discovery, field notes, and old society rituals.

Good examples:
- “Rooted in Mystery. Grown to Inspire.”
- “Seek • Study • Preserve.”
- “For those who know the forest.”
- “Field notes for the curious.”
- “Garments for natural philosophers and woodland skeptics.”

Avoid:
- Overused psychedelic slang
- Medical or therapeutic claims
- Drug-use promises
- Neon party language
- Wellness cure language

## Do / Don’t

### Do

- Use cream, black, olive, dark brown, faded orange, and dusty teal.
- Keep layouts spacious and symmetrical.
- Use serif-first typography.
- Preserve distressed texture.
- Use botanical and celestial ornaments with restraint.
- Favor matte, tactile materials.

### Don’t

- Use bright neon rainbow palettes.
- Make the site look like a dispensary or supplement brand.
- Use generic mushroom cartoons.
- Add glossy gradients, glassmorphism, or SaaS-style UI.
- Crowd the page with ornaments.
- Use faded orange as a dominant color.

## Codex Implementation Notes

When building UI for this brand:

1. Read this file before creating or modifying any components.
2. Treat the YAML tokens as the source of truth for values.
3. Treat the markdown guidance as the source of truth for creative direction.
4. Default to cream parchment backgrounds, black ink typography, olive dividers, and faded-orange micro-accents.
5. Prefer CSS variables derived from the color tokens.
6. Use semantic component classes such as `.wc-card`, `.wc-button-primary`, `.wc-divider`, `.wc-label-caps`, `.wc-paper`, and `.wc-ornament`.
7. Keep UI restrained, matte, print-inspired, and editorial.
8. Validate contrast for buttons, text, and form states.

## Suggested CSS Variables

```css
:root {
  --wc-cream: #E8DFCF;
  --wc-paper-light: #F4EEDF;
  --wc-black: #1C1B19;
  --wc-dark-brown: #4C3A2E;
  --wc-olive: #7B7650;
  --wc-faded-orange: #C96D33;
  --wc-dusty-teal: #7C8D8A;
  --wc-ink-muted: #6F684F;

  --wc-font-display: "Rye", "Eczar", Georgia, serif;
  --wc-font-body: "Cormorant Garamond", Georgia, serif;
  --wc-font-caps: "Cinzel", Georgia, serif;

  --wc-radius-sm: 2px;
  --wc-radius-md: 6px;
  --wc-space-sm: 8px;
  --wc-space-md: 16px;
  --wc-space-lg: 24px;
  --wc-space-xl: 40px;
  --wc-space-section: 96px;
}
```

## Suggested Web Font Imports

Use Google Fonts or local equivalents. If performance is critical, self-host the selected font files.

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Eczar:wght@600;700&family=Rye&display=swap');
```

Preferred stack:
- Display: Rye or Eczar
- Body: Cormorant Garamond
- Labels/Nav: Cinzel

Use Georgia as a safe fallback.
