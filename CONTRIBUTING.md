# Guide de contribution

Merci de votre intérêt pour contribuer à iT-REXpert !

## Comment proposer un article ou une correction

### 1. Signaler une erreur

Si vous trouvez une erreur dans un article :
1. Ouvrez une issue sur GitHub
2. Décrivez l'erreur avec précision
3. Indiquez l'article concerné et la section

### 2. Proposer une amélioration

Pour proposer une amélioration :
1. Forkez le repository
2. Créez une branche : `git checkout -b amélioration/description`
3. Faites vos modifications
4. Testez localement avec `hugo server -D`
5. Créez une Pull Request

### 3. Proposer un nouvel article

Si vous souhaitez proposer un sujet d'article :
1. Ouvrez une issue avec le label "suggestion"
2. Décrivez le sujet proposé
3. Expliquez pourquoi ce sujet serait utile

## Standards de code

### Pour les scripts PowerShell
- Utiliser les cmdlets complets (pas d'alias)
- Inclure la documentation avec Comment-Based Help
- Tester le code avant de soumettre
- Suivre les bonnes pratiques PSScriptAnalyzer

### Pour les playbooks Ansible
- YAML valide et bien indenté (2 espaces)
- Tâches nommées clairement
- Inclure des exemples d'utilisation
- Tester sur un environnement de développement

### Pour le code Terraform
- Formater avec `terraform fmt`
- Valider avec `terraform validate`
- Inclure des exemples de fichiers .tfvars
- Documenter les variables et outputs

## Style d'écriture

- Ton professionnel mais accessible
- Exemples concrets et testés
- Explications claires des concepts
- Code commenté quand nécessaire
- Ressources complémentaires à la fin

## Process de review

1. Soumission de la PR
2. Vérification technique du code
3. Test en local
4. Review du contenu
5. Merge et publication

## Questions ?

Ouvrez une issue ou contactez-moi sur GitHub.

Merci pour votre contribution ! 🦖
