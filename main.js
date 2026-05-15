// Sky Cat v5.0 — Pixel-art OLED Tamagotchi
//
// REQUIRES SWITCHING EXTENSION IN MAKECODE:
//   Remove:  current Lectrify OLED extension
//   Add:     https://github.com/makecode-extensions/OLED12864_I2C
//
// New API (pixel coords, x 0-127, y 0-63):
//   showString(charX, pageY, text, color)  charX=char col, pageY=0-7
//   hline(x, y, len, color)
//   vline(x, y, len, color)
//   rect(x1, y1, x2, y2, color)   endpoint coords, not width/height
//   filledCircle(x, y, r, color)
//   pixel(x, y, color)             color 0 = clear pixel
//
// zoom(false) called at startup → full 128×64 pixel resolution
//
// Controls: A=action  B=next mode  A+B=status screen
// Modes: PET(0) FEED(1) CUDDLE(2) FLY(3) PLAY(4) STATUS(5)
//
// Wiring: GND→GND  VCC→3V  SCL→P19  SDA→P20

// =====================
// STATS (0–100)
// =====================

let food = 72
let joy = 80
let energy = 68
let fun = 66

// =====================
// MODE & STATE
// =====================

let mode = 0
let inCutscene = false

// =====================
// STARTUP
// =====================

OLED12864_I2C.init(60)
OLED12864_I2C.zoom(false)   // full 128×64 resolution (default is 64×64 zoomed)
basic.showString("V5")
renderCurrentScreen()

// =====================
// BUTTON HANDLERS
// =====================

input.onButtonPressed(Button.A, function () {
    if (inCutscene) { return }
    doAction()
})

input.onButtonPressed(Button.B, function () {
    if (inCutscene) { return }
    mode = (mode + 1) % 6
    renderCurrentScreen()
})

input.onButtonPressed(Button.AB, function () {
    if (inCutscene) { return }
    mode = 5
    renderCurrentScreen()
})

// =====================
// ACTION DISPATCHER
// =====================

function doAction() {
    if (mode == 0) {        // PET
        joy = clamp(joy + 8)
        fun = clamp(fun + 4)
        runCuddleCutscene()
    } else if (mode == 1) { // FEED
        food = clamp(food + 15)
        energy = clamp(energy - 3)
        runFeedCutscene()
    } else if (mode == 2) { // CUDDLE
        joy = clamp(joy + 12)
        energy = clamp(energy + 3)
        runCuddleCutscene()
    } else if (mode == 3) { // FLY
        energy = clamp(energy + 12)
        fun = clamp(fun + 8)
        food = clamp(food - 5)
        runFlyCutscene()
    } else if (mode == 4) { // PLAY
        fun = clamp(fun + 12)
        joy = clamp(joy + 6)
        energy = clamp(energy - 5)
        food = clamp(food - 3)
        runPlayCutscene()
    } else {                // STATUS
        food = clamp(food + 3)
        joy = clamp(joy + 3)
        energy = clamp(energy + 3)
        fun = clamp(fun + 3)
        runCareCutscene()
    }
}

// =====================
// SCREEN ROUTER
// =====================

function renderCurrentScreen() {
    if (mode == 0) {
        renderPetScreen()
    } else if (mode == 1) {
        renderFeedScreen()
    } else if (mode == 2) {
        renderCuddleScreen()
    } else if (mode == 3) {
        renderFlyScreen()
    } else if (mode == 4) {
        renderPlayScreen()
    } else {
        renderStatusScreen()
    }
}

// =====================
// SCREENS
// =====================

// Home: cat between two clouds, sparkle, mood caption
function renderPetScreen() {
    OLED12864_I2C.clear()
    drawHeader("SKY CAT")
    drawCloud(16, 13)
    drawCloud(106, 19)
    drawCat(72, 10)
    drawSparkle(40, 28)
    OLED12864_I2C.showString(0, 7, getCatCaption(), 1)
    OLED12864_I2C.draw()
}

