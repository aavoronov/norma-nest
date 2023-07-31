const reg = /.+@.+\.[A-Za-z]+$/;
const numbers = /[0-9]/g;

interface ICheckResult {
  correct: boolean;
  error?: string;
  result?: string;
}

export const checkEmail = (value: string): ICheckResult => {
  if (!value.match(reg))
    return { correct: false, error: 'You have entered an invalid email' };
  return { correct: true, result: value };
};
export const checkPhone = (value: string): ICheckResult => {
  // console.log('value', value);
  if (value.match(numbers).length < 11)
    return {
      correct: false,
      error: 'Минимальная длина телефона - 11 символов',
    };
  return { correct: true, result: value.match(numbers).join('') };
};
export const maskPhone = (phone: string): string => {
  const clearPhone = phone.replace(/[\[\]{}+()-]|\s/gm, '');
  if (clearPhone.length === 11) {
    const numberSplice = clearPhone
      .replace(/\D/g, '')
      .match(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/);
    return `+${numberSplice[1]} (${numberSplice[2]}) ${numberSplice[3]}-${numberSplice[4]}-${numberSplice[5]}`;
  }
  if (clearPhone.length === 12) {
    const numberSplice = clearPhone
      .replace(/\D/g, '')
      .match(/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/);
    return `+${numberSplice[1]} (${numberSplice[2]}) ${numberSplice[3]}-${numberSplice[4]}-${numberSplice[5]}`;
  }
  if (clearPhone.length === 13) {
    const numberSplice = clearPhone
      .replace(/\D/g, '')
      .match(/(\d{3})(\d{3})(\d{3})(\d{2})(\d{2})/);
    return `+${numberSplice[1]} (${numberSplice[2]}) ${numberSplice[3]}-${numberSplice[4]}-${numberSplice[5]}`;
  }
  if (clearPhone.length === 14) {
    const numberSplice = clearPhone
      .replace(/\D/g, '')
      .match(/(\d{4})(\d{3})(\d{3})(\d{2})(\d{2})/);
    return `+${numberSplice[1]} (${numberSplice[2]}) ${numberSplice[3]}-${numberSplice[4]}-${numberSplice[5]}`;
  }
};
