GET http://localhost:8080
HTTP 200
Cache-Control: no-cache
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.githubUrl" matches /^https:\/\/github.com\/.+/
jsonpath "$.version" matches /^\d+\.\d+\.\d+$/
