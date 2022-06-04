radio.onReceivedString(function (receivedString) {
    if (receivedString == "full") {
        basic.showString("X")
    } else if (receivedString == "start") {
        received_start = 1
        datalogger.log(datalogger.createCV("accel", -2))
    } else if (receivedString == "set") {
        received_set = 1
        p_accel = input.acceleration(Dimension.Strength)
        c_accel = input.acceleration(Dimension.Strength)
        datalogger.log(datalogger.createCV("accel", -1))
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
        basic.showString("X")
        radio.sendString("pair")
        received_set = 0
        received_start = 0
    }
})
let c_accel = 0
let p_accel = 0
let received_set = 0
let received_start = 0
let lane = ""
let paired = 0
radio.setGroup(11)
radio.setTransmitSerialNumber(true)
paired = 0
lane = ""
basic.showString("pair")
input.setAccelerometerRange(AcceleratorRange.FourG)
datalogger.mirrorToSerial(true)
datalogger.includeTimestamp(FlashLogTimeStampFormat.Milliseconds)
basic.forever(function () {
	
})
loops.everyInterval(200, function () {
    if (received_set == 1) {
        p_accel = c_accel
        c_accel = input.acceleration(Dimension.Strength)
        datalogger.log(datalogger.createCV("p_accel", p_accel))
        datalogger.log(datalogger.createCV("accel", c_accel))
        if (Math.abs(c_accel - p_accel) >= 500) {
            radio.sendString("movement")
            music.playTone(175, music.beat(BeatFraction.Half))
            received_set = 0
        }
    }
})
