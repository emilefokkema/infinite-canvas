import { sayHello } from "../src/say-hello.ts"

test('says hello', () => {
  expect(sayHello("emile")).toBe("hello emile");
});