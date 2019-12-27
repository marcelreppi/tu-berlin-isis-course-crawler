echo "event;date;time;browser;browserId" > events.csv

aws s3 rm s3://tu-berlin-isis-course-crawler-events-test/events.csv
aws s3 cp ./events.csv s3://tu-berlin-isis-course-crawler-events-test/events.csv

rm events.csv