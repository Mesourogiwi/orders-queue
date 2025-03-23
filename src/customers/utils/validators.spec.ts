import {validateCpf} from './validators'

describe('validate cpf', () => {
    it('should return a valid cpf', () => {
        const cpf = '243.771.463-43'
        const isValidCpf = validateCpf(cpf)
        expect(isValidCpf).toBeTruthy()
    })

    it('should return false if cpf is blocklisted', () => {
        expect(validateCpf('00000000000')).toBe(false)
        expect(validateCpf('11111111111')).toBe(false)
        expect(validateCpf('22222222222')).toBe(false)
        expect(validateCpf('33333333333')).toBe(false)
        expect(validateCpf('44444444444')).toBe(false)
        expect(validateCpf('55555555555')).toBe(false)
        expect(validateCpf('66666666666')).toBe(false)
        expect(validateCpf('77777777777')).toBe(false)
        expect(validateCpf('88888888888')).toBe(false)
        expect(validateCpf('99999999999')).toBe(false)
        expect(validateCpf('12345678909')).toBe(false)
    })

    it('should return false if cpf is invalid', () => {
        expect(validateCpf('1234567890')).toBe(false)
        expect(validateCpf('12345678901')).toBe(false)
        expect(validateCpf('123456789012')).toBe(false)
    })
})
