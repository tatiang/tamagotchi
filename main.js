// Sky Cat OLED - Version 2.0
//
// Changes from v1.40:
//   - Added getMood() and getCatFace()
//   - Home screen now shows ASCII cat face + mood + current mode
//   - Stats screen now shows mood label
//   - Stats are clamped before the screen draws so face reflects current values
//
// No animation. No forever screen refresh.
// OLED only changes when A, B, or A+B is pressed.
//
// Controls:
//   A   = care/action
//   B   = change mode
//   A+B = stats screen
//
// Wiring:
//   OLED GND -> GND
//   OLED VCC -> 3V
//   OLED SCL -> P19
//   OLED SDA -> P20

let mode = 0

let food = 72
let joy = 80
let energy = 68
let fun = 66

let modes = ["PET", "FEED", "PLAY"]

OLED12864_I2C.init(60)

basic.showString("READY")
showHomeScreen()

input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.Heart)

    if (mode == 0) {
        joy += 8
        fun += 4
    } else if (mode == 1) {
        food += 15
        energy += -3
    } else {
        fun += 12
        energy += -6
        joy += 4
    }

    clampStats()

    if (mode == 0) {
        showMessageScreen("PET", "PURR!", "JOY UP")
    } else if (mode == 1) {
        showMessageScreen("FEED", "NOM NOM", "FOOD UP")
    } else {
        showMessageScreen("PLAY", "ZOOM!", "FUN UP")
    }
})

input.onButtonPressed(Button.B, function () {
    basic.showArrow(ArrowNames.East)

    mode += 1
    if (mode >= modes.length) {
        mode = 0
    }

    showModeScreen()
})

input.onButtonPressed(Button.AB, function () {
    basic.showIcon(IconNames.Yes)
    showStatsScreen()
})

// --------------------
// OLED screens
// --------------------

function showHomeScreen() {
    OLED12864_I2C.clear()
    OLED12864_I2C.showString(0, 0, "SKY CAT", 1)
    OLED12864_I2C.showString(0, 2, getCatFace(), 1)
    OLED12864_I2C.showString(0, 4, getMood(), 1)
    OLED12864_I2C.showString(0, 6, "MODE: " + modes[mode], 1)
    OLED12864_I2C.showString(0, 7, "A ACT  B MODE", 1)
    OLED12864_I2C.draw()
}

function showModeScreen() {
    OLED12864_I2C.clear()
    OLED12864_I2C.showString(0, 0, "MODE", 1)
    OLED12864_I2C.showString(0, 2, modes[mode], 2)

    if (mode == 0) {
        OLED12864_I2C.showString(0, 5, "A = PET CAT", 1)
    } else if (mode == 1) {
        OLED12864_I2C.showString(0, 5, "A = FEED CAT", 1)
    } else {
        OLED12864_I2C.showString(0, 5, "A = PLAY", 1)
    }

    OLED12864_I2C.showString(0, 7, "B NEXT  A+B STATS", 1)
    OLED12864_I2C.draw()
}

function showMessageScreen(title: string, bigText: string, smallText: string) {
    OLED12864_I2C.clear()
    OLED12864_I2C.showString(0, 0, title, 1)
    OLED12864_I2C.showString(0, 2, bigText, 2)
    OLED12864_I2C.showString(0, 5, smallText, 1)
    OLED12864_I2C.showString(0, 7, "B MODE  A+B STATS", 1)
    OLED12864_I2C.draw()
}

function showStatsScreen() {
    OLED12864_I2C.clear()
    OLED12864_I2C.showString(0, 0, "SKY CAT STATS", 1)
    OLED12864_I2C.showString(0, 1, getMood(), 1)

    OLED12864_I2C.showString(0, 2, "FOOD", 1)
    OLED12864_I2C.showNumber(6, 2, food, 1)

    OLED12864_I2C.showString(0, 3, "JOY", 1)
    OLED12864_I2C.showNumber(6, 3, joy, 1)

    OLED12864_I2C.showString(0, 4, "ENG", 1)
    OLED12864_I2C.showNumber(6, 4, energy, 1)

    OLED12864_I2C.showString(0, 5, "FUN", 1)
    OLED12864_I2C.showNumber(6, 5, fun, 1)

    OLED12864_I2C.showString(0, 7, "A ACT  B MODE", 1)
    OLED12864_I2C.draw()
}

// --------------------
// Mood logic
// --------------------

function getMood(): string {
    if (energy < 25) {
        return "TIRED"
    }
    if (food < 25) {
        return "HUNGRY"
    }
    let avg = (food + joy + energy + fun) / 4
    if (avg >= 75) {
        return "HAPPY"
    }
    if (avg >= 50) {
        return "CONTENT"
    }
    return "SAD"
}

function getCatFace(): string {
    let m = getMood()
    if (m == "HAPPY") {
        return "(^o^)"
    }
    if (m == "CONTENT") {
        return "(=^.^=)"
    }
    if (m == "TIRED") {
        return "(-_-)"
    }
    if (m == "HUNGRY") {
        return "(o_o)"
    }
    return "(;_;)"
}

// --------------------
// Helpers
// --------------------

function clampStats() {
    food = clampValue(food)
    joy = clampValue(joy)
    energy = clampValue(energy)
    fun = clampValue(fun)
}

function clampValue(value: number): number {
    if (value < 0) {
        return 0
    }
    if (value > 100) {
        return 100
    }
    return value
}
