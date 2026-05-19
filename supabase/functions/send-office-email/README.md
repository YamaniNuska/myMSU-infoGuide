# send-office-email

Supabase Edge Function that sends real office emails for the Admin Info message form.

## Required Supabase secrets

Set these in your Supabase project before deploying:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set OFFICE_EMAIL_FROM="myMSU InfoGuide <your_verified_sender@yourdomain.com>"
```

`OFFICE_EMAIL_FROM` must be a sender/domain verified in Resend. For testing, Resend's onboarding sender may be limited.

## Deploy

```bash
supabase functions deploy send-office-email
```

The Expo app calls this function after saving the message in `admin_contact_messages`.
