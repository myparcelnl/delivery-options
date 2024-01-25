import {ref} from 'vue';
import {describe, expect, it, vi} from 'vitest';
import {useClickOutside} from './useClickOutside';

describe('useClickOutside', () => {
  const event = new MouseEvent('click', {bubbles: true});

  it('calls callback when clicked outside', () => {
    const callback = vi.fn();

    const elementRef = ref(document.createElement('div'));
    const target = document.createElement('div');

    document.body.appendChild(target);
    document.body.appendChild(elementRef.value);

    useClickOutside(elementRef, callback);

    target.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
  });

  it('does not call callback when clicked inside', () => {
    const callback = vi.fn();

    const elementRef = ref(document.createElement('div'));

    document.body.appendChild(elementRef.value);

    useClickOutside(elementRef, callback);
    elementRef.value.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });
});
