# CF 360 image prompts

One prompt per image. Every image follows the visual style of the Gold Loan offer reel
(`public/media/gold-loan-offer-reel.mp4`): flat vector, deep navy with gold, hard-edged
highlight planes, no blur. Save each file at the path in its `output.save_as`; the
placeholder box on that screen fills in on its own as soon as the file exists.

Paste the **shared style** block together with each image prompt, or merge it into the
prompt's `style` field if your tool takes a single JSON object.

Pages (switch to a Producer, e.g. Sushant Singh, from the user menu):

| Images | Page |
|---|---|
| 4 storyboard stills | https://cf360vam.vercel.app/pre-production/script and /pre-production/storyboard |
| 7 format covers (reused on templates) | https://cf360vam.vercel.app/pre-production/format and /pre-production/template |
| 2 reference video posters | /pre-production/format, then View Details on Offer Reel or How-to Video |

---

## Shared style

```json
{
  "style_name": "CF360 gold flat",
  "medium": "flat vector illustration, crisp geometric shapes, like a premium motion-graphics frame",
  "background": {
    "base": "#0B0E19 deep midnight navy, solid, no gradient",
    "depth": "two or three large flat concentric circles behind the subject in #10152A, #141B35 and #19213F, hard edges, like layered tonal rings",
    "floor": "an optional darker diagonal floor plane in #0E1222 across the lower third"
  },
  "palette": {
    "gold_main": "#F3C452",
    "gold_face": "#EDB843",
    "gold_highlight": "#FFD978 and #FFE08A",
    "gold_mid": "#D49A2A",
    "gold_shadow": "#A86D14 and #9C6510",
    "gold_edge_detail": "#7E500B",
    "navy_surfaces": "#161C33 front, #262F52 top, #0F1426 side",
    "sparkle": "#FFF3D1 cream",
    "accent_text_safe": "#C9CEE0 soft grey-blue"
  },
  "shading": "flat colour planes only. Light comes from the top left: each object has one lit face, one mid face and one shadow face, plus one or two sharp diagonal highlight bands. Think layered flat tones, like a paper cut-out.",
  "objects_rules": {
    "coins": "plain round gold coins seen at a slight top-down tilt, a ridged (reeded) edge drawn as short vertical lines in the edge band, a thin inner ring on the face, one diagonal highlight band. Absolutely no symbol, letter, number, currency sign or portrait on any coin.",
    "gold_bars": "plain trapezoid gold bars with three flat faces and a thin inset bevel line on top. No stamp, text, hallmark or logo.",
    "pedestal": "a simple rectangular navy block with a lit top face and a darker side face",
    "sparkles": "small four-point stars in cream, a few, scattered, different sizes"
  },
  "mood": "calm, trustworthy, premium, Indian fintech",
  "avoid": [
    "blur", "glow", "bloom", "lens flare", "soft drop shadows", "gradients on objects",
    "photorealism", "3D render look", "glossy plastic", "bevel-and-emboss",
    "any text, letters, numbers or logos", "currency symbols", "brand marks",
    "watermarks", "busy backgrounds", "neon colours", "cartoon faces"
  ]
}
```

---

## 1. Storyboard stills (4)

Used twice: the small frame next to each beat in the Script table, and the four-frame
strip under the Master Prompt on Storyboard. Generate tall; the app crops nothing.

### 1.1 Hook (0 to 3s)

```json
{
  "id": "storyboard_hook",
  "screen": "Script table, row 'Hook · 0-3s' (Visual: 'Locker opens, gold glints'); Storyboard strip, frame 1",
  "output": { "save_as": "public/media/storyboard/hook.jpg", "size": "1080x1920", "aspect_ratio": "9:16", "format": "jpg", "quality": 90 },
  "subject": "a small steel locker door swinging open toward the viewer, revealing gold inside",
  "scene": {
    "locker": "squarish navy-steel locker box, front face #262F52, side face #161C33, door opened about 60 degrees to the left, a simple round dial on the door drawn as two flat circles",
    "contents": "a short stack of three plain gold coins and one plain gold bar resting on the locker floor",
    "light": "hard-edged wedge-shaped beams of flat gold (#FFD978 at 35% opacity, crisp edges) fanning out of the open locker",
    "sparkles": "four cream four-point sparkles near the opening, two large, two small"
  },
  "composition": "locker centred slightly below the middle, beams reaching toward the upper third, the top 30% of the frame left as calm dark navy for an on-screen line later",
  "camera": "straight-on, slightly from above, flat orthographic feel",
  "palette_focus": "deep navy with the gold beams as the brightest element",
  "negative_prompt": "text, numbers, logos, symbols on coins, glow, blur, people, keys, padlock brands"
}
```

### 1.2 Offer (3 to 8s)

