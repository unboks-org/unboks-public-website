# Unboks.org Public Website Production Deploy

Nr1 is a static Vite app served by nginx on the VPS.

## Canonical Paths

- Source repo: `unboks-org/unboks-public-website`
- App folder: `artifacts/wetakeyourjob`
- Live symlink: `/var/www/unboks-public/current`
- Release folder: `/var/www/unboks-public/releases/<timestamp>-<name>`
- Nginx site: `/etc/nginx/sites-enabled/unboks-public`
- Nginx template in this repo: `deploy/nginx/unboks-public.conf`

## Required Routing

The app uses client-side routing. Production nginx must serve `index.html` for route paths such as:

- `/`
- `/signup`
- `/contact`
- `/faq`

Use:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Static assets should still 404 when missing:

```nginx
location ~* \.(?:css|js|mjs|png|jpg|jpeg|gif|webp|svg|ico|woff2?)$ {
    try_files $uri =404;
}
```

## Safe Deploy Checklist

1. Create rollback copy:

   ```bash
   TS=$(date +%Y%m%d-%H%M%S)
   RB=/root/_site_rollbacks/nr1-$TS
   mkdir -p "$RB"
   cp -a /var/www/unboks-public/current "$RB/current-release-copy"
   readlink -f /var/www/unboks-public/current > "$RB/current-target.txt"
   cp -a /etc/nginx/sites-enabled/unboks-public "$RB/nginx-unboks-public"
   ```

2. Build from the intended Git branch.
3. Copy `artifacts/wetakeyourjob/dist/public` into a new release folder.
4. Move `/var/www/unboks-public/current` to the new release with `ln -sfn`.
5. Run `nginx -t`.
6. Reload nginx.
7. Verify:

   ```bash
   curl -I https://unboks.org/
   curl -I https://unboks.org/signup
   curl -I https://unboks.org/contact
   curl -I https://unboks.org/faq
   ```

## Rollback

```bash
ln -sfn "$(cat /root/_site_rollbacks/<rollback>/current-target.txt)" /var/www/unboks-public/current
nginx -t && systemctl reload nginx
```