// Feed: fish left, cat right, food bar
function renderFeedScreen() {
    OLED12864_I2C.clear()
    drawHeader("FEED")
    drawFish(4, 19)
    drawCat(85, 10)
    drawStatBar("FOOD", 5, food)
    OLED12864_I2C.showString(0, 7, "A=snack  B=next", 1)
    OLED12864_I2C.draw()
}

// Cuddle: hearts both sides, happy cat, joy bar
function renderCuddleScreen() {
    OLED12864_I2C.clear()
    drawHeader("CUDDLE")
    drawHeart(4, 16)
    drawHeart(112, 16)
    drawCat(72, 10)
    drawStatBar("JOY ", 5, joy)
    OLED12864_I2C.showString(0, 7, "A=cuddle B=next", 1)
    OLED12864_I2C.draw()
}

// Fly: speed lines left, cat right, cloud, pwr bar
function renderFlyScreen() {
    OLED12864_I2C.clear()
    drawHeader("FLY")
    OLED12864_I2C.hline(0, 17, 58, 1)
    OLED12864_I2C.hline(0, 24, 65, 1)
    OLED12864_I2C.hline(0, 31, 61, 1)
    OLED12864_I2C.hline(0, 38, 54, 1)
    drawCat(95, 10)
    drawCloud(112, 40)
    drawStatBar("PWR ", 5, energy)
    OLED12864_I2C.showString(0, 7, "A=zoom   B=next", 1)
    OLED12864_I2C.draw()
}

// Play: ball left, cat right, fun bar
function renderPlayScreen() {
    OLED12864_I2C.clear()
    drawHeader("PLAY")
    drawBall(6, 22)
    drawCat(85, 10)
    drawStatBar("FUN ", 5, fun)
    OLED12864_I2C.showString(0, 7, "A=toy    B=next", 1)
    OLED12864_I2C.draw()
}

// Status: four pixel bars, mood label
function renderStatusScreen() {
    OLED12864_I2C.clear()
    OLED12864_I2C.showString(0, 0, "SKY CAT STATUS", 1)
    OLED12864_I2C.hline(0, 9, 128, 1)
    drawStatBar("FOOD", 2, food)
    drawStatBar("JOY ", 3, joy)
    drawStatBar("PWR ", 4, energy)
    drawStatBar("FUN ", 5, fun)
    OLED12864_I2C.showString(0, 6, getMood(), 1)
    OLED12864_I2C.showString(0, 7, "A=care   B=next", 1)
    OLED12864_I2C.draw()
}

// =====================
// CUTSCENES (300ms + 400ms)
// =====================

function runFeedCutscene() {
    inCutscene = true
    OLED12864_I2C.clear()
    drawHeader("FEED")
    drawFish(20, 19)
    drawCat(85, 10)
    OLED12864_I2C.draw()
    basic.pause(300)
    OLED12864_I2C.clear()
    drawHeader("FEED")
    drawFish(56, 19)
    drawCat(85, 10)
    OLED12864_I2C.showString(0, 6, "nom nom!", 1)
    OLED12864_I2C.showString(0, 7, "food +", 1)
    OLED12864_I2C.draw()
    basic.pause(400)
    inCutscene = false
    renderCurrentScreen()
}

function runCuddleCutscene() {
    inCutscene = true
    OLED12864_I2C.clear()
    drawHeader("CUDDLE")
    drawHeart(4, 16)
    drawHeart(112, 16)
    drawCat(72, 10)
    OLED12864_I2C.draw()
    basic.pause(300)
    OLED12864_I2C.clear()
    drawHeader("CUDDLE")
    drawHeart(4, 16)
    drawHeart(112, 16)
    drawHeart(4, 32)
    drawHeart(112, 32)
    drawCat(72, 10)
    OLED12864_I2C.showString(0, 6, "purrrrr!", 1)
    OLED12864_I2C.showString(0, 7, "joy +", 1)
    OLED12864_I2C.draw()
    basic.pause(400)
    inCutscene = false
    renderCurrentScreen()
}

