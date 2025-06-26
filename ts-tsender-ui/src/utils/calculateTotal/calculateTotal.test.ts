import { describe, test, expect } from 'vitest'
import { calculateTotal } from './calculateTotal'

describe('calculateTotal', () => {
  test('정상적인 숫자 문자열들의 합계를 계산한다', () => {
    const amounts = `100\n250\n50`
    const result = calculateTotal(amounts)
    expect(result).toBe(400)
  })

  test('소수점이 포함된 숫자들의 합계를 계산한다', () => {
    const amounts = `10.5\n20.25\n5.75`
    const result = calculateTotal(amounts)
    expect(result).toBe(36.5)
  })

  test('빈 줄이 포함된 경우 빈 줄을 무시한다', () => {
    const amounts = `100\n\n250\n\n50`
    const result = calculateTotal(amounts)
    expect(result).toBe(400)
  })

  test('공백이 포함된 숫자들을 처리한다', () => {
    const amounts = `  100  \n  250  \n  50  `
    const result = calculateTotal(amounts)
    expect(result).toBe(400)
  })

  test('빈 문자열인 경우 0을 반환한다', () => {
    const amounts = ''
    const result = calculateTotal(amounts)
    expect(result).toBe(0)
  })

  test('잘못된 숫자 형식이 포함된 경우 0으로 처리한다', () => {
    const amounts = `100\nabc\n250\nxyz\n50`
    const result = calculateTotal(amounts)
    expect(result).toBe(400) // 유효한 숫자들만 합계: 100 + 250 + 50
  })

  test('음수가 포함된 경우도 처리한다', () => {
    const amounts = `100\n-50\n250`
    const result = calculateTotal(amounts)
    expect(result).toBe(300)
  })

  test('0이 포함된 경우를 처리한다', () => {
    const amounts = `100\n0\n250\n0`
    const result = calculateTotal(amounts)
    expect(result).toBe(350)
  })

  test('한 줄에 하나의 숫자만 있는 경우', () => {
    const amounts = '42'
    const result = calculateTotal(amounts)
    expect(result).toBe(42)
  })

  test('매우 큰 숫자들을 처리한다', () => {
    const amounts = `1000000\n2000000\n3000000`
    const result = calculateTotal(amounts)
    expect(result).toBe(6000000)
  })

  test('과학적 표기법을 처리한다', () => {
    const amounts = `1e2\n2e3\n3e1`
    const result = calculateTotal(amounts)
    expect(result).toBe(2130) // 100 + 2000 + 30
  })

  test('부동소수점 정밀도 문제를 확인한다', () => {
    const amounts = `0.1\n0.2\n0.3`
    const result = calculateTotal(amounts)
    expect(result).toBeCloseTo(0.6, 10) // 부동소수점 정밀도 고려
  })

  test('매우 작은 소수들을 처리한다', () => {
    const amounts = `0.001\n0.002\n0.003`
    const result = calculateTotal(amounts)
    expect(result).toBeCloseTo(0.006, 3)
  })

  test('다양한 형태의 공백과 줄바꿈을 처리한다', () => {
    const amounts = `\t100\t\n\r\n250\r\n\n\n50\n\n`
    const result = calculateTotal(amounts)
    expect(result).toBe(400)
  })
})