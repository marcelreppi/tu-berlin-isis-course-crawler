cd lambda

rm lambda.zip

# Make new zip file
zip -r -1 -q ./lambda.zip .

# Upload to AWS
aws lambda update-function-code --function-name tu-berlin-isis-course-crawler-event-tracker --zip-file fileb://lambda.zip

# Delete zip
rm lambda.zip