function runFlyCutscene() {
    inCutscene = true
    OLED12864_I2C.clear()
    drawHeader("FLY")
    OLED12864_I2C.hline(0, 17, 40, 1)
    OLED12864_I2C.hline(0, 25, 46, 1)
    OLED12864_I2C.hline(0, 33, 42, 1)
    drawCat(76, 10)
    OLED12864_I2C.draw()
    basic.pause(300)
    OLED12864_I2C.clear()
    drawHeader("FLY")
    OLED12864_I2C.hline(0, 17, 68, 1)
    OLED12864_I2C.hline(0, 25, 74, 1)
    OLED12864_I2C.hline(0, 33, 70, 1)
    drawCat(98, 10)
    drawCloud(113, 38)
    OLED12864_I2C.showString(0, 6, "Wheee! zoom!", 1)
    OLED12864_I2C.showString(0, 7, "pwr + fun +", 1)
    OLED12864_I2C.draw()
    basic.pause(400)
    inCutscene = false
    renderCurrentScreen()
}

function runPlayCutscene() {
    inCutscene = true
    OLED12864_I2C.clear()
    drawHeader("PLAY")
    drawBall(30, 22)
    drawCat(85, 10)
    OLED12864_I2C.draw()
    basic.pause(300)
    OLED12864_I2C.clear()
    drawHeader("PLAY")
    drawBall(62, 18)
    drawCat(85, 10)
    OLED12864_I2C.showString(0, 6, "play! fun+", 1)
    OLED12864_I2C.showString(0, 7, "fun + joy +", 1)
    OLED12864_I2C.draw()
    basic.pause(400)
    inCutscene = false
    renderCurrentScreen()
}

function runCareCutscene() {
    inCutscene = true
    OLED12864_I2C.clear()
    OLED12864_I2C.showString(0, 0, "SKY CAT STATUS", 1)
    OLED12864_I2C.hline(0, 9, 128, 1)
    drawStatBar("FOOD", 2, food)
    drawStatBar("JOY ", 3, joy)
    drawStatBar("PWR ", 4, energy)
    drawStatBar("FUN ", 5, fun)
    OLED12864_I2C.showString(0, 6, "all +", 1)
    OLED12864_I2C.showString(0, 7, "Keep kitty happy", 1)
    OLED12864_I2C.draw()
    basic.pause(400)
    inCutscene = false
    renderCurrentScreen()
}

// =====================
// PIXEL DRAWING HELPERS
// =====================

// Filled rectangle via stacked hlines (no native fillRect in this library)
function drawFill(x: number, y: number, w: number, h: number) {
    for (let i = 0; i < h; i++) {
        OLED12864_I2C.hline(x, y + i, w, 1)
    }
}

// Cat silhouette centered at (cx, ty). ~51px wide × 30px tall.
// Eyes are dark pixels punched into the filled white head.
function drawCat(cx: number, ty: number) {
    drawFill(cx - 10, ty, 5, 8)                      // left ear (5 calls)
    drawFill(cx + 5, ty, 5, 8)                       // right ear (5 calls)
    drawFill(cx - 13, ty + 6, 26, 14)                // head (14 calls)
    drawFill(cx - 7, ty + 19, 14, 12)               // body
    drawFill(cx - 25, ty + 16, 18, 10)               // left wing (10 calls)
    drawFill(cx + 7, ty + 16, 18, 10)                // right wing (10 calls)
    // Dark eyes (color=0 clears pixels within the filled head)
    OLED12864_I2C.pixel(cx - 5, ty + 11, 0)
    OLED12864_I2C.pixel(cx - 4, ty + 11, 0)
    OLED12864_I2C.pixel(cx - 5, ty + 12, 0)
    OLED12864_I2C.pixel(cx - 4, ty + 12, 0)
    OLED12864_I2C.pixel(cx + 4, ty + 11, 0)
    OLED12864_I2C.pixel(cx + 5, ty + 11, 0)
    OLED12864_I2C.pixel(cx + 4, ty + 12, 0)
    OLED12864_I2C.pixel(cx + 5, ty + 12, 0)
}

