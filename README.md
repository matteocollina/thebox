Dalla cartella del progetto esegui:
```bash
cd /Users/matteocollina/Desktop/Dev/thebox
python3 -m http.server 8000 --directory dist
```
Poi apri:
http://localhost:8000

SEO: prima della pubblicazione configura il dominio HTTPS definitivo:

```bash
python3 scripts/configure_seo.py https://theboxsmartsolutions.it
```

Il comando genera `dist/robots.txt` e `dist/sitemap.xml` e aggiorna canonical,
URL delle anteprime social e dati strutturati in `dist/index.html`.
Può essere ripetuto quando cambia il dominio. Pubblica il contenuto di `dist`
alla radice del dominio, così `/robots.txt` e `/sitemap.xml` sono raggiungibili.
La sitemap contiene la homepage: le ancore delle sezioni non sono pagine separate.

Sono inclusi title e description, metadati Open Graph e Twitter, dati strutturati
Organization, WebSite, WebPage e catalogo dei servizi. Indirizzo, area servita,
recensioni e profili social vanno aggiunti solo dopo aver verificato i dati reali.
I contenuti restano visibili anche con JavaScript disabilitato.

Dopo la pubblicazione, verifica che homepage, robots e sitemap restituiscano HTTP
200 e invia `/sitemap.xml` dalla proprietà del dominio in Google Search Console.
Configura sul provider hosting il redirect permanente delle varianti HTTP e
www/non-www verso il dominio scelto.
