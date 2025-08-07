import { admin_kp } from '../../configs/key-pair';
import {
  createConnection,
  createInMemoryFtKeyStore,
  createSingleSigAuthDescriptorRegistration,
  op,
  registerAccount,
  registrationStrategy,
  Session,
} from '@chromia/ft4';
import { createClient } from 'postchain-client';

declare global {
  // For Buffer in Jest
  // eslint-disable-next-line no-var
  var Buffer: typeof Buffer;
}

describe('Chromia FT4 - initialize_underlying_asset_factory', () => {
  let session: Session;

  beforeAll(async () => {
    const client = await createClient({
      nodeUrlPool: 'http://localhost:7740',
      blockchainRid: 'B4864817849057E514EF49A2E0F1BB5D46A23F422AE07924749C709CECEECC8B',
    });
    const store = createInMemoryFtKeyStore(admin_kp);
    const connection = createConnection(client);
    const reg = await registerAccount(
      connection.client,
      store,
      registrationStrategy.open(
        createSingleSigAuthDescriptorRegistration(['A', 'T'], store.id, null)
      )
    );
    session = reg.session;
  });

  it('should initialize underlying asset factory', async () => {
    const result = await session.call(op('initialize_underlying_asset_factory'));
    expect(result.receipt.statusCode).toBe(200);
  });
});
