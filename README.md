# iT-REXpert - Le dino de l'IT 🦖

Blog technique d'un administrateur système Windows avec 25 ans d'expérience.

## À propos

Ce site partage des articles techniques sur :
- PowerShell & automatisation
- Ansible & configuration management
- Terraform & Infrastructure as Code
- DevOps & bonnes pratiques
- Windows Server administration

## Développement local

### Prérequis

- Hugo Extended (v0.152.2 ou supérieur)

```bash
# macOS
brew install hugo

# Linux
sudo apt-get install hugo

# Windows
choco install hugo-extended
```

### Lancement du serveur de développement

```bash
hugo server -D
```

Le site sera accessible sur [http://localhost:1313](http://localhost:1313)

### Créer un nouvel article

```bash
hugo new posts/mon-article.md
```

Éditez ensuite le fichier dans `content/posts/mon-article.md`

## Structure du projet

```
.
├── .github/
│   └── workflows/          # GitHub Actions pour le déploiement
├── content/
│   ├── posts/              # Articles de blog
│   ├── about.md            # Page à propos
│   └── search.md           # Page de recherche
├── themes/
│   └── PaperMod/           # Thème Hugo
├── hugo.toml               # Configuration Hugo
└── README.md
```

## Déploiement

Le site est automatiquement déployé sur GitHub Pages via GitHub Actions lors d'un push sur la branche `main`.

URL du site : [https://AutomationREX.github.io](https://AutomationREX.github.io)

## Build manuel

```bash
# Build pour production
hugo --minify

# Build avec les brouillons
hugo --buildDrafts
```

Le site généré se trouve dans le dossier `public/`

## Configuration GitHub Pages

1. Aller dans Settings > Pages
2. Source : GitHub Actions
3. Le workflow `.github/workflows/deploy.yml` gère le déploiement automatique

## Thème

Ce site utilise [PaperMod](https://github.com/adityatelange/hugo-PaperMod), un thème Hugo moderne et rapide.

## Licence

Le contenu de ce blog est sous licence [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

Le code source des exemples peut être utilisé librement.

## Contact

- GitHub : [@AutomationREX](https://github.com/AutomationREX)
- Site : [AutomationREX.github.io](https://AutomationREX.github.io)

---

*"Le dino de l'IT qui a survécu à toutes les ères technologiques"* 🦖
