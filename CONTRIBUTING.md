# Contributing

First read the [Developer Guide for contributing to MyParcel repositories]. Then follow the instructions below.

## Pre-requisites

- Node.js 24.21 or later, within major 24
- pnpm 12.6 or later, within major 12
- No Volta on your machine. Its `yarn` does not go through corepack, so the `packageManager` field in `package.json`
  does not stop it.

## Development

### Setup

Install dependencies:

```bash
pnpm install
```

Download the translations:

```bash
pnpm translations:import
```

The project is now ready to use.

### Running the project

Run `pnpm serve` to start the sandbox and development server for the delivery options.

It outputs two URLs (may vary depending on your environment):

- http://localhost:9860: The sandbox. This is where you can see the delivery options in action and dynamically change settings.
- http://localhost:5173: The standalone delivery options. This appears as a blank page initially. Open your browser console to see instructions on how to use it.

### Running tests

Use `pnpm test` to run the tests.

The commands that every package shares (`clean`, `lint`, `lint:fix`, `test`, `test:coverage`, `test:run` and `test:update`) are nx targets in `targetDefaults` in `nx.json`. Run one in a single package with `pnpm nx <target> <package name>`, for example `pnpm nx test:run @myparcel-dev/do-shared`.
Inside a package folder, use `pnpm nx <target>`: `pnpm <target>` does not find these targets.

### Linting

Make sure you enable ESLint in your editor. Prettier is included in the ESLint configuration.

[Developer Guide for contributing to MyParcel repositories]: https://github.com/myparcelnl/developer/blob/main/DEVELOPERS.md
