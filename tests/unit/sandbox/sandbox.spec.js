import { mockSandbox } from '@Tests/unit/sandbox/mockSandbox';
import { sandboxConfigBus } from '@/sandbox/sandboxConfigBus';
import { waitForEvent } from '@Tests/waitForEvent';

describe('Sandbox.vue', () => {
  it('renders correctly', async() => {
    expect.assertions(10);
    const sandbox = await mockSandbox();

    await waitForEvent('created:formItem', sandboxConfigBus, 50);

    // Make sure everything is rendered
    expect(sandbox.findByTestId('myparcel.delivery').element).toBeInTheDocument();
    expect(sandbox.findByTestId('myparcel.features').element).toBeInTheDocument();
    expect(sandbox.findByTestId('myparcel.general').element).toBeInTheDocument();
    expect(sandbox.findByTestId('myparcel.pickup').element).toBeInTheDocument();
    expect(sandbox.findByTestId('myparcel.strings').element).toBeInTheDocument();
    expect(sandbox.findByTestId('belgie.delivery').element).toBeInTheDocument();
    expect(sandbox.findByTestId('belgie.features').element).toBeInTheDocument();
    expect(sandbox.findByTestId('belgie.general').element).toBeInTheDocument();
    expect(sandbox.findByTestId('belgie.pickup').element).toBeInTheDocument();
    expect(sandbox.findByTestId('belgie.strings').element).toBeInTheDocument();
  });
});
