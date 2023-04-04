export const charBarFull = '█';
export const charBarEmpty = '░';
export const charLine = '─';

export const printBar = (value: number = 30): void => {
  process.env.NODE_ENV === 'development' &&
    console.log(charBarFull.repeat(value));
};

export const printBarEmpty = (value: number = 30): void => {
  process.env.NODE_ENV === 'development' &&
    console.log(charBarEmpty.repeat(value));
};

export const printLine = (value: number = 30): void => {
  process.env.NODE_ENV === 'development' && console.log(charLine.repeat(value));
};

export const printMe = (name: string, obj: any): void => {
  process.env.NODE_ENV === 'development' &&
    console.log(name, JSON.stringify(obj, null, 2));
};
