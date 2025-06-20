# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.3.2] (2025-06-07)

### Bug Fixes

* Fixed critical bug with nullable array types (`string[] | null`) not preserving nullability
* Updated type system to properly handle union types with null and arrays
* Added extensive test coverage for nullable array handling
* Fixed type definitions in all conversion utilities: ObjectToCamel, ObjectToPascal, ObjectToSnake, and ObjectToCamelPrefix

## [2.3.1] (2025-06-07)

### Bug Fixes

* Fixed type handling for nullable arrays (`string[] | null`) in all conversion utilities
* Properly preserve null in union types to prevent TypeScript errors
* Added comprehensive tests for nullable array type handling

## [2.3.0] (2025-06-07)

### Features

* Fixed nullable array types handling for better type inference
* Switched build system to tsup for improved performance
* Migrated package management to pnpm

### [2.2.1] (2025-12-19)

### Features

* Added `objectToCamelPrefix` function to preserve prefixes like `_` or `$` when converting to camelCase

### [1.1.2](https://github.com/RossWilliams/ts-case-convert/compare/v1.1.1...v1.1.2) (2021-03-31)

### [1.1.1](https://github.com/RossWilliams/ts-case-convert/compare/v1.1.0...v1.1.1) (2021-03-31)


### Bug Fixes

* better support optional nested types ([ea7e171](https://github.com/RossWilliams/ts-case-convert/commit/ea7e1716abb445bd9b48c5a07028860cef962f1b))

## [1.1.0](https://github.com/RossWilliams/ts-case-convert/compare/v1.0.5...v1.1.0) (2021-03-24)


### Features

* export ObjectToCamel and ObjectToSnake types ([c48f0f3](https://github.com/RossWilliams/ts-case-convert/commit/c48f0f3f2b87f6eef6afcd818fb03869b564494a))

### [1.0.5](https://github.com/RossWilliams/ts-case-convert/compare/v1.0.4...v1.0.5) (2021-03-14)

### [1.0.4](https://github.com/RossWilliams/ts-case-convert/compare/v1.0.3...v1.0.4) (2021-03-14)

### [1.0.3](https://github.com/RossWilliams/ts-case-convert/compare/v1.0.2...v1.0.3) (2021-03-14)

### [1.0.2](https://github.com/RossWilliams/ts-case-convert/compare/v1.0.1...v1.0.2) (2021-03-14)

### 1.0.1 (2021-03-14)

### 0.1.1 (2021-03-14)