```json
{
  "id": "storyboard_offer",
  "screen": "Script table, row 'Offer · 3-8s' (Visual: 'Bold text overlay 9.50%'); Storyboard strip, frame 2",
  "output": { "save_as": "public/media/storyboard/offer.jpg", "size": "1080x1920", "aspect_ratio": "9:16", "format": "jpg", "quality": 90 },
  "subject": "a large empty gold badge where the interest rate will be overlaid, above a small coin stack",
  "scene": {
    "badge": "a big rounded-rectangle badge, width about 70% of the frame, flat #F3C452 face, a 12px darker #D49A2A lower edge to suggest thickness, one diagonal #FFE08A highlight band across the top left. The badge face is completely empty.",
    "coins": "a stack of four plain gold coins and one plain gold bar on a small navy pedestal near the bottom",
    "rings": "the flat concentric halo rings centred behind the badge",
    "sparkles": "three cream sparkles around the badge corners"
  },
  "composition": "badge in the upper-middle (centre at about 40% height), pedestal and coins in the lower quarter, clear margins on both sides",
  "camera": "straight-on, flat",
  "palette_focus": "the gold badge is the hero; the coins repeat the gold lower down",
  "negative_prompt": "any text or numbers on the badge, percentage sign, currency signs, symbols on coins, glow, blur, gradients"
}
```

### 1.3 Benefit (8 to 12s)

```json
{
  "id": "storyboard_benefit",
  "screen": "Script table, row 'Benefit · 8-12s' (Visual: 'Approval UI, 5-min timer'); Storyboard strip, frame 3",
  "output": { "save_as": "public/media/storyboard/benefit.jpg", "size": "1080x1920", "aspect_ratio": "9:16", "format": "jpg", "quality": 90 },
  "subject": "a smartphone showing an abstract instant-approval screen with a timer",
  "scene": {
    "phone": "a simple flat phone, rounded rectangle, body #161C33 with a #262F52 side edge, screen #F7F4EA cream-white",
    "screen_ui": "only shapes, no text: a large green circle (#10B981) with a white tick in the upper half, a gold circular timer ring (#F3C452) about three-quarters filled below it, and three short grey bars (#D9D4C4) as placeholder lines at the bottom",
    "coins": "two plain gold coins tilted beside the phone at the lower right, one partly behind it",
    "sparkles": "three cream sparkles near the tick"
  },
  "composition": "phone centred, upright, about 60% of the frame height, slight 8-degree tilt to the right",
  "camera": "straight-on, flat",
  "palette_focus": "navy background, cream screen, green tick and gold timer as the two accents",
  "negative_prompt": "readable UI text, app logos, real phone brand, notch details, glow, blur, hands, faces"
}
```

### 1.4 CTA (12 to 15s)

```json
{
  "id": "storyboard_cta",
  "screen": "Script table, row 'CTA · 12-15s' (Visual: 'Apply Now button, logo lock-up'); Storyboard strip, frame 4",
  "output": { "save_as": "public/media/storyboard/cta.jpg", "size": "1080x1920", "aspect_ratio": "9:16", "format": "jpg", "quality": 90 },
  "subject": "a closing frame with an empty call-to-action button and an empty logo area",
  "scene": {
    "logo_area": "a blank cream-white rounded rectangle near the top, about 40% of the frame width, where a logo lock-up will be placed later. Leave it completely empty.",
    "button": "a wide pill-shaped gold button (#F3C452) in the lower-middle, a darker #D49A2A bottom edge for thickness, one small flat arrow shape in navy at its right end, no label",
    "coins": "plain gold coins tumbling in from both lower corners, three on each side at different tilts",
    "rings": "concentric halo rings centred on the button",
    "sparkles": "four cream sparkles"
  },
  "composition": "logo area at about 18% height, button at about 62% height, generous empty navy space in between for one short line of copy",
  "camera": "straight-on, flat",
  "palette_focus": "button is the brightest gold element",
  "negative_prompt": "text on the button, real logos, brand names, symbols on coins, glow, blur"
}
```

---

## 2. Format covers (7)

Shown at the top of each card on Format, and again on Template (same files).
16:9, one clear subject per cover, all in the same family.

### 2.1 Offer Reel (9:16, 15 to 30s)

```json
{
  "id": "format_offer_reel",
  "screen": "Format card 'Offer Reel' and Template card 'Offer Reel'",
  "output": { "save_as": "public/media/formats/offer-reel.jpg", "size": "1600x900", "aspect_ratio": "16:9", "format": "jpg", "quality": 88 },
  "subject": "a vertical phone-shaped video card standing on a pedestal, showing an empty gold rate badge, with coins beside it",
  "scene": {
    "card": "a tall 9:16 rounded rectangle in #161C33 with a #262F52 edge, standing upright on a navy pedestal, a small play triangle in cream at its lower left",
    "badge": "an empty gold rounded badge in the middle of the card",
    "coins": "a stack of four plain gold coins to the right of the card and one plain gold bar to the left",
    "sparkles": "three cream sparkles"
  },
  "composition": "card centred, about 75% of the image height; halo rings behind; wide navy margins left and right",
  "camera": "straight-on, slightly from above",
  "negative_prompt": "text, numbers, percent sign, logos, symbols on coins, glow, blur"
}
```

