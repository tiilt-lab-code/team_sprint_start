radio.onReceivedString(function (receivedString) {
    if (receivedString == "full") {
        basic.showString("X")
    } else if (receivedString == "start") {
        received_start = 1
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
    }
})
let received_start = 0
let lane = ""
let paired = 0
radio.setGroup(11)
radio.setTransmitSerialNumber(true)
paired = 0
lane = ""
basic.showString("touch to pair")
input.setAccelerometerRange(AcceleratorRange.FourG)
datalogger.mirrorToSerial(true)
basic.forever(function () {
    datalogger.log(datalogger.createCV("accel", input.acceleration(Dimension.Strength)))
})
