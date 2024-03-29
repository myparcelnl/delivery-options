<template>
  <table>
    <thead v-if="header">
      <tr>
        <th
          v-for="col in header"
          :key="col"
          v-text="col" />
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="row in content"
        :key="JSON.stringify(row)">
        <td
          v-for="col in row"
          :key="col"
          v-text="col" />
      </tr>
    </tbody>

    <tfoot v-if="footer">
      <tr>
        <th
          v-for="col in footer"
          :key="col"
          v-text="col" />
      </tr>
    </tfoot>
  </table>
</template>

<script generic="T extends string[]" lang="ts" setup>
defineProps<{
  header?: string[];
  content: T;
  footer?: string[];
}>();
</script>
