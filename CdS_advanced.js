// ====================================================
// 5단 광량계 - 세련된 버전 (배열 + 반복문 활용)
// CdS 센서를 이용한 빛의 세기 측정 및 LED 출력
// ====================================================

// LED 핀 번호를 배열로 관리
let ledPins = [
    DigitalPin.P1,
    DigitalPin.P2,
    DigitalPin.P8,
    DigitalPin.P12,
    DigitalPin.P16
]

// 변수 선언
let sensorValue = 0
let lightLevel = 0

// 무한 반복
basic.forever(function () {

    // 1단계: P0에서 아날로그 값 읽기
    sensorValue = pins.analogReadPin(AnalogPin.P0)

    // 2단계: 값 변환 (0~1023 → 0~5)
    lightLevel = pins.map(sensorValue, 0, 1023, 0, 5)

    // 3단계: 반복문으로 모든 LED 제어
    // i는 0부터 4까지 (LED 5개)
    for (let i = 0; i < ledPins.length; i++) {
        // i번째 LED를 켤지 말지 결정
        // lightLevel이 i+1보다 크면 켜기
        if (lightLevel > i) {
            pins.digitalWritePin(ledPins[i], 1)
        } else {
            pins.digitalWritePin(ledPins[i], 0)
        }
    }

    // 4단계: 딜레이
    basic.pause(100)
})
