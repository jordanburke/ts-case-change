<h1 align="center">ts-case-change</h1>
<p>
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/ts-case-change?style=flat">
  <img alt="npm type definitions" src="https://img.shields.io/npm/types/ts-case-change?style=flat">
  <a href="https://github.com/jordanburke/ts-case-change#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/jordanburke/ts-case-change/blob/master/LICENSE" target="_blank">
    <img alt="License: Apache--2.0" src="https://img.shields.io/github/license/jordanburke/ts-case-change" />
  </a>
</p>

ts-case-change converts object keys between camelCase and snake_case while preserving Typescript type information, code completion, and type validation. See tests for detailed conversion tests.

## Features

- Convert objects from snake_case to camelCase
- Convert objects from camelCase to snake_case
- Convert objects to PascalCase
- Preserve prefix characters like `_` and `$` during conversion
- Maintain full TypeScript type safety throughout conversion
- Handle nested objects and arrays
- Special handling for Date objects and Uint8Array/Buffer

## Installation

```sh
npm install ts-case-change
# or
yarn add ts-case-change
# or 
pnpm add ts-case-change
```

## Usage

```typescript
import { objectToCamel, objectToSnake, objectToPascal, objectToCamelPrefix } from 'ts-case-change';

const camel = objectToCamel({
  hello_world: 'helloWorld',
  a_number: 5,
  an_array: [1, 2, 4],
  null_object: null,
  undef_object: undefined,
  an_array_of_objects: [{ a_b: 'ab', a_c: 'ac' }],
  an_object: {
    a_1: 'a1',
    a_2: 'a2',
  },
});

type CheckCamel = typeof camel.anArrayOfObjects[0]['aB']; // -> 'string'
const ab: CheckCamel = camel.anArrayOfObjects[0]['aB']; // -> valid
console.log(camel.anArrayOfObjects[0].aB); // -> 'ab'

const snake = objectToSnake({
  helloWorld: 'helloWorld',
  aNumber: 5,
  anArray: [1, 2, 4],
  nullObject: null,
  undefObject: undefined,
  anArrayOfObjects: [{ aB: 'ab', aC: 'ac' }],
  anObject: {
    A1: 'a_1',
    A2: 'a_2',
  },
});

type CheckSnake = typeof snake.an_array_of_objects[0]['a_b']; // -> 'string'
const ab: CheckSnake = snake.an_array_of_objects[0]['a_b']; // -> valid
console.log(snake.an_array_of_objects[0].a_b); // -> 'ab'
```

## Development

### Building the project
```sh
pnpm build
```

### Running tests
```sh
pnpm test
```

## Documentation

See [tests](./test/caseConvert.test.ts) for detailed examples.

## Acknowledgments

This project is a fork of [ts-case-convert](https://github.com/RossWilliams/ts-case-convert) by Ross Williams.

## 📝 License

Copyright © 2021 [Ross Williams](https://github.com/RossWilliams) (original author)<br />
Copyright © 2024 [Jordan Burke](https://github.com/jordanburke) (modifications and enhancements)<br />
This project is [Apache-2.0](https://github.com/jordanburke/ts-case-change/blob/master/LICENSE) licensed.