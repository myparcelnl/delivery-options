# Contributing

First read the [Developer Guide for contributing to MyParcel repositories]. Then follow the instructions below.

## Pre-requisites

To run this project, you need Node 20 and Yarn. Yarn is bundled with the project, but you need to have (any version) globally to use the `yarn` command.

We recommend using [Volta](https://volta.sh) for Node management. It'll automatically make sure the right version of Node is used within our projects.

## Development

### Setup

Install dependencies using Yarn:

```bash
yarn
```

Download the translations:

```bash
yarn translations:import
```

The project is now ready to use.

### Running the project

Run `yarn serve` to start the sandbox and development server for the delivery options.

It outputs two URLs (may vary depending on your environment):

- http://localhost:9860: The sandbox. This is where you can see the delivery options in action and dynamically change settings.
- http://localhost:5173: The standalone delivery options. This appears as a blank page initially. Open your browser console to see instructions on how to use it.

### Running tests

Use `yarn test` to run the tests.

### Linting

Make sure you enable ESLint in your editor. Prettier is included in the ESLint configuration.

[Developer Guide for contributing to MyParcel repositories]: https://github.com/myparcelnl/developer/blob/main/DEVELOPERS.md
