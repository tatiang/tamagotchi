// Sky Cat v4.0 — Pixel-art OLED Tamagotchi
//
// Pixel drawing uses the OLED12864_I2C extended API:
//   drawLine(x1, y1, x2, y2, color)
//   drawRect(x, y, w, h, color)
//   drawPixel(x, y, color)
//   color: 1 = on (white), 0 = off (black)
//
// Controls:
//   A   = action for current mode
//   B   = cycle to next mode
//   A+B = jump to status screen
//
// Modes: PET(0) FEED(1) CUDDLE(2) FLY(3) PLAY(4) STATUS(5)
//
// Wiring:
//   OLED GND -> GND
//   OLED VCC -> 3V
//   OLED SCL -> P19
//   OLED SDA -> P20

// =====================
// STATS (all 0–100)
// =====================

let food = 72
let joy = 80
let energy = 68
let fun = 66

// =====================
// MODE & STATE
// =====================

// 0=PET  1=FEED  2=CUDDLE  3=FLY  4=PLAY  5=STATUS
let mode = 0
let inCutscene = false

// =====================
// STARTUP
// =====================

OLED12864_I2C.init(60)
basic.showString("V4")
renderCurrentScreen()

// =====================
// BUTTON HANDLERS
// =====================

input.onButtonPressed(Button.A, function () {
    if (inCutscene) { return }
    basic.showIcon(IconNames.Heart)
    doAction()
})

input.onButtonPressed(Button.B, function () {
    if (inCutscene) { return }
    basic.showArrow(ArrowNames.East)
    mode = (mode + 1) % 6
    renderCurrentScreen()
})

input.onButtonPressed(Button.AB, function () {
    if (inCutscene) { return }
    basic.showIcon(IconNames.Yes)
    mode = 5
    renderCurrentScreen()
})

// =====================
// ACTION DISPATCHER
// =====================

