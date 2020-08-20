<template>
  <button
    :class="$classBase + '__button'"
    @click="(event) => $emit('click', event)" />
</template>

<script>
export default {
  name: 'CButton',
};
</script>
