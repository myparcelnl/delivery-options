import {type Ref, ref} from 'vue';
import {type PromiseOr} from '@myparcel/ts-utils';

interface UseOpensManuallyOptions {
  onClose?(): PromiseOr<void>;

  onOpen?(): PromiseOr<void>;
}

interface UseOpensManually {
  isOpen: Ref<boolean>;

  close(): void;

  open(): void;

  toggle(): void;
}

export const useOpenState = (options: UseOpensManuallyOptions): UseOpensManually => {
  const isOpen = ref(false);

  const toggle = () => {
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  };

  const open = () => {
    console.log('open');
    isOpen.value = true;
    void options?.onOpen?.();
  };

  const close = () => {
    isOpen.value = false;
    void options?.onClose?.();
  };

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};
