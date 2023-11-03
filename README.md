# easy-emojis

Bunch of usefull functions to use emojis

## install

```bash
# npm
npm install easy-emojis
```

## usage
```javascript
import * as EasyEmojis from 'easy-emojis';

EasyEmojis.getRandomEmoji(); // should return a random emoji

EasyEmojis.getEmojiByName('red apple'); // should return '🍎'
EasyEmojis.getEmojiByShortName(':apple:'); // should return '🍎'

// getEmoji both accepts name and short name
EasyEmojis.getEmoji('red apple'); // should return '🍎'
EasyEmojis.getEmoji(':apple:'); // should return '🍎'

EasyEmojis.countryCodeToFlag('US'); // returns '🇺🇸'
EasyEmojis.flagToCountryCode('🇺🇸'); // returns 'US'

EasyEmojis.letterToEmoji('S'); // returns '🇸'
EasyEmojis.emojiToLetter('🇸') // returns 'S'
```
- Convert country codes (ISO 3166-1) to emoji flags or vice a versa
- Convert single letters to emojis or vice a versa

This package relies on `String.fromCodePoint`, and does not provide any polyfills.

### Run tests
`npm run test`
