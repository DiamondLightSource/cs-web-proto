export function filterUndefinedOut(input: {
  [index: string]: any;
}): { [index: string]: any } {
  const output: { [index: string]: any } = {};
  let key;

  for (key in input) {
    if (input.hasOwnProperty(key) && input[key] !== undefined) {
      output[key] = input[key];
    }
  }

  return output;
}
