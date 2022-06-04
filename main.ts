radio.onReceivedString(function (receivedString) {
    if (receivedString == "full") {
        basic.showString("X")
    } else if (receivedString == "start") {
        received_start = 1
    } else if (receivedString == "set") {
        received_set = 1
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
let received_set = 0
let received_start = 0
let lane = ""
let paired = 0
let accel_arry: number[] = []
radio.setGroup(11)
radio.setTransmitSerialNumber(true)
paired = 0
lane = ""
basic.showString("touch to pair")
input.setAccelerometerRange(AcceleratorRange.FourG)
datalogger.mirrorToSerial(true)
datalogger.includeTimestamp(FlashLogTimeStampFormat.Milliseconds)
basic.forever(function () {
	
})
control.inBackground(function () {
    if (received_set == 1) {
        let list: number[] = []
        if (Math.abs(input.acceleration(Dimension.Strength) - list[-1]) >= 500) {
            radio.sendString("movement")
            music.playTone(262, music.beat(BeatFraction.Whole))
        }
    }
})
loops.everyInterval(200, function () {
    if (received_set == 1) {
        c_accel = input.acceleration(Dimension.Strength)
        if (accel_arry.length == 10) {
            accel_arry.shift()
        }
        accel_arry.push(c_accel)
        datalogger.log(datalogger.createCV("accel", c_accel))
    }
})
