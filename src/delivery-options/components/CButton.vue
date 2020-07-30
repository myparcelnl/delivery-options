<template>
  <button
    :class="$classBase + '__button'"
    @click="() => $emit('click', $event)" />
</template>

<script>
export default {
  name: 'CButton',
};
</script>
