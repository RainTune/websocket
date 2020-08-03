export const isEmptyObject = (obj) => JSON.stringify(obj) == '{}'

export const firstUpperCase = (str) => {
  if(!str) return;
  return  str.charAt(0).toUpperCase() + str.slice(1)
}