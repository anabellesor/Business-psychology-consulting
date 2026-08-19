# Customer billing setup

The public app uses Stripe-hosted Payment Links for new subscriptions and Stripe's no-code customer portal for existing customer billing. Card numbers must never pass through GitHub Pages, PocketBase, Google Sheets, or the app repository.

## Products

Create three recurring monthly products in Stripe:

- Essentials — $499/month
- Growth — $899/month
- Strategic Insights — $1,499/month

Create a recurring Payment Link for each product. Configure Business Psychology Consulting branding, receipt emails, billing address collection as needed, terms acceptance, and the correct cancellation/refund disclosures.

Activate the no-code customer portal and permit the customer actions the company wants to support, such as updating payment methods, viewing invoices, and canceling at the end of a billing period.

## Connect the app

Paste only the public HTTPS links into app/config.js:

- billing.essentials
- billing.growth
- billing.strategic
- billing.portal

Never place a Stripe secret key or webhook signing secret in config.js.

## Production automation

Payment status must be verified with signed Stripe webhooks on a private backend before granting or removing app access. Recommended events include checkout.session.completed, invoice.paid, invoice.payment_failed, customer.subscription.updated, and customer.subscription.deleted.

Do not treat a return URL, browser message, or client-side JavaScript state as proof of payment.
