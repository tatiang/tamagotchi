// Sky Cat v3.0 — Polished OLED Tamagotchi
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
basic.showString("V3")
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
    } else {                // STATUS: small care boost to all stats
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

// Home / idle — cat floating with clouds, mood caption at bottom
function renderPetScreen() {
    OLED12864_I2C.clear()
    drawHeader("SKY CAT")
    OLED12864_I2C.showString(0, 2, "()  /\\_/\\   ()", 1)
    OLED12864_I2C.showString(0, 3, "   ~~(o.o)~~", 1)
    OLED12864_I2C.showString(0, 4, "     > ^ <", 1)
    OLED12864_I2C.showString(4, 5, "*", 1)
    OLED12864_I2C.showString(0, 7, getCatCaption(), 1)
    OLED12864_I2C.draw()
}

// Feed — fish icon left, cat right, food bar, snack prompt
function renderFeedScreen() {
    OLED12864_I2C.clear()
    drawHeader("FEED")
    OLED12864_I2C.showString(0, 2, "<><  /\\_/\\", 1)
    OLED12864_I2C.showString(0, 3, "   ~~(o.o)~~", 1)
    OLED12864_I2C.showString(0, 4, "     > ^ <", 1)
    OLED12864_I2C.showString(0, 5, "FOOD " + makeBar(food, 10), 1)
    OLED12864_I2C.showString(0, 7, "A=snack  B=next", 1)
    OLED12864_I2C.draw()
}

// Cuddle — hearts on sides, happy cat, joy bar
function renderCuddleScreen() {
    OLED12864_I2C.clear()
    drawHeader("CUDDLE")
    OLED12864_I2C.showString(0, 2, "<3  /\\_/\\  <3", 1)
    OLED12864_I2C.showString(0, 3, "   ~~(^.^)~~", 1)
    OLED12864_I2C.showString(0, 4, "     > <", 1)
    OLED12864_I2C.showString(0, 5, "JOY  " + makeBar(joy, 10), 1)
    OLED12864_I2C.showString(0, 7, "A=cuddle B=next", 1)
    OLED12864_I2C.draw()
}

// Fly — speed lines around cat, pwr bar
function renderFlyScreen() {
    OLED12864_I2C.clear()
    drawHeader("FLY")
    OLED12864_I2C.showString(0, 2, "== /\\_/\\ ==", 1)
    OLED12864_I2C.showString(0, 3, "~~~( o.o )~~~", 1)
    OLED12864_I2C.showString(0, 4, "    > ^ <", 1)
    OLED12864_I2C.showString(0, 5, "PWR  " + makeBar(energy, 10), 1)
    OLED12864_I2C.showString(0, 7, "A=zoom   B=next", 1)
    OLED12864_I2C.draw()
}

// Play — toy ball left, cat watching, fun bar
function renderPlayScreen() {
    OLED12864_I2C.clear()
    drawHeader("PLAY")
    OLED12864_I2C.showString(0, 2, "(*)  /\\_/\\", 1)
    OLED12864_I2C.showString(0, 3, "   ~~(o.o)~~", 1)
    OLED12864_I2C.showString(0, 4, "     > ^ <", 1)
    OLED12864_I2C.showString(0, 5, "FUN  " + makeBar(fun, 10), 1)
    OLED12864_I2C.showString(0, 7, "A=toy    B=next", 1)
    OLED12864_I2C.draw()
}

// Status — all four stat bars + mood label + care prompt
function renderStatusScreen() {
    OLED12864_I2C.clear()
    OLED12864_I2C.showString(0, 0, "SKY CAT STATUS", 1)
    OLED12864_I2C.showString(0, 1, "----------------", 1)
    OLED12864_I2C.showString(0, 2, "FOOD " + makeBar(food, 10), 1)
    OLED12864_I2C.showString(0, 3, "JOY  " + makeBar(joy, 10), 1)
    OLED12864_I2C.showString(0, 4, "PWR  " + makeBar(energy, 10), 1)
    OLED12864_I2C.showString(0, 5, "FUN  " + makeBar(fun, 10), 1)
    OLED12864_I2C.showString(0, 6, getMood(), 1)
    OLED12864_I2C.showString(0, 7, "A=care   B=next", 1)
    OLED12864_I2C.draw()
}

// =====================
// CUTSCENES
// Each cutscene: 2 frames with pause, then returns to the current screen.
// inCutscene flag blocks button input during playback.
// =====================

// Fish approaches cat, then cat eats it
function runFeedCutscene() {
    inCutscene = true
    OLED12864_I2C.clear()
    drawHeader("FEED")
    OLED12864_I2C.showString(0, 3, "<>< ->  /\\_/\\", 1)
    OLED12864_I2C.showString(0, 4, "         (o.o)", 1)
    OLED12864_I2C.showString(0, 5, "         > ^ <", 1)
    OLED12864_I2C.draw()
    basic.pause(600)
    OLED12864_I2C.clear()
    drawHeader("FEED")
    OLED12864_I2C.showString(0, 3, "     /\\_/\\", 1)
    OLED12864_I2C.showString(0, 4, "   (*.*)<><", 1)
    OLED12864_I2C.showString(0, 5, "     > ^ <", 1)
    OLED12864_I2C.showString(0, 6, "  nom nom!", 1)
    OLED12864_I2C.showString(0, 7, "food +", 1)
    OLED12864_I2C.draw()
    basic.pause(900)
    inCutscene = false
    renderCurrentScreen()
}

// Hearts float around cat, cat goes very happy
function runCuddleCutscene() {
    inCutscene = true
    OLED12864_I2C.clear()
    drawHeader("CUDDLE")
    OLED12864_I2C.showString(0, 2, "<3   /\\_/\\  <3", 1)
    OLED12864_I2C.showString(0, 3, "    ~~(^.^)~~", 1)
    OLED12864_I2C.showString(0, 4, "<3    > <   <3", 1)
    OLED12864_I2C.draw()
    basic.pause(600)
    OLED12864_I2C.clear()
    drawHeader("CUDDLE")
    OLED12864_I2C.showString(0, 2, " <3  /\\_/\\ <3", 1)
    OLED12864_I2C.showString(0, 3, "    ~~(^o^)~~", 1)
    OLED12864_I2C.showString(0, 4, "  <3  > <  <3", 1)
    OLED12864_I2C.showString(0, 6, "  purrrrr!", 1)
    OLED12864_I2C.showString(0, 7, "joy +", 1)
    OLED12864_I2C.draw()
    basic.pause(900)
    inCutscene = false
    renderCurrentScreen()
}

// Speed lines build, then cat zooms across with cloud
function runFlyCutscene() {
    inCutscene = true
    OLED12864_I2C.clear()
    drawHeader("FLY")
    OLED12864_I2C.showString(0, 2, "====", 1)
    OLED12864_I2C.showString(0, 3, "=====  /\\_/\\", 1)
    OLED12864_I2C.showString(0, 4, "=====~~(o.o)~~", 1)
    OLED12864_I2C.showString(0, 5, "        > ^ <", 1)
    OLED12864_I2C.draw()
    basic.pause(600)
    OLED12864_I2C.clear()
    drawHeader("FLY")
    OLED12864_I2C.showString(0, 2, "======  /\\_/\\", 1)
    OLED12864_I2C.showString(0, 3, "=====~~(o.o)~~()", 1)
    OLED12864_I2C.showString(0, 4, "======  > ^ <", 1)
    OLED12864_I2C.showString(0, 6, "  Wheee! zoom!", 1)
    OLED12864_I2C.showString(0, 7, "pwr + fun +", 1)
    OLED12864_I2C.draw()
    basic.pause(900)
    inCutscene = false
    renderCurrentScreen()
}

// Toy ball moves toward cat, then cat bats at it
function runPlayCutscene() {
    inCutscene = true
    OLED12864_I2C.clear()
    drawHeader("PLAY")
    OLED12864_I2C.showString(0, 2, "(*)--  /\\_/\\", 1)
    OLED12864_I2C.showString(0, 3, "       (o.o)", 1)
    OLED12864_I2C.showString(0, 4, "        > ^ <", 1)
    OLED12864_I2C.draw()
    basic.pause(600)
    OLED12864_I2C.clear()
    drawHeader("PLAY")
    OLED12864_I2C.showString(0, 2, "  /\\_/\\  (*)", 1)
    OLED12864_I2C.showString(0, 3, "  (^.^)--", 1)
    OLED12864_I2C.showString(0, 4, "   > ^ <", 1)
    OLED12864_I2C.showString(0, 6, "  play! fun+", 1)
    OLED12864_I2C.showString(0, 7, "fun + joy +", 1)
    OLED12864_I2C.draw()
    basic.pause(900)
    inCutscene = false
    renderCurrentScreen()
}

// All stats boosted — show updated bars with "all +" message
function runCareCutscene() {
    inCutscene = true
    OLED12864_I2C.clear()
    OLED12864_I2C.showString(0, 0, "SKY CAT STATUS", 1)
    OLED12864_I2C.showString(0, 1, "----------------", 1)
    OLED12864_I2C.showString(0, 2, "FOOD " + makeBar(food, 10), 1)
    OLED12864_I2C.showString(0, 3, "JOY  " + makeBar(joy, 10), 1)
    OLED12864_I2C.showString(0, 4, "PWR  " + makeBar(energy, 10), 1)
    OLED12864_I2C.showString(0, 5, "FUN  " + makeBar(fun, 10), 1)
    OLED12864_I2C.showString(0, 6, "   all +", 1)
    OLED12864_I2C.showString(0, 7, "Keep kitty happy", 1)
    OLED12864_I2C.draw()
    basic.pause(900)
    inCutscene = false
    renderCurrentScreen()
}

// =====================
// SHARED HELPERS
// =====================

// Top header: title left, F/J/E level chars right, then divider line
function drawHeader(title: string) {
    let stats = "F" + statChar(food) + "J" + statChar(joy) + "E" + statChar(energy)
    OLED12864_I2C.showString(0, 0, title, 1)
    OLED12864_I2C.showString(10, 0, stats, 1)
    OLED12864_I2C.showString(0, 1, "----------------", 1)
}

// Text bar: # = filled, . = empty, width chars total for a 0–100 value
function makeBar(value: number, width: number): string {
    let filled = Math.round(value * width / 100)
    let bar = ""
    for (let i = 0; i < width; i++) {
        if (i < filled) {
            bar = bar + "#"
        } else {
            bar = bar + "."
        }
    }
    return bar
}

// Single char showing a stat level: # = high (≥66), . = mid (≥33), - = low
function statChar(v: number): string {
    if (v >= 66) { return "#" }
    if (v >= 33) { return "." }
    return "-"
}

// Short caption for pet screen based on current mood
function getCatCaption(): string {
    let m = getMood()
    if (m == "HAPPY") { return "sky cruise!" }
    if (m == "CONTENT") { return "soaring easy" }
    if (m == "TIRED") { return "sleepy..." }
    if (m == "HUNGRY") { return "hungry..." }
    return "bored..."
}

// Overall mood derived from stat values
function getMood(): string {
    if (energy < 25) { return "TIRED" }
    if (food < 25) { return "HUNGRY" }
    let avg = (food + joy + energy + fun) / 4
    if (avg >= 75) { return "HAPPY" }
    if (avg >= 50) { return "CONTENT" }
    return "SAD"
}

// Clamp a stat to the 0–100 range
function clamp(value: number): number {
    if (value < 0) { return 0 }
    if (value > 100) { return 100 }
    return value
}
