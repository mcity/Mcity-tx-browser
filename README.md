# Mcity-tx-browser

[npm package](https://www.npmjs.com/package/@mcity/mcity-tx-browser)

To publish to NPM, update the version in `package.json` and use the following commands:

```
npm login
npm publish --access public
```

File browser vue component for transmission.um.city. The component must be used as shown with the following props:

```vue
<TxBrowser setShare="DATA" standAlone />

import TxBrowser from '@mcity/mcity-tx-browser/TxBrowser'
```

Where setShare specifies a share defined by its URL (eg. Working Group Data's url is https://transmission.um.city/l/WGDATA, and the setShare value would be 'WGDATA').

standAlone is a bool that lets the component know it's not being used on transmission.um.city and that it doesn't have access to certain data.

Your project must be using vuetify v2 for the browser to display properly.
