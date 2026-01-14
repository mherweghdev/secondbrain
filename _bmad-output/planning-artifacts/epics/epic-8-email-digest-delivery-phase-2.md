# Epic 8: Email Digest Delivery (Phase 2)

**Goal:** Les utilisateurs peuvent envoyer automatiquement le digest par email le lundi matin

## Story 8.1: Configure SMTP Email Service Integration

As a developer,
I want to integrate an SMTP email service (Sendgrid/Mailgun/AWS SES),
So that the application can send digest emails reliably.

**Acceptance Criteria:**

**Given** An SMTP service account is created (e.g., Sendgrid API key)
**When** I configure SMTP credentials in environment variables
**Then** SMTP configuration includes: host, port, username, password, from address
**And** Email service client library is installed (e.g., Nodemailer)
**And** Test email can be sent successfully to verify configuration
**And** SMTP credentials are stored securely (environment variables, not hardcoded)
**And** Email service connection is tested on application startup
**And** Connection errors are logged and reported to monitoring system

---

## Story 8.2: Generate HTML Email Template from Digest Markdown

As a developer,
I want to convert digest markdown to professional HTML email format,
So that digests are readable and visually appealing in email clients.

**Acceptance Criteria:**

**Given** A digest has been generated in markdown format
**When** The email sending job runs
**Then** Markdown is converted to HTML using a markdown-to-HTML library (e.g., marked.js)
**And** HTML template includes professional styling (CSS inline styles for email compatibility)
**And** Template includes email header with logo/branding (optional)
**And** Template includes footer with unsubscribe link and application branding
**And** HTML is validated before sending (no malformed tags, proper encoding - NFR-I3)
**And** Template is mobile-responsive (readable on mobile email clients)
**And** Template is tested in multiple email clients (Gmail, Outlook, Apple Mail)

---

## Story 8.3: Schedule Digest Email Sending (Monday Morning)

As a developer,
I want to schedule digest emails to be sent every Monday morning at 7am,
So that leadership receives the report at the start of the week.

**Acceptance Criteria:**

**Given** A digest has been generated on Friday evening
**When** Monday morning arrives at 7am (user timezone)
**Then** Bull Queue cron job triggers email sending job
**And** Cron expression is configurable via environment variable (default: "0 7 * * 1" for 7am Monday)
**And** Job retrieves the most recent digest from the database
**And** Job converts digest markdown to HTML
**And** Job sends email to configured recipient address (e.g., manager@company.com)
**And** Job completes within 1 minute of scheduled time (NFR-I2)
**And** Job logs email send success/failure to application logs

---

## Story 8.4: Implement Email Retry Mechanism with Exponential Backoff

As a developer,
I want to retry failed email sends up to 3 times with exponential backoff,
So that temporary SMTP failures don't result in lost digest emails.

**Acceptance Criteria:**

**Given** An email send attempt fails (SMTP timeout, server error, etc.)
**When** The email sending job encounters an error
**Then** Job retries the send after 5 minutes (1st retry)
**And** If 1st retry fails, job retries after 15 minutes (2nd retry - exponential backoff)
**And** If 2nd retry fails, job retries after 45 minutes (3rd retry - exponential backoff)
**And** Total retry period spans ~2 hours (NFR-I1)
**And** If all 3 retries fail, job logs failure and notifies user in-app
**And** In-app notification shows "Digest email failed to send - please check manually"
**And** Retry mechanism achieves 99% delivery success rate (NFR-I1)

---

## Story 8.5: Validate Email Format Before Sending

As a developer,
I want to validate email content and recipient address before sending,
So that malformed or empty emails are never sent.

**Acceptance Criteria:**

**Given** An email is ready to be sent
**When** The email sending job runs
**Then** Recipient email address is validated (proper format: user@domain.com)
**And** Email subject is validated (non-empty, max 200 characters)
**And** Email HTML body is validated (non-empty, valid HTML tags closed properly)
**And** Email markdown source is validated (non-empty digest content)
**And** If validation fails, email is NOT sent and error is logged
**And** Validation catches: empty content, malformed HTML, invalid recipient (NFR-I3)
**And** Validation completes in <100ms before send attempt

---
