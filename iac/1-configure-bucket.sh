# create bucket (if necessary)
gsutil mb -p ak-insights -b on gs://insights-survey-client
# ensure all users can view the bucket
gsutil iam ch allUsers:objectViewer gs://insights-survey-client
# set default page and 404 page
gsutil web set -m index.html -e 404.html gs://insights-survey-client
