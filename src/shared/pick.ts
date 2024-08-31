const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  kays: K[],
): Partial<T> => {
  const finalObject: Partial<T> = {};
  for (const kay of kays) {
    if (obj && Object.hasOwnProperty.call(obj, kay)) {
      finalObject[kay] = obj[kay];
    }
  }
  return finalObject;
};
export default pick;
