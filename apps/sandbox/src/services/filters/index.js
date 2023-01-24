import Vue from 'vue';
import { formatCode } from '../../delivery-options/src/sandbox/services/filters/formatCode';

Vue.filter('formatCode', formatCode);
