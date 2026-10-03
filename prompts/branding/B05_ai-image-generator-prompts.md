# B05 — Prompts for AI image generators (inspiration and illustrations)

**Use for:** exploring ideas, mood, and illustrations — **not** for the final logo or icons (those are drawn as SVG in B01–B04).
**Works with:** any text-to-image tool. Wording below is tool-neutral; adjust syntax for your tool.

## Read this before you start

- **Gujarati/Hindi/English text inside generated images is unreliable.** Ask for symbols only (no text) and add real lettering yourself.
- **Check the tool's terms** about commercial use and who owns outputs before using any result in a product.
- **Don't name brands, logos, or living artists** in prompts, and don't ask for "in the style of" a specific company. Run a reverse image search on any result you like to make sure it doesn't look like an existing mark.
- **Turn a favourite result into a real logo** by giving it to the coding agent: "Redraw this concept from scratch as a clean SVG using simple geometry, in my palette, following B01's technical rules. Do not trace pixel by pixel." (The goal is an original, simplified redraw.)
- **Trademark:** an image generator result is not a protected design. Get a proper trademark search before you invest in the name.

## 1. Logo mark exploration

Replace `{…}` with your choices. Generate 8–12 images per prompt and look for *ideas*, not finished art.

**Concept A — thread through a needle**
~~~text
Minimal flat vector logo mark, a sewing needle's eye with a single continuous thread looping through it and ending in a small check mark, bold rounded geometric shapes, two colours indigo and turmeric yellow on a plain white background, centered, symmetrical balance, generous empty space, no text, no letters, no gradients, no shadows, no 3D, simple enough to be recognised at very small size, app icon style
~~~

**Concept B — ticket with a tick**
~~~text
Minimal flat vector logo mark, a rounded paper bundle ticket with two semicircular notches on its left edge, a dashed running-stitch line, and a bold check mark, indigo and turmeric yellow, plain white background, centered, thick uniform line weight, no text, no letters, no gradients, no shadows, no 3D, very simple shapes, app icon style
~~~

**Concept C — continuous thread monogram**
~~~text
Minimal flat vector logo mark, one single continuous thread line with round ends forming an abstract looping curve inspired by the idea of a stitch, uniform stroke width, deep indigo on a plain white background, centered, lots of negative space, no text, no letters, no gradients, no shadows, simple and bold, readable at tiny size
~~~

**Concept D — spool**
~~~text
Minimal flat vector logo mark, a simplified thread spool made from three rounded rectangles with a few diagonal thread lines and one loose thread curling upward into a check mark, indigo and warm yellow, plain white background, no text, no gradients, no shadows, geometric and friendly
~~~

**Useful modifiers to try (one at a time):** "thicker strokes", "more rounded", "more geometric", "negative space version", "single colour", "inside a circle", "inside a rounded square".

**Avoid-list to add at the end of any prompt (or use as the tool's negative prompt):**
`text, letters, words, watermark, signature, photo, realistic, 3D, gradient, shadow, glow, complex details, clutter, hands, faces`

## 2. Icon style reference sheet
~~~text
A sheet of 12 simple line icons on a plain cream background arranged in a grid: sewing needle, thread spool, scissors, shirt, paper ticket with notched edge, measuring tape, check mark, cross mark, rupee coin, calendar, mobile phone, bar chart. Consistent medium-thick rounded line style, single colour deep indigo, no fill, evenly spaced, friendly slightly hand-made feel, flat, no text
~~~
Use the result only as a *style reference* for B03 (stroke weight, roundness, friendliness).

## 3. Empty-state and onboarding illustrations (for in-app use)

Keep style consistent by reusing the same style sentence at the end: `flat vector illustration, limited palette of indigo, turmeric yellow, cream and deep navy, simple shapes, soft rounded corners, no text, no gradients, plain cream background`.

~~~text
A friendly illustration of an empty basket with a spool of thread and a needle beside it, calm and inviting, {style sentence}
~~~
~~~text
A neat stack of paper bundle tickets tied with thread, one ticket has a green check mark, {style sentence}
~~~
~~~text
A simple measuring tape curled into a circle with a tick in the center, representing a completed month, {style sentence}
~~~
~~~text
A mobile phone showing a big green tick next to a folded shirt, representing confirmation, {style sentence}
~~~
~~~text
A cloud with a line through it next to a small phone, representing working offline, calm and reassuring, {style sentence}
~~~
Redraw chosen illustrations as simple SVGs (the coding agent can do this) so they are tiny, recolourable and work in dark mode.

## 4. Social banner background (optional)
~~~text
A wide abstract background pattern of woven cloth texture in very light cream with subtle diagonal indigo thread lines and a few small dashed stitch lines, soft and calm, low contrast so text can be placed on top, flat vector style, no text, no logos
~~~

## 5. Quick quality filter for results
Reject anything that: contains accidental text, needs more than 3 colours, looks like a known brand, has unclear shapes at thumbnail size, or has asymmetry that looks like a mistake. Keep the ideas, redraw the shapes.
