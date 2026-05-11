import {nextTick} from 'vue';
import {describe, it, expect} from 'vitest';
import {render, fireEvent} from '@testing-library/vue';
import Modal from './Modal.vue';

describe('Modal.vue', () => {
  it('hides the dialog with display:none when closed (keeps DOM mounted)', () => {
    const {queryByTestId} = render(Modal, {
      props: {modelValue: false},
    });

    const dialog = queryByTestId('modal');
    expect(dialog).toBeTruthy();
    expect((dialog as HTMLElement).style.display).toBe('none');
  });

  it('renders teleported content when open', async () => {
    const {getByTestId} = render(Modal, {
      props: {modelValue: true},
      slots: {default: '<p>hello body</p>'},
    });

    await nextTick();

    expect(getByTestId('modal')).toBeTruthy();
    expect(document.body.textContent).toContain('hello body');
  });

  it('emits close + update:modelValue=false on backdrop click', async () => {
    const {getByTestId, emitted} = render(Modal, {
      props: {modelValue: true},
    });

    await nextTick();
    await fireEvent.click(getByTestId('modal-backdrop'));

    expect(emitted('close')).toBeTruthy();
    expect(emitted('update:modelValue')).toEqual([[false]]);
  });

  it('emits close on Escape key', async () => {
    const {emitted} = render(Modal, {
      props: {modelValue: true},
    });

    await nextTick();
    await fireEvent.keyDown(document, {key: 'Escape'});

    expect(emitted('close')).toBeTruthy();
    expect(emitted('update:modelValue')).toEqual([[false]]);
  });

  it('does not emit close on Escape when already closed', async () => {
    const {emitted} = render(Modal, {
      props: {modelValue: false},
    });

    await nextTick();
    await fireEvent.keyDown(document, {key: 'Escape'});

    expect(emitted('close')).toBeUndefined();
  });

  it('renders footer slot when provided', async () => {
    render(Modal, {
      props: {modelValue: true},
      slots: {footer: '<button data-testid="footer-btn">Confirm</button>'},
    });

    await nextTick();

    expect(document.body.querySelector('[data-testid="footer-btn"]')).toBeTruthy();
  });
});
