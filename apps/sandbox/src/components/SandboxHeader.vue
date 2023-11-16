<template>
  <header class="bg-monstera-500 text-white">
    <Container
      class="align-middle py-2"
      flow-col
      fluid>
      <div class="flex gap-4 my-auto">
        <img
          alt="Logo"
          class="my-auto"
          src="https://assets.myparcel.nl/skin/images/logo-inverse.svg" />

        <span
          class="my-auto"
          v-text="translate('title.main')" />
      </div>

      <Container
        class="align-middle"
        flow-col
        fluid>
        <ul class="align-middle flex gap-4">
          <li
            v-for="link in links"
            :key="`link_${link.text}`">
            <a
              :href="link.link"
              class="reset">
              {{ translate(link.text) }}
            </a>
          </li>
        </ul>

        <ColorModeSwitcher />
      </Container>
    </Container>
  </header>
</template>

<script lang="ts" setup>
import {useLanguage} from '@myparcel-do/shared';
import {Container} from './Container';
import ColorModeSwitcher from './ColorModeSwitcher.vue';

const links = [
  {
    text: 'links.api_documentation',
    link: 'https://myparcelnl.github.io/api/',
  },
  {
    text: 'links.slack',
    link: 'https://join.slack.com/t/myparcel-dev/shared_invite/enQtNDkyNTg3NzA1MjM4LWQ5MWE5MTQ3MDg4YjU5NzdjYjk0OTY1ZDJiYjU5YzJjNzk3Yzk3NGY0OWFkZDU4MDYwZDEyZDlhZTgzOWM1MjI',
  },
] satisfies {
  text: string;
  link: string;
}[];

const {translate} = useLanguage();
</script>
