<template>
  <header>
    <BNavbar
      toggleable="lg"
      type="dark"
      variant="primary">
      <BNavbarBrand href="#">
        <img
          src="https://assets.myparcel.nl/skin/images/logo-inverse.svg"
          alt="Logo">

        <span
          v-t="'title.main'"
          class="ml-3" />
      </BNavbarBrand>

      <BNavbarToggle target="nav-collapse" />

      <BCollapse
        id="nav-collapse"
        is-nav>
        <BNavbarNav class="ml-auto">
          <BNavItem
            v-for="link in externalLinks"
            :key="'link_' + link.text"
            :to="link.link">
            {{ $t(link.text) }}
            <Fa
              :icon="faExternalLinkAlt"
              class="ml-1 small" />
          </BNavItem>
        </BNavbarNav>
      </BCollapse>
    </BNavbar>
  </header>
</template>

<script>
import Fa from 'vue-fa';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';

export default {
  name: 'SandboxHeader',
  components: { Fa },
  data() {
    return {
      /* eslint-disable vue/max-len,max-len */
      externalLinks: [
        {
          text: 'links.api_documentation',
          link: 'https://myparcelnl.github.io/api/',
        },
        {
          text: 'links.slack',
          link: 'https://join.slack.com/t/myparcel-dev/shared_invite/enQtNDkyNTg3NzA1MjM4LWQ5MWE5MTQ3MDg4YjU5NzdjYjk0OTY1ZDJiYjU5YzJjNzk3Yzk3NGY0OWFkZDU4MDYwZDEyZDlhZTgzOWM1MjI',
        },
      ],
      /* eslint-enable vue/max-len,max-len */
      faExternalLinkAlt,
    };
  },
};
</script>
