datalogger.onLogFull(function () {
    basic.showLeds(`
        # # # # #
        # # # # #
        # # # # #
        # # # # #
        # # # # #
        `)
})
input.onButtonPressed(Button.A, function () {
    basic.showNumber(c_reaction_time)
})
radio.onReceivedString(function (receivedString) {
    if (receivedString == "full") {
        if (paired == 0) {
            basic.showString("X")
        }
    } else if (receivedString == "start") {
        music.playTone(988, music.beat(BeatFraction.Half))
        received_start = 1
        start_time = control.millis()
        datalogger.log(datalogger.createCV("signal", -2))
    } else if (receivedString == "set") {
        basic.clearScreen()
        received_start = 0
        received_set = 1
        datalogger.log(datalogger.createCV("signal", -1))
    }
})
radio.onReceivedValue(function (name, value) {
    if (value == control.deviceSerialNumber()) {
        lane = name
        basic.showString(lane)
    }
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (paired == 0) {
        basic.showString("P")
        radio.sendString("pair")
        received_set = 0
        received_start = 0
    }
})
let end_time = 0
let c_roll = 0
let p_roll = 0
let c_accel = 0
let p_accel = 0
let received_set = 0
let start_time = 0
let received_start = 0
let c_reaction_time = 0
let lane = ""
let paired = 0
radio.setGroup(11)
radio.setTransmitSerialNumber(true)
paired = 0
lane = ""
datalogger.setColumnTitles("signal", "reaction")
basic.showString("pair")
input.setAccelerometerRange(AcceleratorRange.FourG)
datalogger.includeTimestamp(FlashLogTimeStampFormat.Milliseconds)
datalogger.log(datalogger.createCV("signal", -3))
c_reaction_time = 0
basic.forever(function () {
    if (received_set == 1) {
        p_accel = c_accel
        c_accel = input.acceleration(Dimension.Strength)
        p_roll = c_roll
        c_roll = input.rotation(Rotation.Roll)
        if (Math.abs(c_accel - p_accel) >= 500 || Math.abs(p_roll - p_roll) >= 5) {
            radio.sendString("movement")
            end_time = control.millis()
            c_reaction_time = end_time - start_time
            if (received_start == 0) {
                music.playMelody("C5 C5 A A F F D D ", 180)
                basic.showString("DQ")
                radio.sendValue(lane, -1)
                datalogger.log(datalogger.createCV("reaction", -1))
            } else {
                datalogger.log(datalogger.createCV("reaction", c_reaction_time))
                radio.sendValue(lane, c_reaction_time)
                basic.showLeds(`
                    . . # . .
                    . # # # .
                    # . # . #
                    . . # . .
                    . . # . .
                    `)
            }
            received_set = 0
        }
    }
})
