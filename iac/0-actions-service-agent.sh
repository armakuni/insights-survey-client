gcloud iam service-accounts create --project ak-insights insights-sc-pipeline --description "Service accout to run GitHub Action deploying the site"
gcloud iam service-accounts keys create ./sa-private-key.json --iam-account  insights-sc-pipeline@ak-insights.iam.gserviceaccount.com
