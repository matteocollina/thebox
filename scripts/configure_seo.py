#!/usr/bin/env python3
"""Configure absolute SEO URLs for the production origin, without dependencies."""

import argparse
import html
import json
import re
from pathlib import Path
from urllib.parse import urlsplit
from xml.sax.saxutils import escape


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("origin", help="Production origin, e.g. https://www.thebox.it")
    args = parser.parse_args()
    parts = urlsplit(args.origin)
    if (parts.scheme != "https" or not parts.hostname or parts.username
            or parts.password or parts.query or parts.fragment
            or parts.path not in ("", "/") or any(c.isspace() for c in args.origin)):
        parser.error("Use an HTTPS origin without credentials, path, query or fragment.")

    origin = args.origin.rstrip("/")
    home = origin + "/"
    logo = origin + "/assets/logo.png"
    services = [
        "Impianti fotovoltaici", "Sicurezza e antintrusione", "Videosorveglianza",
        "Domotica e smart living", "Automazione cancelli", "Ristrutturazioni chiavi in mano",
    ]
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "Organization", "@id": home + "#organization",
             "name": "The Box", "url": home, "logo": logo,
             "telephone": "+393467255004",
             "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Servizi The Box",
                                 "itemListElement": [
                                     {"@type": "Offer", "itemOffered": {
                                         "@type": "Service", "name": service,
                                         "provider": {"@id": home + "#organization"}
                                     }} for service in services]}},
            {"@type": "WebSite", "@id": home + "#website", "url": home,
             "name": "The Box", "inLanguage": "it-IT",
             "publisher": {"@id": home + "#organization"}},
            {"@type": "WebPage", "@id": home + "#webpage", "url": home,
             "name": "The Box | Fotovoltaico, sicurezza, domotica e ristrutturazioni",
             "inLanguage": "it-IT", "isPartOf": {"@id": home + "#website"},
             "about": {"@id": home + "#organization"}},
        ],
    }
    encoded_schema = json.dumps(schema, ensure_ascii=False, indent=2).replace("<", "\\u003c")
    block = '\n'.join([
        '<!-- SEO:START -->',
        f'    <link rel="canonical" href="{html.escape(home, quote=True)}" />',
        f'    <meta property="og:url" content="{html.escape(home, quote=True)}" />',
        f'    <meta property="og:image" content="{html.escape(logo, quote=True)}" />',
        f'    <meta name="twitter:image" content="{html.escape(logo, quote=True)}" />',
        '    <script type="application/ld+json">', encoded_schema, '    </script>',
        '    <!-- SEO:END -->',
    ])
    dist = Path(__file__).resolve().parent.parent / "dist"
    page = dist / "index.html"
    source = page.read_text()
    updated, count = re.subn(r"<!-- SEO:START -->.*?<!-- SEO:END -->",
                             lambda _: block, source, flags=re.DOTALL)
    if count != 1:
        raise SystemExit("Expected exactly one SEO marker block in dist/index.html.")
    page.write_text(updated)
    (dist / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {origin}/sitemap.xml\n")
    (dist / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f'  <url><loc>{escape(home)}</loc></url>\n'
        '</urlset>\n'
    )
    print(f"SEO configured for {home}")


if __name__ == "__main__":
    main()
