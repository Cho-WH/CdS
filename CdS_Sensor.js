// ====================================================
// 5단 광량계 - MakeCode for Micro:bit
// CdS 센서를 이용한 빛의 세기 측정 및 LED 출력
// ====================================================

// 변수 선언
let sensorValue = 0      // P0에서 읽은 아날로그 값 (0~1023)
let lightLevel = 0       // 매핑된 값 (0~5)

// 무한 반복
basic.forever(function () {
    
    // 1단계: P0에서 아날로그 값 읽기 (CdS 센서)
    sensorValue = pins.analogReadPin(AnalogPin.P0)
    
    // 2단계: 값 변환 (Mapping)
    // 0~1023 범위를 0~5 범위로 변환
    lightLevel = pins.map(
        sensorValue,    // 입력 값
        0,              // 입력 최소값
        1023,           // 입력 최대값
        0,              // 출력 최소값
        5               // 출력 최대값
    )
    
    // 3단계: LED 제어 (조건문 사용)
    // lightLevel 값에 따라 LED를 하나씩 켜기
    
    // LED 1 (P1): lightLevel이 1보다 크면 켜기
    if (lightLevel > 0) {
        pins.digitalWritePin(DigitalPin.P1, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P1, 0)
    }
    
    // LED 2 (P2): lightLevel이 2보다 크면 켜기
    if (lightLevel > 1) {
        pins.digitalWritePin(DigitalPin.P2, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P2, 0)
    }
    
    // LED 3 (P8): lightLevel이 3보다 크면 켜기
    if (lightLevel > 2) {
        pins.digitalWritePin(DigitalPin.P8, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P8, 0)
    }
    
    // LED 4 (P12): lightLevel이 4보다 크면 켜기
    if (lightLevel > 3) {
        pins.digitalWritePin(DigitalPin.P12, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P12, 0)
    }
    
    // LED 5 (P16): lightLevel이 5보다 크면 켜기
    if (lightLevel > 4) {
        pins.digitalWritePin(DigitalPin.P16, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P16, 0)
    }
    
    // 4단계: 딜레이 (너무 빠르게 반복하지 않도록)
    basic.pause(100)
})
