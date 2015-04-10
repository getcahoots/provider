# Cahoots - Provider - Torial Sync

Module which will sync the torial data with the internal torial provider storage continuously.

## Usage example

```js

// Instantiate the sync mechanism (first run in `24h` by default).
var torialsync = require('cahoots-provider-torial-sync')();

// If you do not want to wait for the first interval, you can execute the sync mechanism directly via:
torialsync.run();
```

## Configuration

  * `CAHOOTS_PROVIDER_TORIAL_SYNC_INTERVAL`: The sync interval in ms. Default `(60 * 1000) * 60 * 24` (24h).

## Test

```sh
npm test
```

## License

The MIT License (MIT)

Copyright (c) 2015 Cahoots, Germany <info@cahoots.pw>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
