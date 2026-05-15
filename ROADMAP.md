# Sky Cat — OLED Screen Rendering Spec

Implement the OLED interface as a polished, playful, Tamagotchi-style monochrome pixel UI. The visual style should match the mockup: cute, readable, high-contrast, with a detailed rounded flying cat, small symbolic stat icons, and simple animation. The display is only 128×64, so prioritize clarity over detail.
Use a consistent layout across screens:

```
Y 0-9     Header: screen title + small stat icons
Y 10      Horizontal divider line
Y 11-55   Main screen content / animation area
Y 56-63   Message / caption / hint area
```

The OLED should feel like a tiny "product demo" screen, not just debug text.

---

## Global Header

Every screen should have a top header.

### Header layout

Left side:

```
SKY CAT
```

Right side: compact symbolic stat icons with small level bars or dots.
Use symbols if possible:

```
🐟  FOOD
♥   JOY
⚡  PWR
☺ or ✦ FUN
```

Because emoji may not render on U8g2, draw simple pixel icons instead:

- Food: tiny fish or snack icon
- Joy: heart
- Power: lightning bolt
- Fun: sparkle or smiley

Each icon can have 3–4 tiny blocks beside/under it to show current level.

Example header approximation:

```
SKY CAT       fish heart bolt smile
▣▣▣ ▣▣▢ ▣▣▣ ▣▢▢
────────────────
```

Keep the header readable and compact. It should not take over the screen.

---

## Main Pet View / Idle Screen

This is the default screen and should look like the top-right "Pet View (Idle)" panel in the mockup.

### Visual composition

Show the flying cat centered-right, floating among clouds.

Elements:

- Header at top.
- One or two small pixel clouds.
- Flying cat with wings.
- Optional tiny sparkle pixels around cat.
- Bottom text message such as:

```
Happy sky cruise!
```

or shorter on real OLED:

```
sky cruise!
```

### Cat appearance

The cat should be more like the mockup cat:

- Rounded head
- Rounded body
- Upright triangular ears
- Cute face
- Filled white body/head where possible
- Wings on both sides
- Small tail
- Small paws
- A few dark/cutout details for face/body if using filled shapes

The cat should not look like only thin outlines. It should have enough filled white area to read as a chunky pixel character.

### Animation

Idle animation should loop gently:

- Cat bobs up and down by 1–3 pixels.
- Wings flap every few frames.
- Clouds drift slowly.
- Optional tiny sparkle blinks near the cat.

### Example screen

```
SKY CAT        🐟 ♥ ⚡ ☺
▣▣▣ ▣▣▣ ▣▣▢ ▣▣▢
────────────────
   ☁
             /\_/\
      ☁     ( o.o )  < wings
             > ^ <
        ✦
sky cruise!
```

---

## Feed Mode Screen

This screen corresponds to the "Feed Mode" mockup panel.

### Purpose

Shows that pressing ACTION will feed the cat. When ACTION is pressed, play the feed cutscene.

### Static mode screen

Before pressing ACTION:

- Header: `FEED`
- Main area:
  - Food/snack/fish icon on left
  - Cat on right or center-right
  - Meter labeled `FOOD`
  - Prompt at bottom:

```
ACTION = snack
```

### Feed cutscene

When ACTION is pressed:

- Show cat facing a fish/snack.
- Move snack/fish toward cat over the short animation.
- Display small text:

```
nom nom
```

or stacked text:

```
nom
nom
nom!
```

- Optional small crumbs/sparkles.

### Stat effect

- Increase FOOD a lot.
- Slightly increase JOY.
- Slightly decrease PWR if desired.

### Example cutscene

```
SKY CAT        🐟 ♥ ⚡ ☺
────────────────
       🐟  --->   /\_/\
                 ( o.o )
                   nom
                   nom!
Yum! fish snack
```

For U8g2, replace fish emoji with a tiny drawn fish bitmap.

