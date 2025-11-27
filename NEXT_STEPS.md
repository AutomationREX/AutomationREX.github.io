# Prochaines étapes pour déployer votre blog

Votre site Hugo **iT-REXpert** est maintenant prêt ! Voici les étapes pour le déployer sur GitHub Pages.

## 📋 Configuration GitHub Pages

### 1. Pusher le code sur GitHub

```bash
# Pousser le code vers GitHub
git push origin main
```

### 2. Configurer GitHub Pages

1. Aller sur votre repository GitHub : `https://github.com/AutomationREX/AutomationREX.github.io`
2. Cliquer sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquer sur **Pages**
4. Sous **Source**, sélectionner **GitHub Actions**
5. Le workflow `.github/workflows/deploy.yml` sera automatiquement détecté

### 3. Vérifier le déploiement

1. Aller dans l'onglet **Actions** de votre repository
2. Vous devriez voir le workflow "Deploy Hugo site to GitHub Pages" en cours
3. Attendez que le workflow soit terminé (environ 1-2 minutes)
4. Votre site sera disponible sur : `https://AutomationREX.github.io`

## 🎨 Personnalisations recommandées

### Avatar et Logo

1. Créer un dossier `static/images/`
2. Ajouter votre avatar/logo
3. Mettre à jour [hugo.toml](hugo.toml) :

```toml
[params]
  profileMode.enabled = true
  profileMode.title = "iT-REXpert"
  profileMode.imageUrl = "/images/avatar.png"
  profileMode.imageTitle = "Le dino de l'IT"
```

### Favicon

1. Créer votre favicon (32x32 et 16x16)
2. Placer les fichiers dans `static/`
3. Nommer les `favicon.ico` et `favicon-32x32.png`

### Couleurs personnalisées

Créer le fichier `assets/css/extended/custom.css` :

```css
:root {
    --theme: #1e3a8a;      /* Bleu dinosaure */
    --entry: #f8fafc;      /* Fond des cartes */
    --primary: #0ea5e9;    /* Couleur primaire */
}
```

## 📝 Créer de nouveaux articles

### Commande Hugo

```bash
# Créer un nouvel article
hugo new posts/mon-nouvel-article.md

# L'article sera créé dans content/posts/mon-nouvel-article.md
```

### Front Matter standard

```yaml
---
title: "Titre de mon article"
date: 2025-11-27
draft: false  # Mettre à true pour un brouillon
tags: ["PowerShell", "Windows"]
categories: ["PowerShell"]
author: "iT-REXpert"
description: "Description courte pour le SEO"
---
```

### Workflow de publication

1. Créer l'article localement
2. Tester avec `hugo server -D`
3. Vérifier le rendu sur `http://localhost:1313`
4. Commit et push vers GitHub
5. Le site sera automatiquement déployé

## 🔧 Développement local

### Commandes utiles

```bash
# Serveur de développement (avec brouillons)
hugo server -D

# Serveur de développement (sans brouillons)
hugo server

# Build pour production
hugo --minify

# Vérifier la configuration
hugo config
```

### VSCode Tasks disponibles

Vous avez deux tâches configurées dans `.vscode/tasks.json` :

- **Build** (Ctrl+Shift+B) : `hugo`
- **Serve Drafts** (test task) : `hugo server -D`

## 🎯 Fonctionnalités du site

### Pages disponibles

- **Accueil** : `/` - Page d'accueil avec présentation
- **Articles** : `/posts/` - Liste de tous les articles
- **À propos** : `/about/` - Votre profil
- **Catégories** : `/categories/` - Articles par catégorie
- **Tags** : `/tags/` - Articles par tag
- **Recherche** : `/search/` - Recherche dans le contenu
- **RSS** : `/index.xml` - Flux RSS

### Articles déjà créés

1. ✅ Bienvenue sur iT-REXpert
2. ✅ PowerShell : Les bonnes pratiques après 25 ans d'IT
3. ✅ Ansible pour Windows : Guide du vétéran
4. ✅ Terraform sur Azure : Infrastructure as Code
5. ✅ 25 ans d'évolution : Du batch au DevOps

## 🌐 SEO et Performance

### Optimisations déjà en place

- ✅ Sitemap XML automatique
- ✅ Flux RSS
- ✅ Meta descriptions
- ✅ Minification HTML/CSS/JS
- ✅ Temps de lecture
- ✅ Partage sur réseaux sociaux
- ✅ Code copyable

### Améliorations futures recommandées

- [ ] Ajouter Google Analytics
- [ ] Configurer un domaine personnalisé
- [ ] Ajouter des images à la une pour chaque article
- [ ] Intégrer un système de commentaires (giscus, utterances)

## 📱 Réseaux sociaux

Mettre à jour les liens dans [hugo.toml](hugo.toml) :

```toml
[[params.socialIcons]]
  name = "github"
  url = "https://github.com/AutomationREX"

[[params.socialIcons]]
  name = "linkedin"
  url = "https://linkedin.com/in/votre-profil"

[[params.socialIcons]]
  name = "twitter"
  url = "https://twitter.com/votre-compte"

[[params.socialIcons]]
  name = "rss"
  url = "/index.xml"
```

## 🔒 Bonnes pratiques

### Sécurité

- ✅ Pas de secrets dans le code
- ✅ `.gitignore` configuré
- ✅ Workflow sécurisé

### Workflow Git

```bash
# Workflow recommandé pour les articles
git checkout -b article/nouveau-sujet
# ... éditer l'article ...
hugo server -D  # tester
git add .
git commit -m "Ajout article sur [sujet]"
git push origin article/nouveau-sujet
# Créer une PR sur GitHub
```

### Maintenance

- Mettre à jour Hugo régulièrement : `brew upgrade hugo`
- Mettre à jour le thème : `git submodule update --remote themes/PaperMod`
- Surveiller les dépendances de sécurité sur GitHub

## 🎓 Ressources

### Hugo

- [Documentation Hugo](https://gohugo.io/documentation/)
- [PaperMod Theme](https://github.com/adityatelange/hugo-PaperMod)

### Markdown

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

### GitHub Pages

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [GitHub Actions](https://docs.github.com/actions)

## ❓ Questions fréquentes

**Q : Comment changer l'URL de base ?**
A : Modifier `baseURL` dans [hugo.toml](hugo.toml)

**Q : Comment ajouter un domaine personnalisé ?**
A : Créer un fichier `static/CNAME` avec votre domaine

**Q : Les articles n'apparaissent pas ?**
A : Vérifier que `draft: false` dans le front matter

**Q : Comment activer les commentaires ?**
A : Utiliser giscus, utterances ou Disqus (voir documentation PaperMod)

## 🚀 C'est parti !

Votre blog est prêt à être déployé. N'oubliez pas :

1. Push vers GitHub
2. Configurer GitHub Pages
3. Attendre le déploiement
4. Visiter `https://AutomationREX.github.io`

**Bon blogging ! 🦖**

---

*Pour toute question, consultez la documentation ou ouvrez une issue sur GitHub.*
