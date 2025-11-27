---
title: "Ansible pour Windows : Guide du vétéran"
date: 2025-11-26
draft: false
tags: ["Ansible", "Windows", "Automatisation", "Configuration Management"]
categories: ["Ansible"]
author: "iT-REXpert"
description: "Comment utiliser Ansible efficacement dans un environnement Windows après des années d'expérience"
---

## Introduction

Quand j'ai découvert Ansible il y a quelques années, j'étais sceptique : "Encore un outil Linux qui prétend gérer Windows...". Mais Ansible a prouvé sa valeur. Voici comment je l'utilise au quotidien.

## Configuration initiale de WinRM

Première étape cruciale : configurer WinRM correctement sur vos serveurs Windows.

```powershell
# Script à exécuter sur chaque serveur Windows cible
# Télécharger depuis GitHub Ansible
Invoke-WebRequest -Uri https://raw.githubusercontent.com/ansible/ansible/devel/examples/scripts/ConfigureRemotingForAnsible.ps1 -OutFile ConfigureRemotingForAnsible.ps1

.\ConfigureRemotingForAnsible.ps1 -EnableCredSSP
```

## Structure d'inventaire pour Windows

```ini
# inventory/windows.ini
[windows_servers]
srv-dc01.domain.local
srv-app01.domain.local
srv-sql01.domain.local

[windows_servers:vars]
ansible_user=DOMAIN\ansible-svc
ansible_password={{ vault_ansible_password }}
ansible_connection=winrm
ansible_winrm_transport=kerberos
ansible_winrm_server_cert_validation=ignore
ansible_port=5986
```

## Playbook : Installation de fonctionnalités Windows

```yaml
---
- name: Configuration des serveurs Windows
  hosts: windows_servers
  gather_facts: yes

  tasks:
    - name: Installer les fonctionnalités Windows
      ansible.windows.win_feature:
        name:
          - Web-Server
          - Web-Asp-Net45
          - Web-Mgmt-Console
        state: present
      register: feature_install

    - name: Redémarrer si nécessaire
      ansible.windows.win_reboot:
        reboot_timeout: 600
      when: feature_install.reboot_required
```

## Gestion des mises à jour Windows

Un de mes playbooks les plus utilisés :

```yaml
---
- name: Gestion des mises à jour Windows
  hosts: windows_servers

  tasks:
    - name: Rechercher les mises à jour
      ansible.windows.win_updates:
        category_names:
          - SecurityUpdates
          - CriticalUpdates
          - UpdateRollups
        state: searched
      register: available_updates

    - name: Afficher le nombre de mises à jour
      ansible.builtin.debug:
        msg: "{{ available_updates.found_update_count }} mises à jour disponibles"

    - name: Installer les mises à jour critiques
      ansible.windows.win_updates:
        category_names:
          - SecurityUpdates
          - CriticalUpdates
        reboot: yes
        reboot_timeout: 3600
      when: available_updates.found_update_count > 0
```

## Configuration d'Active Directory

```yaml
---
- name: Créer des utilisateurs AD
  hosts: dc01

  tasks:
    - name: Créer une OU
      community.windows.win_domain_ou:
        name: Employees
        path: "DC=domain,DC=local"
        state: present

    - name: Créer des utilisateurs
      community.windows.win_domain_user:
        name: "{{ item.name }}"
        firstname: "{{ item.firstname }}"
        surname: "{{ item.surname }}"
        password: "{{ item.password }}"
        state: present
        path: "OU=Employees,DC=domain,DC=local"
        groups:
          - Domain Users
      loop:
        - { name: 'jdoe', firstname: 'John', surname: 'Doe', password: 'P@ssw0rd123!' }
        - { name: 'mjane', firstname: 'Mary', surname: 'Jane', password: 'P@ssw0rd456!' }
      no_log: true  # Ne pas logger les mots de passe
```

## Déploiement d'applications

```yaml
---
- name: Déployer une application .NET
  hosts: app_servers

  tasks:
    - name: Créer le répertoire de l'application
      ansible.windows.win_file:
        path: C:\inetpub\myapp
        state: directory

    - name: Copier les fichiers de l'application
      ansible.windows.win_copy:
        src: ./app/
        dest: C:\inetpub\myapp\

    - name: Créer le site IIS
      community.windows.win_iis_website:
        name: MyApp
        state: started
        port: 80
        physical_path: C:\inetpub\myapp
        application_pool: DefaultAppPool

    - name: Créer la règle de pare-feu
      community.windows.win_firewall_rule:
        name: MyApp HTTP
        localport: 80
        action: allow
        direction: in
        protocol: tcp
        state: present
        enabled: yes
```

## Bonnes pratiques accumulées

### 1. Utilisez Ansible Vault pour les secrets

```bash
# Créer un fichier vault
ansible-vault create group_vars/all/vault.yml

# Contenu du vault
vault_ansible_password: "SuperSecretPassword"
vault_db_password: "DatabasePassword"
```

### 2. Testez avec --check mode

```bash
ansible-playbook playbook.yml --check --diff
```

### 3. Utilisez des rôles pour la réutilisabilité

```
roles/
├── common/
│   ├── tasks/
│   │   └── main.yml
│   ├── handlers/
│   │   └── main.yml
│   └── defaults/
│       └── main.yml
└── webserver/
    ├── tasks/
    │   └── main.yml
    └── templates/
        └── web.config.j2
```

## Gestion des erreurs

```yaml
- name: Tâche qui peut échouer
  ansible.windows.win_shell: |
    Get-Service NonExistentService
  register: result
  failed_when: false
  changed_when: false

- name: Gérer l'erreur
  ansible.builtin.debug:
    msg: "Le service n'existe pas, c'est normal"
  when: result.rc != 0
```

## Conclusion

Ansible a transformé ma façon de gérer les environnements Windows. L'approche déclarative et l'idempotence permettent d'obtenir des infrastructures cohérentes et reproductibles.

## Ressources

- [Ansible Windows Documentation](https://docs.ansible.com/ansible/latest/os_guide/windows.html)
- [Ansible Galaxy - Collections Windows](https://galaxy.ansible.com/)

---

*Ansible et Windows, un duo gagnant quand on maîtrise les deux mondes !* 🦖
