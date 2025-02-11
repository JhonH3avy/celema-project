# Define the URL of the Swagger JSON file
$url = "http://62.146.180.148:82/swagger/v1/swagger.json"

# Define the path where the file should be saved
$outputPath = "${PWD}\swagger_v2.json"

# Use Invoke-WebRequest to download the file
Invoke-WebRequest -Uri $url -OutFile $outputPath

Write-Host "Swagger JSON file downloaded to $outputPath"

docker run --rm -v ${PWD}:/usr/src/app openapitools/openapi-generator-cli generate -i /usr/src/app/swagger_v2.json -g typescript-angular -o /usr/src/app/src/app/core/services-v2/ --skip-validate-spec
