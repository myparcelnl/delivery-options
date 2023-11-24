import {describe, expect, it, vi} from 'vitest';
import {useOpenState} from './useOpenState';

describe('useOpenState', () => {
  it('can open', () => {
    const {isOpen, open} = useOpenState({});

    expect(isOpen.value).toBe(false);
    open();
    expect(isOpen.value).toBe(true);
  });

  it('can close', () => {
    const {isOpen, close} = useOpenState({});

    isOpen.value = true;

    expect(isOpen.value).toBe(true);
    close();
    expect(isOpen.value).toBe(false);
  });

  it('can toggle', () => {
    const {isOpen, toggle} = useOpenState({});

    expect(isOpen.value).toBe(false);

    toggle();
    expect(isOpen.value).toBe(true);

    toggle();
    expect(isOpen.value).toBe(false);
  });

  it('calls onOpen', () => {
    const onOpen = vi.fn();
    const {isOpen, open} = useOpenState({onOpen});

    expect(isOpen.value).toBe(false);

    open();
    expect(isOpen.value).toBe(true);
    expect(onOpen).toHaveBeenCalled();
  });

  it('calls onClose', () => {
    const onClose = vi.fn();
    const {isOpen, close} = useOpenState({onClose});

    isOpen.value = true;

    expect(isOpen.value).toBe(true);

    close();
    expect(isOpen.value).toBe(false);
    expect(onClose).toHaveBeenCalled();
  });
});
