# Domain mail DNS note

Last checked: 2026-06-02

## Current state

- Public website: `https://tinnitusbioregulation.com`
- DNS nameservers: Wix DNS (`ns4.wixdns.net`, `ns5.wixdns.net`)
- Netlify target:
  - Apex `tinnitusbioregulation.com` resolves to `75.2.60.5`
  - `www.tinnitusbioregulation.com` is a CNAME to `glittery-panda-d49b35.netlify.app`
- Visible website contact email: `Dustin5.mueller87@gmail.com`
- No visible `@tinnitusbioregulation.com` email address is currently used on the website.

## Mail DNS status

No public mail DNS records were found for `tinnitusbioregulation.com`:

- No MX records
- No SPF TXT record
- No DMARC TXT record at `_dmarc.tinnitusbioregulation.com`

This is not a live website bug as long as the site keeps using the Gmail address above. It becomes relevant only if a domain mailbox is used, for example `info@tinnitusbioregulation.com`.

## What to do before using domain email

1. Choose the mail provider, for example Google Workspace, Microsoft 365, Proton, Zoho, or Wix Mailboxes.
2. Open the DNS settings where the domain is managed: Wix DNS.
3. Add the exact MX, SPF, DKIM, and DMARC records shown by the chosen mail provider.
4. Wait for DNS propagation.
5. Verify:
   - MX lookup returns the provider mail servers.
   - SPF TXT exists on `tinnitusbioregulation.com`.
   - DKIM TXT/CNAME exists exactly as provided.
   - DMARC TXT exists on `_dmarc.tinnitusbioregulation.com`.

## Suggested DMARC starting policy

Use this only after SPF and DKIM are configured correctly:

```txt
v=DMARC1; p=none; rua=mailto:dmarc@tinnitusbioregulation.com; adkim=s; aspf=s
```

If no `dmarc@tinnitusbioregulation.com` mailbox exists, replace the `rua` address with a monitored mailbox or omit `rua` temporarily.

