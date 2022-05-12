gcloud iam service-accounts create \
    --project ak-insights \
    insights-sc-pipeline \
    --description "Service accout to run GitHub Action deploying the site"

gcloud iam roles create \
    Custom_insights_sc_pipeline \
    --project ak-insights \
    --description "Role for service account to run GitHub Actions deploying the site"

gcloud iam roles update \
    Custom_insights_sc_pipeline \
    --project ak-insights \
    --permissions storage.buckets.get,storage.buckets.list,storage.objects.create,storage.objects.delete,storage.objects.get,storage.objects.list,storage.objects.update \

gcloud projects add-iam-policy-binding ak-insights \
    --member=serviceAccount:insights-sc-pipeline@ak-insights.iam.gserviceaccount.com \
    --role=projects/ak-insights/roles/Custom_insights_sc_pipeline

gcloud iam service-accounts keys create \
    ./sa-private-key.json \
    --iam-account insights-sc-pipeline@ak-insights.iam.gserviceaccount.com
