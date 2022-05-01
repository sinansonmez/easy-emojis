# easy-emojis
- Convert country codes (ISO 3166-1) to emoji flags or vice a versa
- Convert single letters to emojis or vice a versa

This package relies on `String.fromCodePoint`, and does not provide any polyfills.

## install

```bash
# npm
npm install easy-emojis
```

## usage
```javascript
const { countryCodeToFlag, emojiCountryCode } = require('easy-emojis');
countryCodeToFlag('US'); // returns '🇺🇸'
flagToCountryCode('🇺🇸'); // returns 'US'


const { letterToEmoji, emojiToLetter } = require('easy-emojis');
letterToEmoji('S'); // returns '🇸'
emojiToLetter('🇸') // returns 'S'
```

### Run tests
`npm run test`
