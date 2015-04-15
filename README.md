# Cahoots - Provider

Aggregating Cahoots data from several external data providers.

## Providers

  * [torial.com](http://torial.com)

## Usage example

```js
var provider = require('cahoots-provider');

var person = provider('person'); // or 'person'

function onQuery (err, persons) {
	if (err) {
		return console.error('Meh! ' + err.toString());
	}

	console.log(persons); // Persons from all integrated providers
}

person.query({id: 1}, onQuery);
```

## Configuration

  * `CAHOOTS_PROVIDER_OFFICIAL_DATABASE_PATH`: The path to the Cahoots database.
  * `CAHOOTS_PROVIDER_TORIAL_API_ENDPOINT`: The endpoint of the torial API.
  * `CAHOOTS_PROVIDER_TORIAL_DATABASE_PATH`: The path to the internal torial database.
  * `CAHOOTS_PROVIDER_TORIAL_SYNC_INTERVAL`: The sync interval in ms. Default `(60 * 1000) * 60 * 24` (24h).

## API

### PersonService

#### `findAll(callback)`

Finds all available persons from all integrated provider modules.

```js
var service = services('person');

function onFind (err, persons) {
    if (err) {
        return console.error(err);
    }

    console.log(persons); // Array with person objects (empty array when no person available).
}

service.findAll(onFind);
```

#### `findById(id, callback)`

Find a person by a particular id (all provider modules will be queried).

```js
var service = services('person');

function onFind (err, person) {
    if (err) {
        return console.error(err);
    }

    console.log(person); // `undefined` when not found
}

service.findById('f1000fa10c847b7599c9d0560d3d41e60b773164', onFind);
```

### OrganizationService

#### `findAll(callback)`

Finds all available organizations from all integrated provider modules.

```js
var service = services('organization');

function onFind (err, organizations) {
    if (err) {
        return console.error(err);
    }

    console.log(organizations); // Array with organization objects (empty array when no organization available).
}

service.findAll(onFind);
```

#### `findById(id, callback)`

Finds an organization by id (all provider modules will be queried).

```js
var service = services('organization');

function onFind (err, organization) {
    if (err) {
        return console.error(err);
    }

    console.log(organization); // `undefined` when not found
}

service.findById('e76ca9f8359f31bd4a99e01465c44b1a8ce35c09', onFind);
```

#### `findByIds(ids, callback)`

Finds multiple organizations by an array of organization id's.

```js
var service = services('organization');

var ids = [
    'e76ca9f8359f31bd4a99e01465c44b1a8ce35c09',
    '95ed680482fe70b74753d356209dd6868f071052'
];

function onFind (err, organizations) {
    if (err) {
        return console.error(err);
    }

    console.log(organizations); // Array with organization objects (empty array when no organization available).
}

service.findByIds(ids, onFind);
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
