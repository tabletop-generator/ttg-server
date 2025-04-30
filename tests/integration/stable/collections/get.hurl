GET {{host}}/v1/collections
HTTP 200
[Asserts]
jsonpath "$.collections" isCollection
jsonpath "$.collections[0].userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.collections[0].collectionId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.collections[0].displayName" isString
jsonpath "$.collections[0].createdAt" isIsoDate
jsonpath "$.collections[0].updatedAt" isIsoDate
jsonpath "$.collections[0].visibility" matches "^public$|^private$|^unlisted$"
jsonpath "$.collections[0].name" isString
jsonpath "$.collections[0].description" isString
jsonpath "$.collections[0].assetCount" isInteger

# TODO: test private and unlisted collections
