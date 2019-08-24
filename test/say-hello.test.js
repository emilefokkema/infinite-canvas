const sayHello = require("../src/say-hello");

test('says hello', () => {
  expect(sayHello("emile")).toBe("hello emile");
});