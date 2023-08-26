function bindModelMethods(Model, methods) {
  Object.keys(methods).forEach(method => {
    Model[method] = methods[method].bind(Model);
  });
  return Model;
}

export default bindModelMethods;