### 2.2 How-to Video (9:16, 30 to 60s)

```json
{
  "id": "format_how_to_video",
  "screen": "Format card 'How-to Video' and Template card 'How to Video'",
  "output": { "save_as": "public/media/formats/how-to-video.jpg", "size": "1600x900", "aspect_ratio": "16:9", "format": "jpg", "quality": 88 },
  "subject": "three ascending step blocks with a coin climbing them, showing a simple step-by-step process",
  "scene": {
    "steps": "three navy blocks rising left to right like stairs, each with a lit top face (#262F52) and a darker front (#161C33); on each top face one, two and three small gold dots to mark the step (dots only, no numerals)",
    "coin": "one plain gold coin rolling up onto the top step, a short flat motion trail of three thin gold lines behind it",
    "path": "a thin dashed gold line connecting the three steps",
    "sparkles": "two cream sparkles above the top step"
  },
  "composition": "stairs spanning the middle 70% of the width, slightly below centre",
  "camera": "three-quarter view from the front-left, flat isometric feel",
  "negative_prompt": "numbers, text, arrows with labels, logos, symbols on coins, glow, blur, people"
}
```

### 2.3 Feature & Benefits (9:16, 15 to 30s)

```json
{
  "id": "format_feature_benefits",
  "screen": "Format card 'Feature & Benefits' and Template card 'Feature & Benefits'",
  "output": { "save_as": "public/media/formats/feature-and-benefits.jpg", "size": "1600x900", "aspect_ratio": "16:9", "format": "jpg", "quality": 88 },
  "subject": "a plain gold bar at the centre with four round benefit badges orbiting it",
  "scene": {
    "bar": "one large plain gold bar, three flat faces, thin inset bevel line, no stamp",
    "badges": "four small flat circles in #F3C452 with navy line icons: a tick, a clock, a shield and a folded document; evenly spaced on a thin dashed elliptical orbit around the bar",
    "rings": "halo rings behind the bar",
    "sparkles": "three cream sparkles between the badges"
  },
  "composition": "bar centred; orbit ellipse about 80% of the width",
  "camera": "straight-on, slightly from above",
  "negative_prompt": "text, numbers, logos, stamps on the bar, glow, blur"
}
```

### 2.4 Overview Video (16:9, 45 to 90s)

```json
{
  "id": "format_overview_video",
  "screen": "Format card 'Overview Video' and Template card 'Overview Video'",
  "output": { "save_as": "public/media/formats/overview-video.jpg", "size": "1600x900", "aspect_ratio": "16:9", "format": "jpg", "quality": 88 },
  "subject": "a wide, calm scene of gold jewellery on a tray beside a folded loan document",
  "scene": {
    "tray": "a shallow rectangular navy velvet tray (#161C33 base, #262F52 rim) in the left half",
    "jewellery": "two plain gold bangles stacked at an angle and a simple gold chain necklace laid in a gentle curve, flat gold shapes with one highlight band each",
    "document": "a folded cream document (#F7F4EA) on the right with three grey placeholder lines and a small round gold seal with a ribbon, no text",
    "coins": "two plain gold coins between the tray and the document",
    "sparkles": "three cream sparkles"
  },
  "composition": "wide horizontal layout, objects along a soft diagonal from lower left to upper right, lots of breathing room",
  "camera": "top-down at about 60 degrees, flat",
  "negative_prompt": "text on the document, numbers, logos, gemstones, people, hands, glow, blur"
}
```

### 2.5 Eligibility Criteria (9:16, 15 to 30s)

```json
{
  "id": "format_eligibility_criteria",
  "screen": "Format card 'Eligibility Criteria' and Template card 'Eligibility Criteria'",
  "output": { "save_as": "public/media/formats/eligibility-criteria.jpg", "size": "1600x900", "aspect_ratio": "16:9", "format": "jpg", "quality": 88 },
  "subject": "a checklist clipboard with three ticked rows next to a blank ID card",
  "scene": {
    "clipboard": "a cream clipboard (#F7F4EA) with a gold clip at the top; three rows, each a green tick circle (#10B981) followed by a grey placeholder line",
    "id_card": "a horizontal navy ID card (#262F52) to the right, with a simple round avatar silhouette in #3A4570 and two short grey lines, tilted 10 degrees",
    "coin": "one plain gold coin leaning against the ID card",
    "sparkles": "two cream sparkles"
  },
  "composition": "clipboard left of centre and slightly larger; ID card overlapping its right edge",
  "camera": "straight-on, flat",
  "negative_prompt": "readable text, numbers, real ID designs, photos of people, logos, glow, blur"
}
```

