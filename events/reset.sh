echo "event;date;time;browser;browserId" > events.csv

aws s3 rm s3://tu-berlin-isis-course-crawler-events/events.csv
aws s3 cp ./events.csv s3://tu-berlin-isis-course-crawler-events/events.csv

rm events.csv