---
title: Tabletop Generator API v1.0
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2
---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="tabletop-generator-api">Tabletop Generator API v1.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

REST API for managing AI-generated tabletop gaming assets

Base URLs:

- <a href="https://api.example.com">https://api.example.com</a>

License: Unlicensed

# Authentication

- HTTP Authentication, scheme: Basic Basic HTTP Authentication

- HTTP Authentication, scheme: Bearer Bearer token using a JWT

<h1 id="tabletop-generator-api-default">Default</h1>

## healthcheck

<a id="opIdhealthcheck"></a>

> Code samples

```shell
# You can also use wget
curl -X GET https://api.example.com/

```

```http
GET https://api.example.com/ HTTP/1.1
Host: api.example.com

```

```javascript
fetch("https://api.example.com/", {
  method: "GET",
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get 'https://api.example.com/',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('https://api.example.com/')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.example.com/', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.example.com/", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /`

_Perform a health check on the API_

<h3 id="healthcheck-responses">Responses</h3>

| Status | Meaning                                                 | Description | Schema |
| ------ | ------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | OK          | None   |

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="tabletop-generator-api-asset">asset</h1>

Assets operations

## createAsset

<a id="opIdcreateAsset"></a>

> Code samples

```shell
# You can also use wget
curl -X POST https://api.example.com/assets \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST https://api.example.com/assets HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "assetType": "character",
  "name": "Arannis the Wise",
  "visibility": "public",
  "data": {
    "race": "elf",
    "class": "wizard",
    "gender": "male",
    "alignment": "neutral_good",
    "appearance": "Tall, silver-haired with piercing green eyes",
    "personality": "Calm and strategic thinker",
    "background": "Noble lineage with arcane education",
    "abilities": "Fireball, Teleport, Shield",
    "equipment": "Spellbook, Staff, Robes",
    "motivation": "Restore ancient elven knowledge",
    "notes": "Allies with the druids of the west"
  }
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api.example.com/assets',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'https://api.example.com/assets',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('https://api.example.com/assets', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','https://api.example.com/assets', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/assets");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "https://api.example.com/assets", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /assets`

_Create a new asset_

> Body parameter

```json
{
  "assetType": "character",
  "name": "Arannis the Wise",
  "visibility": "public",
  "data": {
    "race": "elf",
    "class": "wizard",
    "gender": "male",
    "alignment": "neutral_good",
    "appearance": "Tall, silver-haired with piercing green eyes",
    "personality": "Calm and strategic thinker",
    "background": "Noble lineage with arcane education",
    "abilities": "Fireball, Teleport, Shield",
    "equipment": "Spellbook, Staff, Robes",
    "motivation": "Restore ancient elven knowledge",
    "notes": "Allies with the druids of the west"
  }
}
```

<h3 id="createasset-parameters">Parameters</h3>

