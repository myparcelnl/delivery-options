<template>
  <header class="mp-bg-monstera-500 mp-text-white">
    <Container
      class="mp-align-middle mp-py-2"
      fluid>
      <div class="mp-flex mp-gap-4 mp-my-auto">
        <img
          alt="Logo"
          class="mp-my-auto"
          src="https://assets.myparcel.nl/skin/images/logo-inverse.svg" />

        <span
          class="mp-my-auto"
          v-text="translate('title.main')" />
      </div>

      <Container fluid>
        <ul class="mp-align-middle mp-flex mp-gap-4 mp-ml-auto">
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
        <LanguageSwitcher />
      </Container>
    </Container>
  </header>
</template>

<script lang="ts" setup>
import LanguageSwitcher from '../LanguageSwitcher.vue';
import {Container} from '../Container';
import ColorModeSwitcher from '../ColorModeSwitcher.vue';
import {useLanguage} from '../../composables';

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
