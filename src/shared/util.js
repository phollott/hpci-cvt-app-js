const isNil = (value) => {
  return typeof value === 'undefined' || value === null;
};

const isObjectEmpty = (obj) => {
  return (
    !isNil(obj) && Object.keys(obj).length === 0 && obj.constructor === Object
  );
};

export { isNil, isObjectEmpty };