// Filled heart, ~12px wide × 12px tall, top-left at (x, y)
function drawHeart(x: number, y: number) {
    drawFill(x + 1, y, 4, 4)         // left bump
    drawFill(x + 7, y, 4, 4)         // right bump
    drawFill(x, y + 3, 12, 5)        // main body
    drawFill(x + 1, y + 8, 10, 2)    // lower taper
    drawFill(x + 3, y + 10, 6, 1)    // narrow
    drawFill(x + 5, y + 11, 2, 1)    // tip
}

// Fish pointing right (tail left, head right), ~16px wide × 12px tall
function drawFish(x: number, y: number) {
    drawFill(x, y + 2, 5, 4)         // upper tail fin
    drawFill(x, y + 8, 5, 4)         // lower tail fin
    drawFill(x + 2, y + 6, 4, 2)     // tail center join
    drawFill(x + 5, y + 1, 11, 10)   // body core
    drawFill(x + 6, y, 8, 12)        // body bulge
}

// Cloud, ~16px wide × 9px tall, centered at (cx, ty)
function drawCloud(cx: number, ty: number) {
    drawFill(cx - 8, ty + 4, 16, 5)              // base
    drawFill(cx - 5, ty, 10, 7)                   // dome
}

// 4-point sparkle, center at (cx, cy)
function drawSparkle(cx: number, cy: number) {
    OLED12864_I2C.hline(cx - 4, cy, 9, 1)
    OLED12864_I2C.vline(cx, cy - 4, 9, 1)
    OLED12864_I2C.pixel(cx - 2, cy - 2, 1)
    OLED12864_I2C.pixel(cx + 2, cy - 2, 1)
    OLED12864_I2C.pixel(cx - 2, cy + 2, 1)
    OLED12864_I2C.pixel(cx + 2, cy + 2, 1)
}

// Ball (circle approx), ~10px wide × 10px tall, top-left at (x, y)
function drawBall(x: number, y: number) {
    drawFill(x + 1, y, 8, 10)
    drawFill(x, y + 1, 10, 8)
}

// Stat bar: text label + outlined filled bar
// pageRow 0-7 maps to y = pageRow*8
function drawStatBar(label: string, pageRow: number, value: number) {
    OLED12864_I2C.showString(0, pageRow, label, 1)
    let y = pageRow * 8
    let barX = 26
    let barMaxW = 99
    OLED12864_I2C.rect(barX, y + 1, barX + barMaxW + 1, y + 6, 1)
    let fill = Math.round(value * barMaxW / 100)
    if (fill > 0) {
        drawFill(barX + 1, y + 2, fill, 4)
    }
}

// Header: title left, stat chars right, 1px divider line
function drawHeader(title: string) {
    let stats = "F" + statChar(food) + "J" + statChar(joy) + "E" + statChar(energy)
    OLED12864_I2C.showString(0, 0, title, 1)
    OLED12864_I2C.showString(19, 0, stats, 1)   // charX 19 = pixel x 95
    OLED12864_I2C.hline(0, 9, 128, 1)
}

// =====================
// TEXT / LOGIC HELPERS
// =====================

function statChar(v: number): string {
    if (v >= 66) { return "#" }
    if (v >= 33) { return "." }
    return "-"
}

function getCatCaption(): string {
    let m = getMood()
    if (m == "HAPPY") { return "sky cruise!" }
    if (m == "CONTENT") { return "soaring easy" }
    if (m == "TIRED") { return "sleepy..." }
    if (m == "HUNGRY") { return "hungry..." }
    return "bored..."
}

function getMood(): string {
    if (energy < 25) { return "TIRED" }
    if (food < 25) { return "HUNGRY" }
    let avg = (food + joy + energy + fun) / 4
    if (avg >= 75) { return "HAPPY" }
    if (avg >= 50) { return "CONTENT" }
    return "SAD"
}

function clamp(value: number): number {
    if (value < 0) { return 0 }
    if (value > 100) { return 100 }
    return value
}
