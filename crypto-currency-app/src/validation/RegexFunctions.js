export const validEmail = new RegExp(
    '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
);
export const validPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');
export const validName = new RegExp('^[a-zA-Z ]+$');
export const validFloatNumber = new RegExp('^\\s*(?=.*[1-9])\\d*(?:\\.\\d{1,4})?\\s*$');

// regex pattern for validating a size of number
export const validSize = new RegExp('^[0-9]{1,6}$');

export const testFloatNumber = new RegExp('^\\s*(?=.*[1-9])\\d*(?:\\.\\d{1,4})?\\s*$');
