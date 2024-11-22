docker run --rm -v ${PWD}:/usr/src/app openapitools/openapi-generator-cli generate -i /usr/src/app/swagger.json -g typescript-angular -o /usr/src/app/src/app/core/services-v2/ --skip-validate-spec
