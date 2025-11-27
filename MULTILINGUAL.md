# Guide Multilingue / Multilingual Guide

Ce blog est disponible en **français** (langue par défaut) et en **anglais**.

This blog is available in **French** (default language) and **English**.

---

## Structure du contenu / Content Structure

### Français (par défaut / default)
```
content/
├── about.md
├── search.md
└── posts/
    ├── bienvenue-iT-REXpert.md
    ├── powershell-best-practices.md
    ├── ansible-windows-guide.md
    ├── terraform-azure-infrastructure.md
    └── devops-evolution-25-ans.md
```

### English
```
content/en/
├── about.md
├── search.md
└── posts/
    ├── welcome-iT-REXpert.md
    ├── powershell-best-practices.md
    ├── ansible-windows-guide.md
    ├── terraform-azure-infrastructure.md
    └── devops-evolution-25-years.md
```

---

## Comment créer un nouvel article / How to Create a New Article

### En français / In French

```bash
hugo new posts/mon-article.md
```

Le fichier sera créé dans `content/posts/mon-article.md`

The file will be created in `content/posts/mon-article.md`

### En anglais / In English

```bash
hugo new en/posts/my-article.md
```

Le fichier sera créé dans `content/en/posts/my-article.md`

The file will be created in `content/en/posts/my-article.md`

---

## URLs du site / Site URLs

### Version française / French version
- Page d'accueil / Home: `https://AutomationREX.github.io/`
- Articles: `https://AutomationREX.github.io/posts/`
- À propos: `https://AutomationREX.github.io/about/`

### Version anglaise / English version
- Home page: `https://AutomationREX.github.io/en/`
- Posts: `https://AutomationREX.github.io/en/posts/`
- About: `https://AutomationREX.github.io/en/about/`

---

## Sélecteur de langue / Language Selector

Le thème PaperMod affiche automatiquement un sélecteur de langue dans le menu de navigation.

The PaperMod theme automatically displays a language selector in the navigation menu.

Les utilisateurs peuvent basculer entre 🇫🇷 Français et 🇬🇧 English à tout moment.

Users can switch between 🇫🇷 French and 🇬🇧 English at any time.

---

## Configuration / Configuration

La configuration multilingue se trouve dans [hugo.toml](hugo.toml) :

The multilingual configuration is in [hugo.toml](hugo.toml):

```toml
defaultContentLanguage = 'fr'
defaultContentLanguageInSubdir = false

[languages]
  [languages.fr]
    languageCode = 'fr-FR'
    languageName = 'Français'
    title = "iT-REXpert - Le dino de l'IT"
    weight = 1

  [languages.en]
    languageCode = 'en-US'
    languageName = 'English'
    title = "iT-REXpert - The IT Dinosaur"
    weight = 2
```

---

## Traductions / Translations

### Articles traduits / Translated Articles

Tous les articles initiaux ont été traduits en anglais :

All initial articles have been translated to English:

| Français | English |
|----------|---------|
| Bienvenue sur iT-REXpert | Welcome to iT-REXpert |
| PowerShell : Les bonnes pratiques | PowerShell: Best Practices |
| Ansible pour Windows | Ansible for Windows |
| Terraform sur Azure | Terraform on Azure |
| 25 ans d'évolution | 25 Years of Evolution |

### Ajouter des traductions / Adding Translations

Pour traduire un article existant / To translate an existing article:

1. Créer le fichier dans `content/en/posts/` / Create the file in `content/en/posts/`
2. Copier le front matter et le contenu / Copy the front matter and content
3. Traduire le contenu / Translate the content
4. Garder le même nom de fichier (recommandé) / Keep the same file name (recommended)

---

## RSS Feeds

Chaque langue a son propre flux RSS / Each language has its own RSS feed:

- Français: `https://AutomationREX.github.io/index.xml`
- English: `https://AutomationREX.github.io/en/index.xml`

---

## SEO et indexation / SEO and Indexing

Hugo génère automatiquement les balises `hreflang` pour indiquer aux moteurs de recherche les versions linguistiques alternatives.

Hugo automatically generates `hreflang` tags to indicate to search engines the alternative language versions.

---

## Bonnes pratiques / Best Practices

### 1. Cohérence des noms / File Naming Consistency

Utilisez des noms de fichiers cohérents entre les langues pour faciliter la maintenance :

Use consistent file names across languages for easier maintenance:

```
content/posts/powershell-best-practices.md
content/en/posts/powershell-best-practices.md
```

### 2. Dates / Dates

Gardez la même date pour les traductions :

Keep the same date for translations:

```yaml
date: 2025-11-27
```

### 3. Tags et catégories / Tags and Categories

Les tags techniques peuvent rester en anglais dans toutes les langues :

Technical tags can remain in English across all languages:

```yaml
tags: ["PowerShell", "Ansible", "Terraform"]
categories: ["PowerShell"]
```

### 4. Code / Code

Le code reste identique dans toutes les langues (sauf les commentaires) :

Code remains the same in all languages (except comments):

```powershell
# FR: Commentaire en français
# EN: Comment in English
Get-Process | Where-Object {$_.CPU -gt 100}
```

---

## Test local / Local Testing

Pour tester les deux langues localement / To test both languages locally:

```bash
hugo server -D
```

Puis visitez / Then visit:
- Version française: `http://localhost:1313/`
- English version: `http://localhost:1313/en/`

---

## Déploiement / Deployment

Le workflow GitHub Actions déploie automatiquement les deux versions linguistiques.

The GitHub Actions workflow automatically deploys both language versions.

Pas de configuration supplémentaire nécessaire ! / No additional configuration needed!

---

## Support / Support

Pour toute question sur le multilingue / For any questions about multilingual:
- 🇫🇷 Ouvrez une issue en français / Open an issue in French
- 🇬🇧 Open an issue in English

---

**Le dino de l'IT parle français ET anglais !** 🦖

**The IT Dinosaur speaks French AND English!** 🦖
