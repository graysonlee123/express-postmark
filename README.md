# express-postmark

Private REST API for sending emails via Postmark.

## Setup

```bash
pnpm install
pnpm run build
```

## Environment Variables

Create a `.env` file:

```
POSTMARK_API_TOKEN=your-uuid-token
EMAIL_FROM=sender@example.com
EMAIL_TO=recipient@example.com
PORT=3000  # optional, defaults to 3000
```

`EMAIL_TO` supports comma-separated addresses for multiple recipients.

## Usage

```bash
pnpm start
```

### Endpoint

`POST /`

```json
{
  "subject": "Hello",
  "html": "<p>HTML body</p>",
  "text": "Plain text body"
}
```

### Response

Success:
```json
{ "ok": true, "message": "Email sent" }
```

Error:
```json
{ "ok": false, "message": "...", "errors": ["..."] }
```

## Docker

```bash
docker build -t express-postmark .
docker run -p 3000:3000 --env-file .env express-postmark
```

See commit history for changes.
