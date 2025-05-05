# Udon Finance: Advanced Lending Protocol on Chromia

A modern lending and borrowing protocol built on Chromia blockchain, leveraging the relational architecture of Rell and FT4 token standard.

## Core Features

- 🏦 **Supply & Borrow**: Supply assets to earn interest or borrow against collateral
- 📊 **Dynamic Interest Rates**: Dual strategy system with configurable parameters
- 🔐 **Robust Risk Management**: Health factor monitoring and collateralization ratios
- ⚡ **Flash Loans**: Zero-collateral loans within a single transaction
- 🧮 **Precise Math**: Ray & Wad precision mathematics for accurate calculations
- 🏛️ **E-Mode**: Efficiency mode for specialized borrowing categories
- 🔄 **Isolation Mode**: Risk containment for newly added assets

## Architecture

The protocol is structured in a clean modular design:

```
src/
├── core/
│   ├── acl/                 # Access control and permissions
│   ├── config/              # Reserve and user configurations
│   ├── math/                # Wad-Ray math and utility functions
│   ├── pool/
│   │   ├── assets/          # Asset factories (a_assets, variable debt tokens)
│   │   └── logic/           # Core protocol operations
│   ├── rate/                # Interest rate strategy implementations
│   └── main.rell            # Core module entry point
├── development/             # Development environment modules
│   ├── pool/                # Development-specific pool logic
│   └── main.rell            # Development module entry point
├── lib/
│   └── ft4/                 # FT4 token standard integration
├── test/                    # Comprehensive unit tests
│   ├── acl/                 # Access control tests
│   ├── config/              # Configuration tests
│   ├── math/                # Math utility tests
│   ├── pool/                # Pool operation tests
│   ├── rate/                # Interest rate tests
│   └── main.rell            # Test orchestration
├── test-suites/             # Integration test suites
└── main.rell                # Main application entry point
```

## Technical Components

### Asset System

Udon uses three token types implemented as FT4-compatible tokens:
- **A-Assets (aTokens)**: Interest-bearing tokens representing supplied collateral
- **Variable Debt Tokens**: Tokenized debt with dynamic interest rates
- **Underlying Assets**: Base FT4 tokens that users supply/borrow

### Interest Rate Models

Two distinct strategies:
- **Default Strategy**: Dynamic rates based on utilization with optimal point targeting
- **UDON Strategy**: Specialized rates for protocol-native assets

### Risk Framework

- **Health Factor**: Real-time solvency monitoring for borrower positions
- **Isolation Mode**: Caps on borrowing for new/risky asset listings
- **E-Mode**: Enhanced LTV for correlated assets (stablecoins, liquid staking tokens)
- **Liquidation Thresholds**: Configurable safety margins before liquidation

## Deployment

### Prerequisites
- Chromia CLI installed
- Valid network configuration
- Valid signing keys

### Configuration

Define your deployment in `chromia.yml`:

```yaml
deployments:
  testnet:
    brid: x"6F1B061C633A992BF195850BF5AA1B6F887AEE01BB3F51251C230930FB792A92"
    url: https://node0.testnet.chromia.com:7740
    container: 2e5e0846d4cc5908f22d76bb78c0d91c4a8fba1bccafffbb8607b265055d6a8a
```

### Deploy Commands

```bash
# Deploy to testnet
chr deployment create --settings chromia.yml --network testnet --blockchain udon_finance

# After deployment, update chromia.yml with returned chain ID
```

3. After successful deployment, update your `chromia.yml` with the returned chain ID, you can find the chain ID in the deployment logs same as the example below:
```shell
This will create a new deployment of lending_borrowing_chromia on network testnet. Would you like to create a new deployment? [y/N]: y
Deployment of blockchain lending_borrowing_chromia was successful
Add the following to your project settings file:
deployments:
  testnet:
    chains:
      lending_borrowing_chromia: x"9581300C98ECE813411E0090108F30DD3355B22E565373B89B37ADAF1340F655"
```

### Test Results
All unit tests are passing with good coverage across all modules:
- Factory initialization and validation
- Mint/Burn operations for all asset types
- Transfer validations
- Interest rate calculations
- Configuration and permission checks

## Development

### Core Development Rules

1. All functions must include comprehensive docstrings
2. State changes require authorization checks
3. All numerical calculations use Wad/Ray math for precision
4. Critical operations must emit events for off-chain monitoring
5. Validate all inputs at function boundaries
6. Use explicit visibility modifiers for proper encapsulation

### Conventions

- Module organization follows clean architecture principles
- Snake_case for variables, functions, and modules
- Entity attributes use camelCase when matching external standards
- Each module has dedicated test coverage

## Security

The protocol implements multiple safeguards:
- Role-based access control
- Conservative liquidation thresholds
- Circuit breakers for critical conditions
- Comprehensive validation of cross-module calls

## License

MIT

## Contributing

We welcome contributions! Please follow the established code style and add tests for new features.

