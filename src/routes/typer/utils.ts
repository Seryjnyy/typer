// TODO : what happens with non standard characters, like from different alphabets?
export const isTryingToType = (key: string) => {
    const isLetter = /^[a-zA-Z]$/.test(key);
    const isNumber = /^[0-9]$/.test(key);
    const isPunctuation = /^[.,:;?!'"()\-_=+[\]{}<>/@#$%^&*~`]$/.test(key);
    const isBackspace = key == "Backspace";

    return isLetter || isNumber || isPunctuation || isBackspace;
};
