import json from 'highlight.js/lib/languages/json';
import javascript from 'highlight.js/lib/languages/javascript';
import hljs from 'highlight.js/lib/core';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);

hljs.configure({
  tabReplace: '  ',
});

export {hljs};