| Name                   | In   | Type                            | Required | Description                                                                            |
| ---------------------- | ---- | ------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| body                   | body | object                          | false    | none                                                                                   |
| » name                 | body | string                          | true     | none                                                                                   |
| » assetType            | body | [assetType](#schemaassettype)   | true     | none                                                                                   |
| » visibility           | body | [visibility](#schemavisibility) | true     | none                                                                                   |
| » data                 | body | any                             | true     | The `data` field contains asset-specific data. It varies depending on the `assetType`: |
| »» _anonymous_         | body | [character](#schemacharacter)   | false    | none                                                                                   |
| »»» race               | body | string                          | true     | none                                                                                   |
| »»» class              | body | string                          | true     | none                                                                                   |
| »»» gender             | body | string                          | true     | none                                                                                   |
| »»» alignment          | body | string                          | true     | none                                                                                   |
| »»» appearance         | body | string                          | false    | none                                                                                   |
| »»» personality        | body | string                          | false    | none                                                                                   |
| »»» background         | body | string                          | false    | none                                                                                   |
| »»» abilities          | body | string                          | false    | none                                                                                   |
| »»» equipment          | body | string                          | false    | none                                                                                   |
| »»» motivation         | body | string                          | false    | none                                                                                   |
| »»» notes              | body | string                          | false    | none                                                                                   |
| »» _anonymous_         | body | [location](#schemalocation)     | false    | none                                                                                   |
| »»» locationType       | body | string                          | true     | none                                                                                   |
| »»» terrain            | body | string                          | false    | none                                                                                   |
| »»» climate            | body | string                          | false    | none                                                                                   |
| »»» atmosphere         | body | string                          | false    | none                                                                                   |
| »»» inhabitants        | body | string                          | false    | none                                                                                   |
| »»» dangerLevel        | body | string                          | false    | none                                                                                   |
| »»» pointsOfInterest   | body | string                          | false    | none                                                                                   |
| »»» narrativeRole      | body | string                          | false    | none                                                                                   |
| »»» notes              | body | string                          | false    | none                                                                                   |
| »» _anonymous_         | body | [quest](#schemaquest)           | false    | none                                                                                   |
| »»» questType          | body | string                          | true     | none                                                                                   |
| »»» tone               | body | string                          | false    | none                                                                                   |
| »»» location           | body | string                          | false    | none                                                                                   |
| »»» complexity         | body | string                          | false    | none                                                                                   |
| »»» objective          | body | string                          | false    | none                                                                                   |
| »»» antagonist         | body | string                          | false    | none                                                                                   |
| »»» notableNPCs        | body | string                          | false    | none                                                                                   |
| »»» hasCombat          | body | boolean                         | false    | none                                                                                   |
| »»» hasPuzzles         | body | boolean                         | false    | none                                                                                   |
| »»» hasSkillChallenges | body | boolean                         | false    | none                                                                                   |
| »»» hasDilemmas        | body | boolean                         | false    | none                                                                                   |
| »»» notes              | body | string                          | false    | none                                                                                   |
| »» _anonymous_         | body | [map](#schemamap)               | false    | none                                                                                   |
| »»» mapType            | body | string                          | true     | none                                                                                   |
| »»» terrain            | body | string                          | false    | none                                                                                   |
| »»» scale              | body | string                          | false    | none                                                                                   |
| »»» pointsOfInterest   | body | string                          | false    | none                                                                                   |
| »»» notes              | body | string                          | false    | none                                                                                   |

#### Detailed descriptions

**» data**: The `data` field contains asset-specific data. It varies depending on the `assetType`:

- `"character"` → Character schema
- `"location"` → Location schema
- `"quest"` → Quest schema
- `"map"` → Map schema

See examples for full structures.

#### Enumerated Values

| Parameter     | Value           |
| ------------- | --------------- |
| » assetType   | character       |
| » assetType   | location        |
| » assetType   | quest           |
| » assetType   | map             |
| » visibility  | public          |
| » visibility  | private         |
| » visibility  | unlisted        |
| »»» race      | human           |
| »»» race      | elf             |
| »»» race      | drow            |
| »»» race      | half_elf        |
| »»» race      | half_orc        |
| »»» race      | halfling        |
| »»» race      | dwarf           |
| »»» race      | gnome           |
| »»» race      | tiefling        |
| »»» race      | githyanki       |
| »»» race      | dragonborn      |
| »»» class     | barbarian       |
| »»» class     | bard            |
| »»» class     | cleric          |
| »»» class     | druid           |
| »»» class     | fighter         |
| »»» class     | monk            |
| »»» class     | paladin         |
| »»» class     | ranger          |
| »»» class     | rogue           |
| »»» class     | sorcerer        |
| »»» class     | warlock         |
| »»» class     | wizard          |
| »»» gender    | male            |
| »»» gender    | female          |
| »»» gender    | non_binary      |
| »»» gender    | genderfluid     |
| »»» gender    | agender         |
| »»» alignment | lawful_good     |
| »»» alignment | neutral_good    |
| »»» alignment | chaotic_good    |
| »»» alignment | lawful_neutral  |
| »»» alignment | true_neutral    |
| »»» alignment | chaotic_neutral |
| »»» alignment | lawful_evil     |
| »»» alignment | neutral_evil    |
| »»» alignment | chaotic_evil    |

> Example responses

> 201 Response

```json
{
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "displayName": "string",
  "assetId": "9179b887-04ef-4ce5-ab3a-b5bbd39ea3c8",
  "assetType": "character",
  "name": "string",
  "imageUrl": "http://example.com",
  "likes": 0,
  "likedByCurrentUser": true,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z",
  "description": "string",
  "data": {
    "race": "human",
    "class": "barbarian",
    "gender": "male",
    "alignment": "lawful_good",
    "appearance": "string",
    "personality": "string",
    "background": "string",
    "abilities": "string",
    "equipment": "string",
    "motivation": "string",
    "notes": "string"
  }
}
```

<h3 id="createasset-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)    | OK           | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |

<h3 id="createasset-responseschema">Response Schema</h3>

#### Enumerated Values

| Property  | Value           |
| --------- | --------------- |
| assetType | character       |
| assetType | location        |
| assetType | quest           |
| assetType | map             |
| race      | human           |
| race      | elf             |
| race      | drow            |
| race      | half_elf        |
| race      | half_orc        |
| race      | halfling        |
| race      | dwarf           |
| race      | gnome           |
| race      | tiefling        |
| race      | githyanki       |
| race      | dragonborn      |
| class     | barbarian       |
| class     | bard            |
| class     | cleric          |
| class     | druid           |
| class     | fighter         |
| class     | monk            |
| class     | paladin         |
| class     | ranger          |
| class     | rogue           |
| class     | sorcerer        |
| class     | warlock         |
| class     | wizard          |
| gender    | male            |
| gender    | female          |
| gender    | non_binary      |
| gender    | genderfluid     |
| gender    | agender         |
| alignment | lawful_good     |
| alignment | neutral_good    |
| alignment | chaotic_good    |
| alignment | lawful_neutral  |
| alignment | true_neutral    |
| alignment | chaotic_neutral |
| alignment | lawful_evil     |
| alignment | neutral_evil    |
| alignment | chaotic_evil    |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

## getAssets

<a id="opIdgetAssets"></a>

> Code samples

```shell
# You can also use wget
curl -X GET https://api.example.com/assets \
  -H 'Accept: application/json'

```

```http
GET https://api.example.com/assets HTTP/1.1
Host: api.example.com
Accept: application/json

```

```javascript
const headers = {
  Accept: "application/json",
};

fetch("https://api.example.com/assets", {
  method: "GET",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'https://api.example.com/assets',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('https://api.example.com/assets', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.example.com/assets', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/assets");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.example.com/assets", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /assets`

_Retrieve a list of assets_

<h3 id="getassets-parameters">Parameters</h3>

| Name         | In    | Type                          | Required | Description |
| ------------ | ----- | ----------------------------- | -------- | ----------- |
| limit        | query | integer                       | false    | none        |
| offset       | query | integer                       | false    | none        |
| assetType    | query | [assetType](#schemaassettype) | false    | none        |
| collectionId | query | string(uuid)                  | false    | none        |
| userId       | query | string(uuid)                  | false    | none        |
| name         | query | string                        | false    | none        |
| description  | query | string                        | false    | none        |

#### Enumerated Values

| Parameter | Value     |
| --------- | --------- |
| assetType | character |
| assetType | location  |
| assetType | quest     |
| assetType | map       |

> Example responses

> 200 Response

```json
{
  "assets": [
    {
      "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
      "displayName": "string",
      "assetId": "9179b887-04ef-4ce5-ab3a-b5bbd39ea3c8",
      "assetType": "character",
      "name": "string",
      "imageUrl": "http://example.com",
      "likes": 0,
      "likedByCurrentUser": true,
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z",
      "description": "string"
    }
  ]
}
```

<h3 id="getassets-responses">Responses</h3>

| Status | Meaning                                                 | Description | Schema |
| ------ | ------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | OK          | Inline |

<h3 id="getassets-responseschema">Response Schema</h3>

Status Code **200**

| Name     | Type    | Required | Restrictions | Description |
| -------- | ------- | -------- | ------------ | ----------- |
| » assets | [allOf] | true     | none         | none        |

_allOf_

| Name            | Type                              | Required | Restrictions | Description |
| --------------- | --------------------------------- | -------- | ------------ | ----------- |
| »» _anonymous_  | [userSummary](#schemausersummary) | false    | none         | none        |
| »»» userId      | string(uuid)                      | true     | none         | none        |
| »»» displayName | string                            | true     | none         | none        |

_and_

| Name                   | Type                          | Required | Restrictions | Description |
| ---------------------- | ----------------------------- | -------- | ------------ | ----------- |
| »» _anonymous_         | object                        | false    | none         | none        |
| »»» assetId            | string(uuid)                  | true     | none         | none        |
| »»» assetType          | [assetType](#schemaassettype) | true     | none         | none        |
| »»» name               | string                        | true     | none         | none        |
| »»» imageUrl           | string(uri)                   | true     | none         | none        |
| »»» likes              | integer                       | true     | none         | none        |
| »»» likedByCurrentUser | boolean                       | true     | none         | none        |
| »»» createdAt          | string(date-time)             | true     | none         | none        |
| »»» updatedAt          | string(date-time)             | true     | none         | none        |
| »»» description        | string                        | true     | none         | none        |

#### Enumerated Values

| Property  | Value     |
| --------- | --------- |
| assetType | character |
| assetType | location  |
| assetType | quest     |
| assetType | map       |

<aside class="success">
This operation does not require authentication
</aside>

## getAssetById

<a id="opIdgetAssetById"></a>

> Code samples

```shell
# You can also use wget
curl -X GET https://api.example.com/assets/{assetId} \
  -H 'Accept: application/json'

```

```http
GET https://api.example.com/assets/{assetId} HTTP/1.1
Host: api.example.com
Accept: application/json

```

```javascript
const headers = {
  Accept: "application/json",
};

fetch("https://api.example.com/assets/{assetId}", {
  method: "GET",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'https://api.example.com/assets/{assetId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('https://api.example.com/assets/{assetId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.example.com/assets/{assetId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/assets/{assetId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.example.com/assets/{assetId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /assets/{assetId}`

_Retrieve an asset by its ID_

<h3 id="getassetbyid-parameters">Parameters</h3>

| Name    | In   | Type         | Required | Description |
| ------- | ---- | ------------ | -------- | ----------- |
| assetId | path | string(uuid) | true     | none        |

> Example responses

> 200 Response

```json
{
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "displayName": "string",
  "assetId": "9179b887-04ef-4ce5-ab3a-b5bbd39ea3c8",
  "assetType": "character",
  "name": "string",
  "imageUrl": "http://example.com",
  "likes": 0,
  "likedByCurrentUser": true,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z",
  "description": "string",
  "data": {
    "race": "human",
    "class": "barbarian",
    "gender": "male",
    "alignment": "lawful_good",
    "appearance": "string",
    "personality": "string",
    "background": "string",
    "abilities": "string",
    "equipment": "string",
    "motivation": "string",
    "notes": "string"
  }
}
```

<h3 id="getassetbyid-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | OK           | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Forbidden    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Not Found    | None   |

<h3 id="getassetbyid-responseschema">Response Schema</h3>

#### Enumerated Values

| Property  | Value           |
| --------- | --------------- |
| assetType | character       |
| assetType | location        |
| assetType | quest           |
| assetType | map             |
| race      | human           |
| race      | elf             |
| race      | drow            |
| race      | half_elf        |
| race      | half_orc        |
| race      | halfling        |
| race      | dwarf           |
| race      | gnome           |
| race      | tiefling        |
| race      | githyanki       |
| race      | dragonborn      |
| class     | barbarian       |
| class     | bard            |
| class     | cleric          |
| class     | druid           |
| class     | fighter         |
| class     | monk            |
| class     | paladin         |
| class     | ranger          |
| class     | rogue           |
| class     | sorcerer        |
| class     | warlock         |
| class     | wizard          |
| gender    | male            |
| gender    | female          |
| gender    | non_binary      |
| gender    | genderfluid     |
| gender    | agender         |
| alignment | lawful_good     |
| alignment | neutral_good    |
| alignment | chaotic_good    |
| alignment | lawful_neutral  |
| alignment | true_neutral    |
| alignment | chaotic_neutral |
| alignment | lawful_evil     |
| alignment | neutral_evil    |
| alignment | chaotic_evil    |

<aside class="success">
This operation does not require authentication
</aside>

## patchAssetById

<a id="opIdpatchAssetById"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH https://api.example.com/assets/{assetId} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH https://api.example.com/assets/{assetId} HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "description": "string",
  "visibility": "public"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api.example.com/assets/{assetId}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch 'https://api.example.com/assets/{assetId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('https://api.example.com/assets/{assetId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','https://api.example.com/assets/{assetId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/assets/{assetId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "https://api.example.com/assets/{assetId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /assets/{assetId}`

_Update an asset by its ID_

> Body parameter

```json
{
  "name": "string",
  "description": "string",
  "visibility": "public"
}
```

<h3 id="patchassetbyid-parameters">Parameters</h3>

| Name          | In   | Type                            | Required | Description |
| ------------- | ---- | ------------------------------- | -------- | ----------- |
| body          | body | object                          | false    | none        |
| » name        | body | string                          | false    | none        |
| » description | body | string                          | false    | none        |
| » visibility  | body | [visibility](#schemavisibility) | false    | none        |
| assetId       | path | string(uuid)                    | true     | none        |

#### Enumerated Values

| Parameter    | Value    |
| ------------ | -------- |
| » visibility | public   |
| » visibility | private  |
| » visibility | unlisted |

> Example responses

> 200 Response

```json
{
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "displayName": "string",
  "assetId": "9179b887-04ef-4ce5-ab3a-b5bbd39ea3c8",
  "assetType": "character",
  "name": "string",
  "imageUrl": "http://example.com",
  "likes": 0,
  "likedByCurrentUser": true,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z",
  "description": "string",
  "data": {
    "race": "human",
    "class": "barbarian",
    "gender": "male",
    "alignment": "lawful_good",
    "appearance": "string",
    "personality": "string",
    "background": "string",
    "abilities": "string",
    "equipment": "string",
    "motivation": "string",
    "notes": "string"
  }
}
```

<h3 id="patchassetbyid-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | OK           | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Forbidden    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Not Found    | None   |

<h3 id="patchassetbyid-responseschema">Response Schema</h3>

#### Enumerated Values

| Property  | Value           |
| --------- | --------------- |
| assetType | character       |
| assetType | location        |
| assetType | quest           |
| assetType | map             |
| race      | human           |
| race      | elf             |
| race      | drow            |
| race      | half_elf        |
| race      | half_orc        |
| race      | halfling        |
| race      | dwarf           |
| race      | gnome           |
| race      | tiefling        |
| race      | githyanki       |
| race      | dragonborn      |
| class     | barbarian       |
| class     | bard            |
| class     | cleric          |
| class     | druid           |
| class     | fighter         |
| class     | monk            |
| class     | paladin         |
| class     | ranger          |
| class     | rogue           |
| class     | sorcerer        |
| class     | warlock         |
| class     | wizard          |
| gender    | male            |
| gender    | female          |
| gender    | non_binary      |
| gender    | genderfluid     |
| gender    | agender         |
| alignment | lawful_good     |
| alignment | neutral_good    |
| alignment | chaotic_good    |
| alignment | lawful_neutral  |
| alignment | true_neutral    |
| alignment | chaotic_neutral |
| alignment | lawful_evil     |
| alignment | neutral_evil    |
| alignment | chaotic_evil    |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

## deleteAssetById

<a id="opIddeleteAssetById"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE https://api.example.com/assets/{assetId}

```

```http
DELETE https://api.example.com/assets/{assetId} HTTP/1.1
Host: api.example.com

```

```javascript
fetch("https://api.example.com/assets/{assetId}", {
  method: "DELETE",
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

result = RestClient.delete 'https://api.example.com/assets/{assetId}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('https://api.example.com/assets/{assetId}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','https://api.example.com/assets/{assetId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/assets/{assetId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "https://api.example.com/assets/{assetId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /assets/{assetId}`

_Delete an asset by its ID_

<h3 id="deleteassetbyid-parameters">Parameters</h3>

| Name    | In   | Type         | Required | Description |
| ------- | ---- | ------------ | -------- | ----------- |
| assetId | path | string(uuid) | true     | none        |

<h3 id="deleteassetbyid-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 204    | [No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5) | No Content   | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Forbidden    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Not Found    | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

## likeAssetById

<a id="opIdlikeAssetById"></a>

> Code samples

```shell
# You can also use wget
curl -X POST https://api.example.com/assets/{assetId}/like \
  -H 'Accept: application/json'

```

```http
POST https://api.example.com/assets/{assetId}/like HTTP/1.1
Host: api.example.com
Accept: application/json

```

```javascript
const headers = {
  Accept: "application/json",
};

fetch("https://api.example.com/assets/{assetId}/like", {
  method: "POST",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.post 'https://api.example.com/assets/{assetId}/like',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.post('https://api.example.com/assets/{assetId}/like', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','https://api.example.com/assets/{assetId}/like', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/assets/{assetId}/like");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "https://api.example.com/assets/{assetId}/like", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /assets/{assetId}/like`

_Toggle like status for an asset_

<h3 id="likeassetbyid-parameters">Parameters</h3>

| Name    | In   | Type         | Required | Description |
| ------- | ---- | ------------ | -------- | ----------- |
| assetId | path | string(uuid) | true     | none        |

> Example responses

> 200 Response

```json
{
  "assetId": "9179b887-04ef-4ce5-ab3a-b5bbd39ea3c8",
  "likes": 0,
  "likedByCurrentUser": true
}
```

<h3 id="likeassetbyid-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | OK           | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Forbidden    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Not Found    | None   |

<h3 id="likeassetbyid-responseschema">Response Schema</h3>

Status Code **200**

| Name                 | Type         | Required | Restrictions | Description |
| -------------------- | ------------ | -------- | ------------ | ----------- |
| » assetId            | string(uuid) | true     | none         | none        |
| » likes              | integer      | true     | none         | none        |
| » likedByCurrentUser | boolean      | true     | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

<h1 id="tabletop-generator-api-collection">collection</h1>

Collections operations

## createCollection

<a id="opIdcreateCollection"></a>

> Code samples

```shell
# You can also use wget
curl -X POST https://api.example.com/collections \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST https://api.example.com/collections HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "description": "string",
  "visibility": "public"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api.example.com/collections',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'https://api.example.com/collections',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('https://api.example.com/collections', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','https://api.example.com/collections', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/collections");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "https://api.example.com/collections", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /collections`

_Create a new collection_

> Body parameter

```json
{
  "name": "string",
  "description": "string",
  "visibility": "public"
}
```

<h3 id="createcollection-parameters">Parameters</h3>

| Name          | In   | Type                            | Required | Description |
| ------------- | ---- | ------------------------------- | -------- | ----------- |
| body          | body | object                          | false    | none        |
| » name        | body | string                          | true     | none        |
| » description | body | string                          | false    | none        |
| » visibility  | body | [visibility](#schemavisibility) | false    | none        |

#### Enumerated Values

| Parameter    | Value    |
| ------------ | -------- |
| » visibility | public   |
| » visibility | private  |
| » visibility | unlisted |

> Example responses

> 201 Response

```json
{
  "collectionId": "0ffe69e2-b7af-4b1e-835c-867376165f50",
  "creatorId": "688ebf54-d343-4104-8711-82c2feac534a",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z",
  "visibility": "public",
  "name": "string",
  "description": "string",
  "assetCount": 0,
  "assets": [
    {
      "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
      "displayName": "string",
      "assetId": "9179b887-04ef-4ce5-ab3a-b5bbd39ea3c8",
      "assetType": "character",
      "name": "string",
      "imageUrl": "http://example.com",
      "likes": 0,
      "likedByCurrentUser": true,
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z",
      "description": "string"
    }
  ]
}
```

<h3 id="createcollection-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)    | OK           | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |

<h3 id="createcollection-responseschema">Response Schema</h3>

#### Enumerated Values

| Property   | Value     |
| ---------- | --------- |
| visibility | public    |
| visibility | private   |
| visibility | unlisted  |
| assetType  | character |
| assetType  | location  |
| assetType  | quest     |
| assetType  | map       |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

## getCollections

<a id="opIdgetCollections"></a>

> Code samples

```shell
# You can also use wget
curl -X GET https://api.example.com/collections \
  -H 'Accept: application/json'

```

```http
GET https://api.example.com/collections HTTP/1.1
Host: api.example.com
Accept: application/json

```

```javascript
const headers = {
  Accept: "application/json",
};

fetch("https://api.example.com/collections", {
  method: "GET",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'https://api.example.com/collections',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('https://api.example.com/collections', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.example.com/collections', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/collections");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.example.com/collections", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /collections`

_Retrieve a list of collections_

<h3 id="getcollections-parameters">Parameters</h3>

| Name   | In    | Type         | Required | Description |
| ------ | ----- | ------------ | -------- | ----------- |
| limit  | query | integer      | false    | none        |
| offset | query | integer      | false    | none        |
| userId | query | string(uuid) | false    | none        |

> Example responses

> 200 Response

```json
[
  {
    "collectionId": "0ffe69e2-b7af-4b1e-835c-867376165f50",
    "creatorId": "688ebf54-d343-4104-8711-82c2feac534a",
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z",
    "visibility": "public",
    "name": "string",
    "description": "string",
    "assetCount": 0
  }
]
```

<h3 id="getcollections-responses">Responses</h3>

| Status | Meaning                                                 | Description | Schema |
| ------ | ------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | OK          | Inline |

<h3 id="getcollections-responseschema">Response Schema</h3>

Status Code **200**

| Name           | Type                              | Required | Restrictions | Description |
| -------------- | --------------------------------- | -------- | ------------ | ----------- |
| _anonymous_    | [[collection](#schemacollection)] | false    | none         | none        |
| » collectionId | string(uuid)                      | true     | none         | none        |
| » creatorId    | string(uuid)                      | true     | none         | none        |
| » createdAt    | string(date-time)                 | true     | none         | none        |
| » updatedAt    | string(date-time)                 | true     | none         | none        |
| » visibility   | [visibility](#schemavisibility)   | true     | none         | none        |
| » name         | string                            | true     | none         | none        |
| » description  | string                            | true     | none         | none        |
| » assetCount   | integer                           | true     | none         | none        |

#### Enumerated Values

| Property   | Value    |
| ---------- | -------- |
| visibility | public   |
| visibility | private  |
| visibility | unlisted |

<aside class="success">
This operation does not require authentication
</aside>

## getCollectionById

<a id="opIdgetCollectionById"></a>

> Code samples

```shell
# You can also use wget
curl -X GET https://api.example.com/collections/{collectionId} \
  -H 'Accept: application/json'

```

```http
GET https://api.example.com/collections/{collectionId} HTTP/1.1
Host: api.example.com
Accept: application/json

```

```javascript
const headers = {
  Accept: "application/json",
};

fetch("https://api.example.com/collections/{collectionId}", {
  method: "GET",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'https://api.example.com/collections/{collectionId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('https://api.example.com/collections/{collectionId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.example.com/collections/{collectionId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/collections/{collectionId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.example.com/collections/{collectionId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /collections/{collectionId}`

_Retrieve a collection by its ID_

<h3 id="getcollectionbyid-parameters">Parameters</h3>

| Name         | In    | Type         | Required | Description |
| ------------ | ----- | ------------ | -------- | ----------- |
| collectionId | query | string(uuid) | false    | none        |

> Example responses

> 200 Response

```json
{
  "collectionId": "0ffe69e2-b7af-4b1e-835c-867376165f50",
  "creatorId": "688ebf54-d343-4104-8711-82c2feac534a",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z",
  "visibility": "public",
  "name": "string",
  "description": "string",
  "assetCount": 0,
  "assets": [
    {
      "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
      "displayName": "string",
      "assetId": "9179b887-04ef-4ce5-ab3a-b5bbd39ea3c8",
      "assetType": "character",
      "name": "string",
      "imageUrl": "http://example.com",
      "likes": 0,
      "likedByCurrentUser": true,
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z",
      "description": "string"
    }
  ]
}
```

<h3 id="getcollectionbyid-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | OK           | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Forbidden    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Not Found    | None   |

<h3 id="getcollectionbyid-responseschema">Response Schema</h3>

#### Enumerated Values

| Property   | Value     |
| ---------- | --------- |
| visibility | public    |
| visibility | private   |
| visibility | unlisted  |
| assetType  | character |
| assetType  | location  |
| assetType  | quest     |
| assetType  | map       |

<aside class="success">
This operation does not require authentication
</aside>

## patchCollectionById

<a id="opIdpatchCollectionById"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH https://api.example.com/collections/{collectionId} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH https://api.example.com/collections/{collectionId} HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "description": "string",
  "visibility": "public"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api.example.com/collections/{collectionId}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch 'https://api.example.com/collections/{collectionId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('https://api.example.com/collections/{collectionId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','https://api.example.com/collections/{collectionId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/collections/{collectionId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "https://api.example.com/collections/{collectionId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /collections/{collectionId}`

_Update a collection by its ID_

> Body parameter

```json
{
  "name": "string",
  "description": "string",
  "visibility": "public"
}
```

<h3 id="patchcollectionbyid-parameters">Parameters</h3>

| Name          | In    | Type                            | Required | Description |
| ------------- | ----- | ------------------------------- | -------- | ----------- |
| body          | body  | object                          | false    | none        |
| » name        | body  | string                          | true     | none        |
| » description | body  | string                          | false    | none        |
| » visibility  | body  | [visibility](#schemavisibility) | false    | none        |
| collectionId  | query | string(uuid)                    | false    | none        |

#### Enumerated Values

| Parameter    | Value    |
| ------------ | -------- |
| » visibility | public   |
| » visibility | private  |
| » visibility | unlisted |

> Example responses

> 200 Response

```json
{
  "collectionId": "0ffe69e2-b7af-4b1e-835c-867376165f50",
  "creatorId": "688ebf54-d343-4104-8711-82c2feac534a",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z",
  "visibility": "public",
  "name": "string",
  "description": "string",
  "assetCount": 0,
  "assets": [
    {
      "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
      "displayName": "string",
      "assetId": "9179b887-04ef-4ce5-ab3a-b5bbd39ea3c8",
      "assetType": "character",
      "name": "string",
      "imageUrl": "http://example.com",
      "likes": 0,
      "likedByCurrentUser": true,
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z",
      "description": "string"
    }
  ]
}
```

<h3 id="patchcollectionbyid-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | OK           | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Forbidden    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Not Found    | None   |

<h3 id="patchcollectionbyid-responseschema">Response Schema</h3>

#### Enumerated Values

| Property   | Value     |
| ---------- | --------- |
| visibility | public    |
| visibility | private   |
| visibility | unlisted  |
| assetType  | character |
| assetType  | location  |
| assetType  | quest     |
| assetType  | map       |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

## deleteCollectionById

<a id="opIddeleteCollectionById"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE https://api.example.com/collections/{collectionId}

```

```http
DELETE https://api.example.com/collections/{collectionId} HTTP/1.1
Host: api.example.com

```

```javascript
fetch("https://api.example.com/collections/{collectionId}", {
  method: "DELETE",
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

result = RestClient.delete 'https://api.example.com/collections/{collectionId}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('https://api.example.com/collections/{collectionId}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','https://api.example.com/collections/{collectionId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/collections/{collectionId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "https://api.example.com/collections/{collectionId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /collections/{collectionId}`

_Delete a collection by its ID_

<h3 id="deletecollectionbyid-parameters">Parameters</h3>

| Name         | In    | Type         | Required | Description |
| ------------ | ----- | ------------ | -------- | ----------- |
| collectionId | query | string(uuid) | false    | none        |

<h3 id="deletecollectionbyid-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 204    | [No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5) | No Content   | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Forbidden    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Not Found    | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

## addAssetsToCollection

<a id="opIdaddAssetsToCollection"></a>

> Code samples

```shell
# You can also use wget
curl -X POST https://api.example.com/collections/{collectionId}/assets \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST https://api.example.com/collections/{collectionId}/assets HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "assetIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api.example.com/collections/{collectionId}/assets',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'https://api.example.com/collections/{collectionId}/assets',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('https://api.example.com/collections/{collectionId}/assets', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','https://api.example.com/collections/{collectionId}/assets', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/collections/{collectionId}/assets");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "https://api.example.com/collections/{collectionId}/assets", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /collections/{collectionId}/assets`

_Add a list of assets to a collection_

> Body parameter

```json
{
  "assetIds": ["497f6eca-6276-4993-bfeb-53cbbbba6f08"]
}
```

<h3 id="addassetstocollection-parameters">Parameters</h3>

| Name         | In    | Type         | Required | Description |
| ------------ | ----- | ------------ | -------- | ----------- |
| body         | body  | object       | false    | none        |
| » assetIds   | body  | [string]     | true     | none        |
| collectionId | query | string(uuid) | false    | none        |

> Example responses

> 200 Response

```json
{
  "collectionId": "0ffe69e2-b7af-4b1e-835c-867376165f50",
  "creatorId": "688ebf54-d343-4104-8711-82c2feac534a",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z",
  "visibility": "public",
  "name": "string",
  "description": "string",
  "assetCount": 0,
  "assets": [
    {
      "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
      "displayName": "string",
      "assetId": "9179b887-04ef-4ce5-ab3a-b5bbd39ea3c8",
      "assetType": "character",
      "name": "string",
      "imageUrl": "http://example.com",
      "likes": 0,
      "likedByCurrentUser": true,
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z",
      "description": "string"
    }
  ]
}
```

<h3 id="addassetstocollection-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | OK           | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Forbidden    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Not Found    | None   |

<h3 id="addassetstocollection-responseschema">Response Schema</h3>

#### Enumerated Values

| Property   | Value     |
| ---------- | --------- |
| visibility | public    |
| visibility | private   |
| visibility | unlisted  |
| assetType  | character |
| assetType  | location  |
| assetType  | quest     |
| assetType  | map       |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

## removeAssetsFromCollection

<a id="opIdremoveAssetsFromCollection"></a>

> Code samples

```shell
# You can also use wget
curl -X POST https://api.example.com/collections/{collectionId}/assets/delete \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST https://api.example.com/collections/{collectionId}/assets/delete HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "assetIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api.example.com/collections/{collectionId}/assets/delete',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'https://api.example.com/collections/{collectionId}/assets/delete',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('https://api.example.com/collections/{collectionId}/assets/delete', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','https://api.example.com/collections/{collectionId}/assets/delete', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/collections/{collectionId}/assets/delete");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "https://api.example.com/collections/{collectionId}/assets/delete", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /collections/{collectionId}/assets/delete`

_Remove a list of assets from a collection_

> Body parameter

```json
{
  "assetIds": ["497f6eca-6276-4993-bfeb-53cbbbba6f08"]
}
```

<h3 id="removeassetsfromcollection-parameters">Parameters</h3>

| Name         | In    | Type         | Required | Description |
| ------------ | ----- | ------------ | -------- | ----------- |
| body         | body  | object       | false    | none        |
| » assetIds   | body  | [string]     | true     | none        |
| collectionId | query | string(uuid) | false    | none        |

> Example responses

> 200 Response

```json
{
  "collectionId": "0ffe69e2-b7af-4b1e-835c-867376165f50",
  "creatorId": "688ebf54-d343-4104-8711-82c2feac534a",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z",
  "visibility": "public",
  "name": "string",
  "description": "string",
  "assetCount": 0,
  "assets": [
    {
      "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
      "displayName": "string",
      "assetId": "9179b887-04ef-4ce5-ab3a-b5bbd39ea3c8",
      "assetType": "character",
      "name": "string",
      "imageUrl": "http://example.com",
      "likes": 0,
      "likedByCurrentUser": true,
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z",
      "description": "string"
    }
  ]
}
```

<h3 id="removeassetsfromcollection-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | OK           | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Forbidden    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Not Found    | None   |

<h3 id="removeassetsfromcollection-responseschema">Response Schema</h3>

#### Enumerated Values

| Property   | Value     |
| ---------- | --------- |
| visibility | public    |
| visibility | private   |
| visibility | unlisted  |
| assetType  | character |
| assetType  | location  |
| assetType  | quest     |
| assetType  | map       |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

<h1 id="tabletop-generator-api-user">user</h1>

Users operations

## initializeUser

<a id="opIdinitializeUser"></a>

> Code samples

```shell
# You can also use wget
curl -X POST https://api.example.com/users \
  -H 'Accept: application/json'

```

```http
POST https://api.example.com/users HTTP/1.1
Host: api.example.com
Accept: application/json

```

```javascript
const headers = {
  Accept: "application/json",
};

fetch("https://api.example.com/users", {
  method: "POST",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.post 'https://api.example.com/users',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.post('https://api.example.com/users', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','https://api.example.com/users', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/users");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "https://api.example.com/users", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /users`

_Find or create a record for the current user_

> Example responses

> 200 Response

```json
{
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "createdAt": "2019-08-24T14:15:22Z",
  "displayName": "string",
  "bio": "string"
}
```

<h3 id="initializeuser-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | OK           | Inline |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)    | OK           | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |

<h3 id="initializeuser-responseschema">Response Schema</h3>

Status Code **200**

| Name          | Type              | Required | Restrictions | Description |
| ------------- | ----------------- | -------- | ------------ | ----------- |
| » userId      | string(uuid)      | true     | none         | none        |
| » createdAt   | string(date-time) | true     | none         | none        |
| » displayName | string            | true     | none         | none        |
| » bio         | string            | true     | none         | none        |

Status Code **201**

| Name          | Type              | Required | Restrictions | Description |
| ------------- | ----------------- | -------- | ------------ | ----------- |
| » userId      | string(uuid)      | true     | none         | none        |
| » createdAt   | string(date-time) | true     | none         | none        |
| » displayName | string            | true     | none         | none        |
| » bio         | string            | true     | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

## getUserById

<a id="opIdgetUserById"></a>

> Code samples

```shell
# You can also use wget
curl -X GET https://api.example.com/users/{userId} \
  -H 'Accept: application/json'

```

```http
GET https://api.example.com/users/{userId} HTTP/1.1
Host: api.example.com
Accept: application/json

```

```javascript
const headers = {
  Accept: "application/json",
};

fetch("https://api.example.com/users/{userId}", {
  method: "GET",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'https://api.example.com/users/{userId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('https://api.example.com/users/{userId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.example.com/users/{userId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/users/{userId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.example.com/users/{userId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /users/{userId}`

_Retrieve a user by their ID_

<h3 id="getuserbyid-parameters">Parameters</h3>

| Name   | In    | Type         | Required | Description |
| ------ | ----- | ------------ | -------- | ----------- |
| userId | query | string(uuid) | false    | none        |

> Example responses

> 200 Response

```json
{
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "createdAt": "2019-08-24T14:15:22Z",
  "displayName": "string",
  "bio": "string"
}
```

<h3 id="getuserbyid-responses">Responses</h3>

| Status | Meaning                                                        | Description | Schema |
| ------ | -------------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)        | OK          | Inline |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4) | Not Found   | None   |

<h3 id="getuserbyid-responseschema">Response Schema</h3>

Status Code **200**

| Name          | Type              | Required | Restrictions | Description |
| ------------- | ----------------- | -------- | ------------ | ----------- |
| » userId      | string(uuid)      | true     | none         | none        |
| » createdAt   | string(date-time) | true     | none         | none        |
| » displayName | string            | true     | none         | none        |
| » bio         | string            | true     | none         | none        |

<aside class="success">
This operation does not require authentication
</aside>

## getCurrentUser

<a id="opIdgetCurrentUser"></a>

> Code samples

```shell
# You can also use wget
curl -X GET https://api.example.com/users/me \
  -H 'Accept: application/json'

```

```http
GET https://api.example.com/users/me HTTP/1.1
Host: api.example.com
Accept: application/json

```

```javascript
const headers = {
  Accept: "application/json",
};

fetch("https://api.example.com/users/me", {
  method: "GET",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'https://api.example.com/users/me',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('https://api.example.com/users/me', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.example.com/users/me', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/users/me");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.example.com/users/me", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /users/me`

_Retrieve the current user_

> Example responses

> 200 Response

```json
{
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "createdAt": "2019-08-24T14:15:22Z",
  "displayName": "string",
  "bio": "string"
}
```

<h3 id="getcurrentuser-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | OK           | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |

<h3 id="getcurrentuser-responseschema">Response Schema</h3>

Status Code **200**

| Name          | Type              | Required | Restrictions | Description |
| ------------- | ----------------- | -------- | ------------ | ----------- |
| » userId      | string(uuid)      | true     | none         | none        |
| » createdAt   | string(date-time) | true     | none         | none        |
| » displayName | string            | true     | none         | none        |
| » bio         | string            | true     | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

## patchCurrentUser

<a id="opIdpatchCurrentUser"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH https://api.example.com/users/me \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH https://api.example.com/users/me HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "displayName": "string",
  "bio": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api.example.com/users/me',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch 'https://api.example.com/users/me',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('https://api.example.com/users/me', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','https://api.example.com/users/me', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/users/me");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "https://api.example.com/users/me", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /users/me`

_Update the current user_

> Body parameter

```json
{
  "displayName": "string",
  "bio": "string"
}
```

<h3 id="patchcurrentuser-parameters">Parameters</h3>

| Name          | In   | Type   | Required | Description |
| ------------- | ---- | ------ | -------- | ----------- |
| body          | body | object | false    | none        |
| » displayName | body | string | false    | none        |
| » bio         | body | string | false    | none        |

> Example responses

> 200 Response

```json
{
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "createdAt": "2019-08-24T14:15:22Z",
  "displayName": "string",
  "bio": "string"
}
```

<h3 id="patchcurrentuser-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | OK           | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |

<h3 id="patchcurrentuser-responseschema">Response Schema</h3>

Status Code **200**

| Name          | Type              | Required | Restrictions | Description |
| ------------- | ----------------- | -------- | ------------ | ----------- |
| » userId      | string(uuid)      | true     | none         | none        |
| » createdAt   | string(date-time) | true     | none         | none        |
| » displayName | string            | true     | none         | none        |
| » bio         | string            | true     | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

<h1 id="tabletop-generator-api-comment">comment</h1>

Comments operations

## createCommentByAssetId

<a id="opIdcreateCommentByAssetId"></a>

> Code samples

```shell
# You can also use wget
curl -X POST https://api.example.com/assets/{assetId}/comments \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST https://api.example.com/assets/{assetId}/comments HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "body": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api.example.com/assets/{assetId}/comments',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'https://api.example.com/assets/{assetId}/comments',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('https://api.example.com/assets/{assetId}/comments', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','https://api.example.com/assets/{assetId}/comments', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/assets/{assetId}/comments");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "https://api.example.com/assets/{assetId}/comments", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /assets/{assetId}/comments`

_Create a new comment on a specific asset_

> Body parameter

```json
{
  "body": "string"
}
```

<h3 id="createcommentbyassetid-parameters">Parameters</h3>

| Name    | In   | Type         | Required | Description |
| ------- | ---- | ------------ | -------- | ----------- |
| body    | body | object       | false    | none        |
| » body  | body | string       | true     | none        |
| assetId | path | string(uuid) | true     | none        |

> Example responses

> 201 Response

```json
{
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "displayName": "string",
  "commentId": "ee0469af-2fa1-4b7e-b5f1-8e711a95821b",
  "body": "string",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="createcommentbyassetid-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema                    |
| ------ | --------------------------------------------------------------- | ------------ | ------------------------- |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)    | OK           | [comment](#schemacomment) |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None                      |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Forbidden    | None                      |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Not Found    | None                      |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

## getCommentsByAssetId

<a id="opIdgetCommentsByAssetId"></a>

> Code samples

```shell
# You can also use wget
curl -X GET https://api.example.com/assets/{assetId}/comments \
  -H 'Accept: application/json'

```

```http
GET https://api.example.com/assets/{assetId}/comments HTTP/1.1
Host: api.example.com
Accept: application/json

```

```javascript
const headers = {
  Accept: "application/json",
};

fetch("https://api.example.com/assets/{assetId}/comments", {
  method: "GET",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get 'https://api.example.com/assets/{assetId}/comments',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('https://api.example.com/assets/{assetId}/comments', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.example.com/assets/{assetId}/comments', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/assets/{assetId}/comments");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.example.com/assets/{assetId}/comments", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /assets/{assetId}/comments`

_Retrieve all comments for a specific asset_

<h3 id="getcommentsbyassetid-parameters">Parameters</h3>

| Name    | In    | Type         | Required | Description |
| ------- | ----- | ------------ | -------- | ----------- |
| limit   | query | integer      | false    | none        |
| offset  | query | integer      | false    | none        |
| assetId | path  | string(uuid) | true     | none        |

> Example responses

> 200 Response

```json
[
  {
    "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
    "displayName": "string",
    "commentId": "ee0469af-2fa1-4b7e-b5f1-8e711a95821b",
    "body": "string",
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  }
]
```

<h3 id="getcommentsbyassetid-responses">Responses</h3>

| Status | Meaning                                                        | Description | Schema |
| ------ | -------------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)        | OK          | Inline |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4) | Not Found   | None   |

<h3 id="getcommentsbyassetid-responseschema">Response Schema</h3>

Status Code **200**

| Name        | Type    | Required | Restrictions | Description |
| ----------- | ------- | -------- | ------------ | ----------- |
| _anonymous_ | [allOf] | false    | none         | none        |

_allOf_

| Name           | Type                              | Required | Restrictions | Description |
| -------------- | --------------------------------- | -------- | ------------ | ----------- |
| » _anonymous_  | [userSummary](#schemausersummary) | false    | none         | none        |
| »» userId      | string(uuid)                      | true     | none         | none        |
| »» displayName | string                            | true     | none         | none        |

_and_

| Name          | Type              | Required | Restrictions | Description |
| ------------- | ----------------- | -------- | ------------ | ----------- |
| » _anonymous_ | object            | false    | none         | none        |
| »» commentId  | string(uuid)      | true     | none         | none        |
| »» body       | string            | true     | none         | none        |
| »» createdAt  | string(date-time) | true     | none         | none        |
| »» updatedAt  | string(date-time) | true     | none         | none        |

<aside class="success">
This operation does not require authentication
</aside>

## patchCommentById

<a id="opIdpatchCommentById"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH https://api.example.com/assets/{assetId}/comments/{commentId} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH https://api.example.com/assets/{assetId}/comments/{commentId} HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "body": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api.example.com/assets/{assetId}/comments/{commentId}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch 'https://api.example.com/assets/{assetId}/comments/{commentId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('https://api.example.com/assets/{assetId}/comments/{commentId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','https://api.example.com/assets/{assetId}/comments/{commentId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/assets/{assetId}/comments/{commentId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "https://api.example.com/assets/{assetId}/comments/{commentId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /assets/{assetId}/comments/{commentId}`

_Update a specific comment by its ID_

> Body parameter

```json
{
  "body": "string"
}
```

<h3 id="patchcommentbyid-parameters">Parameters</h3>

| Name      | In   | Type         | Required | Description |
| --------- | ---- | ------------ | -------- | ----------- |
| body      | body | object       | false    | none        |
| » body    | body | string       | true     | none        |
| assetId   | path | string(uuid) | true     | none        |
| commentId | path | string(uuid) | true     | none        |

> Example responses

> 200 Response

```json
{
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "displayName": "string",
  "commentId": "ee0469af-2fa1-4b7e-b5f1-8e711a95821b",
  "body": "string",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="patchcommentbyid-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema                    |
| ------ | --------------------------------------------------------------- | ------------ | ------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | OK           | [comment](#schemacomment) |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None                      |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Forbidden    | None                      |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Not Found    | None                      |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

## deleteCommentById

<a id="opIddeleteCommentById"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE https://api.example.com/assets/{assetId}/comments/{commentId}

```

```http
DELETE https://api.example.com/assets/{assetId}/comments/{commentId} HTTP/1.1
Host: api.example.com

```

```javascript
fetch("https://api.example.com/assets/{assetId}/comments/{commentId}", {
  method: "DELETE",
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

result = RestClient.delete 'https://api.example.com/assets/{assetId}/comments/{commentId}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('https://api.example.com/assets/{assetId}/comments/{commentId}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','https://api.example.com/assets/{assetId}/comments/{commentId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.example.com/assets/{assetId}/comments/{commentId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "https://api.example.com/assets/{assetId}/comments/{commentId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /assets/{assetId}/comments/{commentId}`

_Delete a specific comment by its ID_

<h3 id="deletecommentbyid-parameters">Parameters</h3>

| Name      | In   | Type         | Required | Description |
| --------- | ---- | ------------ | -------- | ----------- |
| assetId   | path | string(uuid) | true     | none        |
| commentId | path | string(uuid) | true     | none        |

<h3 id="deletecommentbyid-responses">Responses</h3>

| Status | Meaning                                                         | Description  | Schema |
| ------ | --------------------------------------------------------------- | ------------ | ------ |
| 204    | [No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5) | No Content   | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Unauthorized | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Forbidden    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Not Found    | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicHttpAuthentication, bearerHttpAuthentication
</aside>

# Schemas

<h2 id="tocS_asset">asset</h2>
<!-- backwards compatibility -->
<a id="schemaasset"></a>
<a id="schema_asset"></a>
<a id="tocSasset"></a>
<a id="tocsasset"></a>

```json
{
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "displayName": "string",
  "assetId": "9179b887-04ef-4ce5-ab3a-b5bbd39ea3c8",
  "assetType": "character",
  "name": "string",
  "imageUrl": "http://example.com",
  "likes": 0,
  "likedByCurrentUser": true,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z",
  "description": "string"
}
```

### Properties

allOf

| Name        | Type                              | Required | Restrictions | Description |
| ----------- | --------------------------------- | -------- | ------------ | ----------- |
| _anonymous_ | [userSummary](#schemausersummary) | false    | none         | none        |

and

| Name                 | Type                          | Required | Restrictions | Description |
| -------------------- | ----------------------------- | -------- | ------------ | ----------- |
| _anonymous_          | object                        | false    | none         | none        |
| » assetId            | string(uuid)                  | true     | none         | none        |
| » assetType          | [assetType](#schemaassettype) | true     | none         | none        |
| » name               | string                        | true     | none         | none        |
| » imageUrl           | string(uri)                   | true     | none         | none        |
| » likes              | integer                       | true     | none         | none        |
| » likedByCurrentUser | boolean                       | true     | none         | none        |
| » createdAt          | string(date-time)             | true     | none         | none        |
| » updatedAt          | string(date-time)             | true     | none         | none        |
| » description        | string                        | true     | none         | none        |

<h2 id="tocS_assetData">assetData</h2>
<!-- backwards compatibility -->
<a id="schemaassetdata"></a>
<a id="schema_assetData"></a>
<a id="tocSassetdata"></a>
<a id="tocsassetdata"></a>

```json
{
  "race": "human",
  "class": "barbarian",
  "gender": "male",
  "alignment": "lawful_good",
  "appearance": "string",
  "personality": "string",
  "background": "string",
  "abilities": "string",
  "equipment": "string",
  "motivation": "string",
  "notes": "string"
}
```

The `data` field contains asset-specific data. It varies depending on the `assetType`:

- `"character"` → Character schema
- `"location"` → Location schema
- `"quest"` → Quest schema
- `"map"` → Map schema

See examples for full structures.

### Properties

oneOf

| Name        | Type                          | Required | Restrictions | Description |
| ----------- | ----------------------------- | -------- | ------------ | ----------- |
| _anonymous_ | [character](#schemacharacter) | false    | none         | none        |

xor

| Name        | Type                        | Required | Restrictions | Description |
| ----------- | --------------------------- | -------- | ------------ | ----------- |
| _anonymous_ | [location](#schemalocation) | false    | none         | none        |

xor

| Name        | Type                  | Required | Restrictions | Description |
| ----------- | --------------------- | -------- | ------------ | ----------- |
| _anonymous_ | [quest](#schemaquest) | false    | none         | none        |

xor

| Name        | Type              | Required | Restrictions | Description |
| ----------- | ----------------- | -------- | ------------ | ----------- |
| _anonymous_ | [map](#schemamap) | false    | none         | none        |

<h2 id="tocS_visibility">visibility</h2>
<!-- backwards compatibility -->
<a id="schemavisibility"></a>
<a id="schema_visibility"></a>
<a id="tocSvisibility"></a>
<a id="tocsvisibility"></a>

```json
"public"
```

### Properties

| Name        | Type   | Required | Restrictions | Description |
| ----------- | ------ | -------- | ------------ | ----------- |
| _anonymous_ | string | false    | none         | none        |

#### Enumerated Values

| Property    | Value    |
| ----------- | -------- |
| _anonymous_ | public   |
| _anonymous_ | private  |
| _anonymous_ | unlisted |

<h2 id="tocS_assetType">assetType</h2>
<!-- backwards compatibility -->
<a id="schemaassettype"></a>
<a id="schema_assetType"></a>
<a id="tocSassettype"></a>
<a id="tocsassettype"></a>

```json
"character"
```

### Properties

| Name        | Type   | Required | Restrictions | Description |
| ----------- | ------ | -------- | ------------ | ----------- |
| _anonymous_ | string | false    | none         | none        |

#### Enumerated Values

| Property    | Value     |
| ----------- | --------- |
| _anonymous_ | character |
| _anonymous_ | location  |
| _anonymous_ | quest     |
| _anonymous_ | map       |

<h2 id="tocS_character">character</h2>
<!-- backwards compatibility -->
<a id="schemacharacter"></a>
<a id="schema_character"></a>
<a id="tocScharacter"></a>
<a id="tocscharacter"></a>

```json
{
  "race": "human",
  "class": "barbarian",
  "gender": "male",
  "alignment": "lawful_good",
  "appearance": "string",
  "personality": "string",
  "background": "string",
  "abilities": "string",
  "equipment": "string",
  "motivation": "string",
  "notes": "string"
}
```

### Properties

| Name        | Type   | Required | Restrictions | Description |
| ----------- | ------ | -------- | ------------ | ----------- |
| race        | string | true     | none         | none        |
| class       | string | true     | none         | none        |
| gender      | string | true     | none         | none        |
| alignment   | string | true     | none         | none        |
| appearance  | string | false    | none         | none        |
| personality | string | false    | none         | none        |
| background  | string | false    | none         | none        |
| abilities   | string | false    | none         | none        |
| equipment   | string | false    | none         | none        |
| motivation  | string | false    | none         | none        |
| notes       | string | false    | none         | none        |

#### Enumerated Values

| Property  | Value           |
| --------- | --------------- |
| race      | human           |
| race      | elf             |
| race      | drow            |
| race      | half_elf        |
| race      | half_orc        |
| race      | halfling        |
| race      | dwarf           |
| race      | gnome           |
| race      | tiefling        |
| race      | githyanki       |
| race      | dragonborn      |
| class     | barbarian       |
| class     | bard            |
| class     | cleric          |
| class     | druid           |
| class     | fighter         |
| class     | monk            |
| class     | paladin         |
| class     | ranger          |
| class     | rogue           |
| class     | sorcerer        |
| class     | warlock         |
| class     | wizard          |
| gender    | male            |
| gender    | female          |
| gender    | non_binary      |
| gender    | genderfluid     |
| gender    | agender         |
| alignment | lawful_good     |
| alignment | neutral_good    |
| alignment | chaotic_good    |
| alignment | lawful_neutral  |
| alignment | true_neutral    |
| alignment | chaotic_neutral |
| alignment | lawful_evil     |
| alignment | neutral_evil    |
| alignment | chaotic_evil    |

<h2 id="tocS_location">location</h2>
<!-- backwards compatibility -->
<a id="schemalocation"></a>
<a id="schema_location"></a>
<a id="tocSlocation"></a>
<a id="tocslocation"></a>

```json
{
  "locationType": "string",
  "terrain": "string",
  "climate": "string",
  "atmosphere": "string",
  "inhabitants": "string",
  "dangerLevel": "string",
  "pointsOfInterest": "string",
  "narrativeRole": "string",
  "notes": "string"
}
```

### Properties

| Name             | Type   | Required | Restrictions | Description |
| ---------------- | ------ | -------- | ------------ | ----------- |
| locationType     | string | true     | none         | none        |
| terrain          | string | false    | none         | none        |
| climate          | string | false    | none         | none        |
| atmosphere       | string | false    | none         | none        |
| inhabitants      | string | false    | none         | none        |
| dangerLevel      | string | false    | none         | none        |
| pointsOfInterest | string | false    | none         | none        |
| narrativeRole    | string | false    | none         | none        |
| notes            | string | false    | none         | none        |

<h2 id="tocS_quest">quest</h2>
<!-- backwards compatibility -->
<a id="schemaquest"></a>
<a id="schema_quest"></a>
<a id="tocSquest"></a>
<a id="tocsquest"></a>

```json
{
  "questType": "string",
  "tone": "string",
  "location": "string",
  "complexity": "string",
  "objective": "string",
  "antagonist": "string",
  "notableNPCs": "string",
  "hasCombat": true,
  "hasPuzzles": true,
  "hasSkillChallenges": true,
  "hasDilemmas": true,
  "notes": "string"
}
```

### Properties

| Name               | Type    | Required | Restrictions | Description |
| ------------------ | ------- | -------- | ------------ | ----------- |
| questType          | string  | true     | none         | none        |
| tone               | string  | false    | none         | none        |
| location           | string  | false    | none         | none        |
| complexity         | string  | false    | none         | none        |
| objective          | string  | false    | none         | none        |
| antagonist         | string  | false    | none         | none        |
| notableNPCs        | string  | false    | none         | none        |
| hasCombat          | boolean | false    | none         | none        |
| hasPuzzles         | boolean | false    | none         | none        |
| hasSkillChallenges | boolean | false    | none         | none        |
| hasDilemmas        | boolean | false    | none         | none        |
| notes              | string  | false    | none         | none        |

<h2 id="tocS_map">map</h2>
<!-- backwards compatibility -->
<a id="schemamap"></a>
<a id="schema_map"></a>
<a id="tocSmap"></a>
<a id="tocsmap"></a>

```json
{
  "mapType": "string",
  "terrain": "string",
  "scale": "string",
  "pointsOfInterest": "string",
  "notes": "string"
}
```

### Properties

| Name             | Type   | Required | Restrictions | Description |
| ---------------- | ------ | -------- | ------------ | ----------- |
| mapType          | string | true     | none         | none        |
| terrain          | string | false    | none         | none        |
| scale            | string | false    | none         | none        |
| pointsOfInterest | string | false    | none         | none        |
| notes            | string | false    | none         | none        |

<h2 id="tocS_comment">comment</h2>
<!-- backwards compatibility -->
<a id="schemacomment"></a>
<a id="schema_comment"></a>
<a id="tocScomment"></a>
<a id="tocscomment"></a>

```json
{
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "displayName": "string",
  "commentId": "ee0469af-2fa1-4b7e-b5f1-8e711a95821b",
  "body": "string",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

### Properties

allOf

| Name        | Type                              | Required | Restrictions | Description |
| ----------- | --------------------------------- | -------- | ------------ | ----------- |
| _anonymous_ | [userSummary](#schemausersummary) | false    | none         | none        |

and

| Name        | Type              | Required | Restrictions | Description |
| ----------- | ----------------- | -------- | ------------ | ----------- |
| _anonymous_ | object            | false    | none         | none        |
| » commentId | string(uuid)      | true     | none         | none        |
| » body      | string            | true     | none         | none        |
| » createdAt | string(date-time) | true     | none         | none        |
| » updatedAt | string(date-time) | true     | none         | none        |

<h2 id="tocS_collection">collection</h2>
<!-- backwards compatibility -->
<a id="schemacollection"></a>
<a id="schema_collection"></a>
<a id="tocScollection"></a>
<a id="tocscollection"></a>

```json
{
  "collectionId": "0ffe69e2-b7af-4b1e-835c-867376165f50",
  "creatorId": "688ebf54-d343-4104-8711-82c2feac534a",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z",
  "visibility": "public",
  "name": "string",
  "description": "string",
  "assetCount": 0
}
```

### Properties

| Name         | Type                            | Required | Restrictions | Description |
| ------------ | ------------------------------- | -------- | ------------ | ----------- |
| collectionId | string(uuid)                    | true     | none         | none        |
| creatorId    | string(uuid)                    | true     | none         | none        |
| createdAt    | string(date-time)               | true     | none         | none        |
| updatedAt    | string(date-time)               | true     | none         | none        |
| visibility   | [visibility](#schemavisibility) | true     | none         | none        |
| name         | string                          | true     | none         | none        |
| description  | string                          | true     | none         | none        |
| assetCount   | integer                         | true     | none         | none        |

<h2 id="tocS_userSummary">userSummary</h2>
<!-- backwards compatibility -->
<a id="schemausersummary"></a>
<a id="schema_userSummary"></a>
<a id="tocSusersummary"></a>
<a id="tocsusersummary"></a>

```json
{
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "displayName": "string"
}
```

### Properties

| Name        | Type         | Required | Restrictions | Description |
| ----------- | ------------ | -------- | ------------ | ----------- |
| userId      | string(uuid) | true     | none         | none        |
| displayName | string       | true     | none         | none        |