function doAction() {
    if (mode == 0) {        // PET: quick pet
        joy = clamp(joy + 8)
        fun = clamp(fun + 4)
        runCuddleCutscene()
    } else if (mode == 1) { // FEED: snack time
        food = clamp(food + 15)
        energy = clamp(energy - 3)
        runFeedCutscene()
    } else if (mode == 2) { // CUDDLE: big cuddle
        joy = clamp(joy + 12)
        energy = clamp(energy + 3)
        runCuddleCutscene()
    } else if (mode == 3) { // FLY: zoomies
        energy = clamp(energy + 12)
        fun = clamp(fun + 8)
        food = clamp(food - 5)
        runFlyCutscene()
    } else if (mode == 4) { // PLAY: toy time
        fun = clamp(fun + 12)
        joy = clamp(joy + 6)
        energy = clamp(energy - 5)
        food = clamp(food - 3)
        runPlayCutscene()
    } else {                // STATUS: small care boost
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

// Home / idle: cat floating between two clouds, mood caption below
function renderPetScreen() {
    OLED12864_I2C.clear()
    drawHeader("SKY CAT")
    drawCloud(16, 14)
    drawCloud(106, 20)
    drawCat(72, 10)
    drawSparkle(46, 29)
    OLED12864_I2C.showString(0, 7, getCatCaption(), 1)
    OLED12864_I2C.draw()
}

// Feed: fish icon on left, cat on right, food bar
function renderFeedScreen() {
    OLED12864_I2C.clear()
    drawHeader("FEED")
    drawFish(4, 20)
    drawCat(90, 10)
    drawStatBar("FOOD", 5, food)
    OLED12864_I2C.showString(0, 7, "A=snack  B=next", 1)
    OLED12864_I2C.draw()
}

// Cuddle: hearts on both sides, happy cat, joy bar
function renderCuddleScreen() {
    OLED12864_I2C.clear()
    drawHeader("CUDDLE")
    drawHeart(4, 18)
    drawHeart(114, 18)
    drawCat(72, 10)
    drawStatBar("JOY ", 5, joy)
    OLED12864_I2C.showString(0, 7, "A=cuddle B=next", 1)
    OLED12864_I2C.draw()
}

// Fly: horizontal speed lines left, cat flying right, pwr bar
function renderFlyScreen() {
    OLED12864_I2C.clear()
    drawHeader("FLY")
    OLED12864_I2C.drawLine(0, 18, 52, 18, 1)
    OLED12864_I2C.drawLine(0, 25, 60, 25, 1)
    OLED12864_I2C.drawLine(0, 32, 55, 32, 1)
    OLED12864_I2C.drawLine(0, 39, 48, 39, 1)
    drawCat(95, 10)
    drawCloud(110, 42)
    drawStatBar("PWR ", 5, energy)
    OLED12864_I2C.showString(0, 7, "A=zoom   B=next", 1)
    OLED12864_I2C.draw()
}

// Play: ball on left, cat on right, fun bar
function renderPlayScreen() {
    OLED12864_I2C.clear()
    drawHeader("PLAY")
    drawBall(6, 22)
    drawCat(90, 10)
    drawStatBar("FUN ", 5, fun)
    OLED12864_I2C.showString(0, 7, "A=toy    B=next", 1)
    OLED12864_I2C.draw()
}

// Status: four pixel bars + mood label
function renderStatusScreen() {
    OLED12864_I2C.clear()
    OLED12864_I2C.showString(0, 0, "SKY CAT STATUS", 1)
    OLED12864_I2C.drawLine(0, 9, 127, 9, 1)
    drawStatBar("FOOD", 2, food)
    drawStatBar("JOY ", 3, joy)
    drawStatBar("PWR ", 4, energy)
    drawStatBar("FUN ", 5, fun)
    OLED12864_I2C.showString(0, 6, getMood(), 1)
    OLED12864_I2C.showString(0, 7, "A=care   B=next", 1)
    OLED12864_I2C.draw()
}

// =====================
// CUTSCENES
// 2 frames: 300ms + 400ms = 700ms total
// =====================

function runFeedCutscene() {
    inCutscene = true
    OLED12864_I2C.clear()
    drawHeader("FEED")
    drawFish(22, 20)
    drawCat(90, 10)
    OLED12864_I2C.draw()
    basic.pause(300)
    OLED12864_I2C.clear()
    drawHeader("FEED")
    drawFish(62, 20)
    drawCat(90, 10)
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
    drawHeart(4, 17)
    drawHeart(114, 17)
    drawCat(72, 10)
    OLED12864_I2C.draw()
    basic.pause(300)
    OLED12864_I2C.clear()
    drawHeader("CUDDLE")
    drawHeart(4, 17)
    drawHeart(114, 17)
    drawHeart(4, 32)
    drawHeart(114, 32)
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
    OLED12864_I2C.drawLine(0, 18, 38, 18, 1)
    OLED12864_I2C.drawLine(0, 25, 45, 25, 1)
    OLED12864_I2C.drawLine(0, 32, 40, 32, 1)
    drawCat(76, 10)
    OLED12864_I2C.draw()
    basic.pause(300)
    OLED12864_I2C.clear()
    drawHeader("FLY")
    OLED12864_I2C.drawLine(0, 18, 66, 18, 1)
    OLED12864_I2C.drawLine(0, 25, 72, 25, 1)
    OLED12864_I2C.drawLine(0, 32, 68, 32, 1)
    drawCat(98, 10)
    drawCloud(112, 42)
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
    drawBall(32, 22)
    drawCat(90, 10)
    OLED12864_I2C.draw()
    basic.pause(300)
    OLED12864_I2C.clear()
    drawHeader("PLAY")
    drawBall(66, 18)
    drawCat(90, 10)
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
    OLED12864_I2C.drawLine(0, 9, 127, 9, 1)
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

// Filled rectangle: draws h horizontal lines of width w
function drawFill(x: number, y: number, w: number, h: number) {
    for (let i = 0; i < h; i++) {
        OLED12864_I2C.drawLine(x, y + i, x + w - 1, y + i, 1)
    }
}

// Cat silhouette centered at (cx, ty). Total: ~38px wide, 27px tall.
// Eyes are dark pixels punched into the white filled head.
function drawCat(cx: number, ty: number) {
    drawFill(cx - 10, ty, 5, 7)               // left ear
    drawFill(cx + 5, ty, 5, 7)                // right ear
    drawFill(cx - 11, ty + 5, 22, 13)         // head
    drawFill(cx - 6, ty + 17, 12, 10)         // body
    drawFill(cx - 19, ty + 15, 13, 8)         // left wing
    drawFill(cx + 6, ty + 15, 13, 8)          // right wing
    // Dark eyes punched into the filled head
    OLED12864_I2C.drawPixel(cx - 4, ty + 10, 0)
    OLED12864_I2C.drawPixel(cx - 3, ty + 10, 0)
    OLED12864_I2C.drawPixel(cx - 4, ty + 11, 0)
    OLED12864_I2C.drawPixel(cx - 3, ty + 11, 0)
    OLED12864_I2C.drawPixel(cx + 3, ty + 10, 0)
    OLED12864_I2C.drawPixel(cx + 4, ty + 10, 0)
    OLED12864_I2C.drawPixel(cx + 3, ty + 11, 0)
    OLED12864_I2C.drawPixel(cx + 4, ty + 11, 0)
}

// Heart, ~9px wide × 11px tall, top-left at (x, y)
function drawHeart(x: number, y: number) {
    drawFill(x + 1, y, 3, 3)
    drawFill(x + 5, y, 3, 3)
    drawFill(x, y + 2, 9, 4)
    drawFill(x + 1, y + 6, 7, 2)
    drawFill(x + 2, y + 8, 5, 1)
    drawFill(x + 3, y + 9, 3, 1)
    drawFill(x + 4, y + 10, 1, 1)
}

// Fish pointing right (tail left, head right), ~14px wide × 10px tall
function drawFish(x: number, y: number) {
    drawFill(x, y + 1, 4, 3)        // upper tail fin
    drawFill(x, y + 6, 4, 3)        // lower tail fin
    drawFill(x + 2, y + 4, 3, 2)    // tail center join
    drawFill(x + 4, y + 2, 10, 6)   // body core
    drawFill(x + 5, y + 1, 7, 8)    // body bulge
}

// Cloud centered at (cx, ty), ~16px wide × 8px tall
function drawCloud(cx: number, ty: number) {
    drawFill(cx - 8, ty + 3, 16, 5) // base
    drawFill(cx - 5, ty, 10, 6)     // top dome
}

// Lightning bolt, ~8px wide × 10px tall, top-left at (x, y)
function drawBolt(x: number, y: number) {
    drawFill(x + 3, y, 5, 5)        // top half
    drawFill(x + 1, y + 4, 6, 2)    // diagonal step
    drawFill(x, y + 5, 5, 5)        // bottom half
}

// 4-point sparkle, 7px × 7px, top-left at (x, y)
function drawSparkle(x: number, y: number) {
    OLED12864_I2C.drawLine(x + 3, y, x + 3, y + 6, 1)
    OLED12864_I2C.drawLine(x, y + 3, x + 6, y + 3, 1)
    OLED12864_I2C.drawPixel(x + 1, y + 1, 1)
    OLED12864_I2C.drawPixel(x + 5, y + 1, 1)
    OLED12864_I2C.drawPixel(x + 1, y + 5, 1)
    OLED12864_I2C.drawPixel(x + 5, y + 5, 1)
}

// Ball (octagonal circle approx), ~8px × 8px, top-left at (x, y)
function drawBall(x: number, y: number) {
    drawFill(x + 1, y, 6, 8)
    drawFill(x, y + 1, 8, 6)
}

// Pixel stat bar: text label at char row, outlined + filled bar beside it
function drawStatBar(label: string, row: number, value: number) {
    OLED12864_I2C.showString(0, row, label, 1)
    let py = row * 8 + 1
    let barX = 35
    let barMaxW = 88
    OLED12864_I2C.drawRect(barX, py, barMaxW + 2, 6, 1)
    let fill = Math.round(value * barMaxW / 100)
    if (fill > 0) {
        drawFill(barX + 1, py + 1, fill, 4)
    }
}

// Header: title left, F/J/E level chars right, 1px divider line
function drawHeader(title: string) {
    let stats = "F" + statChar(food) + "J" + statChar(joy) + "E" + statChar(energy)
    OLED12864_I2C.showString(0, 0, title, 1)
    OLED12864_I2C.showString(10, 0, stats, 1)
    OLED12864_I2C.drawLine(0, 9, 127, 9, 1)
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
