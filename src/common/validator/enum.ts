import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments'

export const EnumMessage = (args: ValidationArguments) => {
    const { property, value, constraints } = args

    console.log(value, constraints)

    return `${property}必须是${constraints[1].join(', ')}其中之一`
}

export const defaultEnumOptions = {
    message: EnumMessage,
}
