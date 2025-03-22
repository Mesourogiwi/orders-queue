export const getDigitsFromString = (value: string): string => {
    if (!value) {
        return ''
    }

    return value.replace(/\D/g, '').trim()
}

export const validateCpf = (cpf: string): boolean => {
    const BLOCKLIST: Array<string> = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
        '12345678909'
    ]

    cpf = getDigitsFromString(cpf)

    if (cpf.length !== 11) {
        return false
    }

    if (BLOCKLIST.includes(cpf)) {
        return false
    }

    let sum = 0
    let remainder = 0

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }

    remainder = (sum * 10) % 11

    if (remainder === 10 || remainder === 11) {
        remainder = 0
    }

    if (remainder !== parseInt(cpf.substring(9, 10))) {
        return false
    }

    sum = 0

    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }

    remainder = (sum * 10) % 11

    if (remainder === 10 || remainder === 11) {
        remainder = 0
    }

    return remainder === parseInt(cpf.substring(10, 11))
}