---

## Cuddle / Pet Mode Screen

This screen corresponds to the "Cuddle Mode" mockup panel.

### Purpose

Shows that pressing ACTION pets/cuddles the cat.

### Static mode screen

Before pressing ACTION:

- Header: `CUDDLE` or `PET`
- Main area:
  - Heart icon
  - Cat sitting/floating
  - Meter labeled `JOY`
  - Bottom prompt:

```
ACTION = cuddle
```

### Cuddle cutscene

When ACTION is pressed:

- Cat appears larger and happy.
- Hearts appear around the cat.
- A simple petting hand/line may move above the cat's head.
- Display:

```
purrrrr
```

or:

```
So much love!
```

The mockup shows hearts floating around the cat. This should be the main visual.

### Stat effect

- Increase JOY a lot.
- Slightly increase PWR or FUN.

### Example cutscene

```
SKY CAT        🐟 ♥ ⚡ ☺
────────────────
       ♥       ♥
          /\_/\
     ♥   ( ^.^ )   ♥
           > <
purrrrr
```

---

## Fly / Zoomies Mode Screen

This screen corresponds to the "Fly / Zoomies Mode" panel.

### Purpose

Shows the cat flying fast with motion lines.

### Static mode screen

Before pressing ACTION:

- Header: `FLY` or `ZOOM`
- Main area:
  - Lightning bolt icon
  - Cat with wings
  - Meter labeled `PWR`
  - Bottom prompt:

```
ACTION = zoomies
```

### Fly cutscene

When ACTION is pressed:

- Cat moves quickly across screen.
- Add horizontal speed lines behind cat.
- Wings flap faster.
- Add clouds at edges.
- Display:

```
zoom!
```

or:

```
Wheee!
```

### Stat effect

- Increase PWR.
- Increase FUN.
- Decrease FOOD.

### Example cutscene

```
SKY CAT        🐟 ♥ ⚡ ☺
────────────────
----  ----
  -----      /\_/\
------      ( o.o )  > wings
  ---        > ^ <
       ☁
Wheee! zoomies
```

This screen should feel the most animated.

---

## Play Mode Screen

The mockup's left menu includes Play, even though the right-side panel set focuses on Cuddle/Fly/Feed/Status. Implement Play as its own interaction screen.

### Purpose

Shows that pressing ACTION plays with the cat.

### Static mode screen

Before pressing ACTION:

- Header: `PLAY`
- Main area:
  - Toy ball or sparkle icon
  - Cat watching toy
  - Meter labeled `FUN`
  - Bottom prompt:

```
ACTION = toy
```

### Play cutscene

When ACTION is pressed:

- A ball, sparkle, or toy moves/bounces near cat.
- Cat faces the toy.
- Hearts/sparkles can appear.
- Display:

```
play!
```

or:

```
fun + 
```

### Stat effect

- Increase FUN a lot.
- Increase JOY.
- Decrease PWR slightly.
- Decrease FOOD slightly.

### Example cutscene

```
SKY CAT        🐟 ♥ ⚡ ☺
────────────────
     ✦
    ( ) ---- string/toy
              /\_/\
             ( o.o )
play!
```

---

## Status Screen

This screen corresponds to the bottom-right "Status Screen" panel in the mockup.

### Purpose

Show all meters clearly on one screen.

### Layout

Title:

```
SKY CAT
STATUS
```

Then four rows:

```
FOOD  [██████░░]
JOY   [█████░░░]
PWR   [███████░]
FUN   [████░░░░]
```

Use small icons if space allows:

```
FOOD 🐟 [bar]
JOY  ♥  [bar]
PWR  ⚡ [bar]
FUN  ☺  [bar]
```

In U8g2, use custom 8×8 bitmaps for fish, heart, lightning, sparkle/smiley.

### Behavior

On Status screen, ACTION can either:

**Option A:** give a tiny balanced "care boost" to all meters.

