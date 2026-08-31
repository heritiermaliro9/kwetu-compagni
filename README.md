# KWETU COMPANY

Site vitrine prêt pour Netlify, avec catalogue, images et administration via Netlify Functions + Netlify Blobs. Aucun FTP, PHP ou MySQL n’est requis.

## Accès administrateur

Adresse : `votre-domaine/admin/`

Dans Netlify, avant le déploiement, ouvrez **Project configuration → Environment variables** et créez ces variables secrètes : `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_ACCESS_KEY` et `ADMIN_TOKEN_SECRET` (une longue valeur aléatoire).

Si le navigateur affiche « Connexion impossible », le site a généralement été envoyé avec **Netlify Drop** ou les variables sont absentes. Les fonctions ne sont alors pas publiées. Importez le dépôt Git, vérifiez les quatre variables puis cliquez sur **Deploys → Trigger deploy → Deploy site**.

Après le déploiement, ouvrez `https://votre-site.netlify.app/api/status`. Le navigateur doit afficher `"ok":true` et `"functions":true`. Si cette adresse donne une page 404, le site a été publié comme un simple site statique et l’administration ne pourra pas fonctionner.

Dans l’administration, vous pouvez publier un produit avec son image. Les images JPG, PNG et WebP jusqu’à 4 Mo sont conservées dans Netlify Blobs.

## Déploiement Netlify

- Importez ce projet depuis un dépôt Git (GitHub/GitLab) dans Netlify. Dans les paramètres de build, utilisez `npm install` comme commande de build ; le dossier de publication est `.`. Cette méthode est nécessaire pour déployer les fonctions admin ; Netlify Drop seul ne déploie que le site statique.
- Ajoutez les quatre variables d’environnement, puis effectuez un nouveau déploiement.
- Ne publiez jamais ces valeurs dans le code ou une capture d’écran.