### 2.6 Buying Guide (16:9, 60 to 120s)

```json
{
  "id": "format_buying_guide",
  "screen": "Format card 'Buying Guide' and Template card 'Buying Guides'",
  "output": { "save_as": "public/media/formats/buying-guide.jpg", "size": "1600x900", "aspect_ratio": "16:9", "format": "jpg", "quality": 88 },
  "subject": "a balanced weighing scale comparing a coin stack with a gold bar",
  "scene": {
    "scale": "a classic two-pan balance scale in flat navy (#262F52 beam and post, #161C33 base), perfectly level",
    "left_pan": "a stack of five plain gold coins",
    "right_pan": "one plain gold bar",
    "rings": "halo rings centred on the scale post",
    "sparkles": "three cream sparkles above the beam"
  },
  "composition": "scale centred, beam spanning about 70% of the width",
  "camera": "straight-on, flat",
  "negative_prompt": "text, numbers, weights with labels, logos, symbols on coins, glow, blur"
}
```

### 2.7 Customer Testimonial (9:16, 20 to 40s)

```json
{
  "id": "format_customer_testimonial",
  "screen": "Format card 'Customer Testimonial'",
  "output": { "save_as": "public/media/formats/customer-testimonial.jpg", "size": "1600x900", "aspect_ratio": "16:9", "format": "jpg", "quality": 88 },
  "subject": "a friendly, simplified person with a speech bubble holding five stars",
  "scene": {
    "person": "a flat, faceless head-and-shoulders figure (no eyes or mouth drawn), warm brown skin tone #B97A56, dark hair #1F1A17, a mustard kurta #D49A2A; simple geometric shapes, like a minimal avatar",
    "bubble": "a cream speech bubble (#F7F4EA) to the upper right with five small gold stars in a row inside it",
    "coin": "one plain gold coin floating near the shoulder",
    "sparkles": "two cream sparkles"
  },
  "composition": "person left of centre, bubble upper right, halo rings behind the person",
  "camera": "straight-on, flat",
  "negative_prompt": "detailed faces, real people, text in the bubble, numbers, logos, glow, blur"
}
```

---

## 3. Reference video posters (2)

Shown in the Format details drawer, in the Reference video row. Only the two formats
that have a reference video need one.

### 3.1 Offer Reel reference

```json
{
  "id": "reference_offer_reel",
  "screen": "Format details drawer for 'Offer Reel', Reference video row (Gold_Loan_OfferReel_Ref_v2.mp4)",
  "output": { "save_as": "public/media/reference/offer-reel.jpg", "size": "720x1280", "aspect_ratio": "9:16", "format": "jpg", "quality": 88 },
  "subject": "the first frame of a gold loan offer reel: coins landing on a pedestal next to a gold bar",
  "scene": {
    "pedestal": "a navy pedestal in the lower half, lit top face #262F52, front #161C33, side #0F1426",
    "coins": "a stack of four plain gold coins on the left of the pedestal, the top coin still dropping in with three short motion lines above it",
    "bar": "one plain gold bar on the right of the pedestal",
    "rings": "halo rings centred on the pedestal",
    "play": "a small cream circle with a navy play triangle in the centre of the frame, so it reads as a video poster",
    "sparkles": "four cream sparkles"
  },
  "composition": "top 35% kept empty navy for a title; pedestal centred",
  "camera": "straight-on, slightly from above",
  "negative_prompt": "text, numbers, logos, symbols on coins, glow, blur"
}
```

### 3.2 How-to Video reference

```json
{
  "id": "reference_how_to_video",
  "screen": "Format details drawer for 'How-to Video', Reference video row (PersonalLoan_HowTo_Ref_v1.mp4)",
  "output": { "save_as": "public/media/reference/how-to-video.jpg", "size": "720x1280", "aspect_ratio": "9:16", "format": "jpg", "quality": 88 },
  "subject": "a phone showing three stacked step cards, the first frame of a how-to video",
  "scene": {
    "phone": "a flat phone, body #161C33, screen #F7F4EA",
    "steps": "three cream cards stacked down the screen, each with a gold circle holding one, two or three navy dots and two grey placeholder lines; the first card has a green tick circle",
    "coin": "one plain gold coin at the lower right, partly behind the phone",
    "play": "a small cream circle with a navy play triangle centred on the phone",
    "sparkles": "three cream sparkles"
  },
  "composition": "phone centred, about 65% of the frame height",
  "camera": "straight-on, flat",
  "negative_prompt": "readable text, numerals, app logos, real phone brand, glow, blur, hands"
}
```