```
all + 
```

**Option B:** do nothing and display a help message.

Option A is recommended because it makes the two-button interface more satisfying.

### Example screen

```
SKY CAT STATUS
────────────────
FOOD  🐟 [██████░░]
JOY   ♥  [█████░░░]
PWR   ⚡ [███████░]
FUN   ✦  [████░░░░]

Keep kitty happy!
```

On the actual 128×64 display, use compact text:

```
FOOD [######--]
JOY  [#####---]
PWR  [#######-]
FUN  [####----]
```

---

## Mode Navigation

Use two buttons:

### MODE button

Cycles through:

```
Pet View
Feed
Cuddle
Fly
Play
Status
```

Every mode change should update the bottom message briefly:

```
feed?
pet?
fly?
play?
status
```

### ACTION button

Triggers the interaction associated with the current screen.

If on Pet View, ACTION should do a simple cuddle/pet interaction.

---

## Cutscene Timing

Each cutscene should be short:

```
1200–1800 ms
```

After the cutscene ends, return to the screen where the action was triggered, or return to Pet View. Returning to the same screen is recommended so students can clearly test the mode.

During a cutscene:

- Ignore MODE button.
- Ignore repeated ACTION button.
- Keep animation simple and reliable.

---

## Cat Art Direction

The cat should resemble the mockup, not a thin wireframe.

### Desired look

- Big rounded head
- Smaller rounded body
- Pointy ears
- Filled white head/body
- Dark cutout eyes/mouth if possible
- Wings with filled white shapes and a few dark feather lines
- Small tail curl
- Floating pose

### Important

On the real OLED, fully filled shapes can become visually heavy. Use filled areas, but keep internal dark cutouts for detail:

- Filled head/body/wings
- Black/dark eyes
- Black/dark mouth
- Black/dark wing feather lines
- Tiny white sparkle pixels around cat

### Suggested scale

In the main pet view:

```
Cat roughly 45–60 px wide including wings
Cat roughly 32–40 px tall
```

This keeps room for clouds and message text.

---

## Visual Polish Details

Add a few small touches:

- Clouds drifting on idle/fly screens.
- Sparkles near happy/excited cat.
- Motion lines during Fly.
- Hearts during Cuddle.
- Fish/snack moving during Feed.
- Toy bouncing during Play.
- Meters use bars plus symbols, not just numbers.
- Keep text short: the OLED is tiny.

Avoid long captions. Use:

```
nom nom
purrrrr
zoom!
play!
hungry...
sleepy...
bored...
soaring!
```

---

## Suggested Implementation Structure

Use this kind of structure:

```cpp
enum ScreenMode {
  SCREEN_PET,
  SCREEN_FEED,
  SCREEN_CUDDLE,
  SCREEN_FLY,
  SCREEN_PLAY,
  SCREEN_STATUS
};

enum CutsceneType {
  CUTSCENE_NONE,
  CUTSCENE_FEED,
  CUTSCENE_CUDDLE,
  CUTSCENE_FLY,
  CUTSCENE_PLAY,
  CUTSCENE_CARE
};
```

Create separate render functions:

```cpp
void renderPetScreen();
void renderFeedScreen();
void renderCuddleScreen();
void renderFlyScreen();
void renderPlayScreen();
void renderStatusScreen();

void renderFeedCutscene();
void renderCuddleCutscene();
void renderFlyCutscene();
void renderPlayCutscene();
void renderCareCutscene();

void drawHeader(const char* title);
void drawCat(int x, int y, bool facingRight, int mood);
void drawCloud(int x, int y);
void drawMeter(int x, int y, int w, int h, int value);
void drawIconFood(int x, int y);
void drawIconHeart(int x, int y);
void drawIconBolt(int x, int y);
void drawIconFun(int x, int y);
```

The main goal: make each mode visually obvious at a glance, even before students read the text.
