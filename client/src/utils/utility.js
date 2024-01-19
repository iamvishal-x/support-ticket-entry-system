const filterAndTrim = (object) => {
  const result = Object.keys(object).reduce((acc, curr) => {
    if (object[curr]) {
      return { ...acc, [curr]: object[curr].trim() };
    }
    return acc;
  }, {});
  return result;
};

export default { filterAndTrim };
