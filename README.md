# iT-REXpert 🦖 - Le dino de l'IT

Blog technique d'un administrateur système Windows avec +25 ans d'expérience en automatisation, PowerShell, Ansible, Terraform et DevOps.

[![Deploy Hugo site to Pages](https://github.com/AutomationREX/AutomationREX.github.io/actions/workflows/hugo.yml/badge.svg)](https://github.com/AutomationREX/AutomationREX.github.io/actions/workflows/hugo.yml)

## 🚀 Site web

Le blog est accessible à l'adresse : **https://AutomationREX.github.io**

## 📝 À propos

Ce blog couvre les thématiques suivantes :

- **PowerShell** - Scripts, automatisation, best practices
- **DevOps** - CI/CD, Infrastructure as Code
- **Ansible** - Playbooks, automatisation multi-plateformes
- **Terraform** - Gestion d'infrastructure cloud
- **Windows Server** - Administration, optimisation, sécurité
- **Cloud** - Azure, AWS, stratégies hybrides

## 🛠️ Technologies

- **Hugo** - Générateur de site statique
- **PaperMod** - Thème moderne et performant
- **GitHub Pages** - Hébergement
- **GitHub Actions** - Déploiement automatique

## 💻 Développement local

### Prérequis

- Hugo Extended (v0.152.2+)
- Git

### Installation

```bash
# Cloner le repository
git clone https://github.com/AutomationREX/AutomationREX.github.io.git
cd AutomationREX.github.io

# Initialiser les submodules (thème)
git submodule update --init --recursive

# Démarrer le serveur de développement
hugo server -D
```

Le site sera accessible à l'adresse : http://localhost:1313

### Créer un nouvel article

```bash
# Créer un nouveau post
hugo new posts/mon-article.md

# Éditer l'article dans content/posts/mon-article.md
# Mettre draft: false quand prêt à publier
```

## 📦 Structure du projet

```
.
├── .github/
│   └── workflows/
│       └── hugo.yml          # GitHub Actions workflow
├── content/
│   ├── posts/                # Articles du blog
│   └── pages/                # Pages statiques (À propos, etc.)
├── static/
│   └── images/               # Images et assets
├── themes/
│   └── PaperMod/            # Thème (submodule)
├── hugo.toml                 # Configuration Hugo
└── README.md
```

## 🚀 Déploiement

Le site est automatiquement déployé sur GitHub Pages via GitHub Actions lors d'un push sur la branche `main`.

### Configuration GitHub Pages

1. Aller dans **Settings** > **Pages**
2. Source : **GitHub Actions**
3. Le workflow se lance automatiquement

## 📄 Licence

Le contenu de ce blog est sous licence [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

Le code source (scripts, exemples) est sous licence MIT.

## 📧 Contact

- GitHub : [@AutomationREX](https://github.com/AutomationREX)
- LinkedIn : [Votre profil]

---

*"L'expérience, ça compte !"* 🦖
