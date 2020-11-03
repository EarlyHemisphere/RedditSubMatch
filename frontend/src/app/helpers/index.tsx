const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;
const length = 30;

const generateRandomString = () => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const generateAndStoreState = (identifier: string) => {
  const state = generateRandomString();
  window.sessionStorage.setItem(`state_${identifier}`, state);
  return state;
}