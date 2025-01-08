import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const REGEX = /-?\d+(\.\d+)?/;
const MESSAGE = 'Text ($value) does not contain number!';

@ValidatorConstraint({ name: 'includeNumber', async: false })
export default class IncludeNumberValidator implements ValidatorConstraintInterface {
    public validate(text: string) {
        console.log('validate text', text)
        return REGEX.test(text);
    }

    public defaultMessage(args: ValidationArguments) {
        return MESSAGE;
    }
}