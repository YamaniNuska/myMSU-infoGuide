# send-office-email

Legacy Supabase Edge Function that previously sent office emails for the Admin
Info message form.

The app now posts to the Node backend route `POST /send-email`, and that route
sends through Gmail SMTP with Nodemailer. Keep this function only if you still
need the older Resend-based flow.

## Legacy Resend secrets

Set these in your Supabase project only if you are still deploying this legacy
function:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set OFFICE_EMAIL_FROM="myMSU InfoGuide <your_verified_sender@yourdomain.com>"
```

`OFFICE_EMAIL_FROM` must be a sender/domain verified in Resend. For testing, Resend's onboarding sender may be limited.

## Legacy deploy

```bash
supabase functions deploy send-office-email
```

The current Expo app does not call this function.
