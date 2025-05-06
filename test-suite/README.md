# Udon Finance Test Suite

This repository contains automated tests for the Udon Finance blockchain application built on Chromia. The test suite provides comprehensive testing of backend operations including asset management, role-based access control, and pool functionality.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Writing Tests](#writing-tests)
- [Path Aliases](#path-aliases)
- [CI/CD Integration](#cicd-integration)
- [Contributing](#contributing)

## Overview

The Udon Finance test suite is built with TypeScript, Jest, and the Chromia FT4 framework. It provides:

- End-to-end integration tests for blockchain interactions
- Unit tests for specific modules
- Test fixtures and utilities for simplified test authoring
- Role-based authentication testing
- Asset creation, transfer, and balance validation

## Setup

### Prerequisites

- Node.js 16.x or higher
- Yarn package manager
- Access to a Chromia node (local or testnet)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```
NODE_URL=<your-chromia-node-url>
BLOCKCHAIN_RID=<your-blockchain-rid>
```

## Running Tests

To run all tests:

```bash
yarn test
```

To run a specific test file:

```bash
yarn test src/test/pool/a-asset-factory-tests.spec.ts
```

## Project Structure

The project follows a modular structure:

```
test-suite/
├── src/
│   ├── clients/       # Blockchain client initialization
│   ├── common/        # Shared utilities and operations
│   ├── configs/       # Environment configuration
│   ├── helpers/       # Test helpers and utilities
│   ├── scripts/       # Manual test scripts
│   └── test/          # Test suites
│       ├── acl/       # Access control tests
│       └── pool/      # Pool functionality tests
├── .env               # Environment variables (create locally)
├── jest.config.js     # Jest configuration
├── package.json       # Project dependencies
└── tsconfig.json      # TypeScript configuration
```

## Writing Tests

Create new test files in the `src/test` directory with a `.spec.ts` extension. Each test file should follow this structure:

```typescript
import { op, Session } from '@chromia/ft4';
import { IClient } from 'postchain-client';
import { admin_kp, user_a_kp, user_b_kp } from '@configs/key-pair';
import { getClient } from '@clients/index';
import { registerAccountOpen } from '@common/operations/accounts';

describe('Your Feature Tests', () => {
  let adminSession: Session;
  let userSession: Session;
  let client: IClient;

  beforeAll(async () => {
    client = await getClient();
    adminSession = await registerAccountOpen(client, admin_kp);
    userSession = await registerAccountOpen(client, user_a_kp);

    // Setup code...
  }, 30000);

  it('should perform a specific operation', async () => {
    // Your test here
    const result = await adminSession.call(op('some_operation', param1, param2));
    expect(result.receipt.statusCode).toBe(200);
  });
});
```

## Path Aliases

The project uses TypeScript path aliases to simplify imports. Instead of using relative paths like `../../configs/key-pair`, you can use path aliases:

```typescript
// Before
import { something } from '../../some/deep/path';

// After
import { something } from '@/some/deep/path';
```

Available aliases:

- `@/*` - Maps to `src/*`
- `@clients/*` - Maps to `src/clients/*`
- `@common/*` - Maps to `src/common/*`
- `@configs/*` - Maps to `src/configs/*`
- `@helpers/*` - Maps to `src/helpers/*`
- `@test/*` - Maps to `src/test/*`
- `@scripts/*` - Maps to `src/scripts/*`

This approach makes imports cleaner and prevents "import hell" with many `../` segments in paths.

## CI/CD Integration

The test suite can be integrated with CI/CD pipelines to ensure automated testing on every commit. Configure your CI/CD platform to:

1. Install dependencies with `yarn install`
2. Set environment variables
3. Run tests with `yarn test`

## Contributing

1. Create a feature branch from `main`
2. Add your tests or make improvements
3. Ensure all tests pass with `yarn test`
4. Submit a pull request

## License

MIT
