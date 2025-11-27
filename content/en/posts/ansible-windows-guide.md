---
title: "Ansible for Windows: Veteran's Guide"
date: 2025-11-26
draft: false
tags: ["Ansible", "Windows", "Automation", "Configuration Management"]
categories: ["Ansible"]
author: "iT-REXpert"
description: "How to use Ansible effectively in a Windows environment after years of experience"
---

## Introduction

When I discovered Ansible a few years ago, I was skeptical: "Another Linux tool claiming to manage Windows...". But Ansible proved its worth. Here's how I use it daily.

## Initial WinRM Configuration

First crucial step: configure WinRM correctly on your Windows servers.

```powershell
# Script to run on each target Windows server
# Download from Ansible GitHub
Invoke-WebRequest -Uri https://raw.githubusercontent.com/ansible/ansible/devel/examples/scripts/ConfigureRemotingForAnsible.ps1 -OutFile ConfigureRemotingForAnsible.ps1

.\ConfigureRemotingForAnsible.ps1 -EnableCredSSP
```

## Inventory Structure for Windows

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

## Playbook: Installing Windows Features

```yaml
---
- name: Configure Windows servers
  hosts: windows_servers
  gather_facts: yes

  tasks:
    - name: Install Windows features
      ansible.windows.win_feature:
        name:
          - Web-Server
          - Web-Asp-Net45
          - Web-Mgmt-Console
        state: present
      register: feature_install

    - name: Reboot if necessary
      ansible.windows.win_reboot:
        reboot_timeout: 600
      when: feature_install.reboot_required
```

## Windows Update Management

One of my most used playbooks:

```yaml
---
- name: Windows Update Management
  hosts: windows_servers

  tasks:
    - name: Search for updates
      ansible.windows.win_updates:
        category_names:
          - SecurityUpdates
          - CriticalUpdates
          - UpdateRollups
        state: searched
      register: available_updates

    - name: Display update count
      ansible.builtin.debug:
        msg: "{{ available_updates.found_update_count }} updates available"

    - name: Install critical updates
      ansible.windows.win_updates:
        category_names:
          - SecurityUpdates
          - CriticalUpdates
        reboot: yes
        reboot_timeout: 3600
      when: available_updates.found_update_count > 0
```

## Active Directory Configuration

```yaml
---
- name: Create AD users
  hosts: dc01

  tasks:
    - name: Create an OU
      community.windows.win_domain_ou:
        name: Employees
        path: "DC=domain,DC=local"
        state: present

    - name: Create users
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
      no_log: true  # Don't log passwords
```

## Application Deployment

```yaml
---
- name: Deploy .NET application
  hosts: app_servers

  tasks:
    - name: Create application directory
      ansible.windows.win_file:
        path: C:\inetpub\myapp
        state: directory

    - name: Copy application files
      ansible.windows.win_copy:
        src: ./app/
        dest: C:\inetpub\myapp\

    - name: Create IIS site
      community.windows.win_iis_website:
        name: MyApp
        state: started
        port: 80
        physical_path: C:\inetpub\myapp
        application_pool: DefaultAppPool

    - name: Create firewall rule
      community.windows.win_firewall_rule:
        name: MyApp HTTP
        localport: 80
        action: allow
        direction: in
        protocol: tcp
        state: present
        enabled: yes
```

## Accumulated Best Practices

### 1. Use Ansible Vault for Secrets

```bash
# Create a vault file
ansible-vault create group_vars/all/vault.yml

# Vault contents
vault_ansible_password: "SuperSecretPassword"
vault_db_password: "DatabasePassword"
```

### 2. Test with --check Mode

```bash
ansible-playbook playbook.yml --check --diff
```

### 3. Use Roles for Reusability

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

## Error Handling

```yaml
- name: Task that may fail
  ansible.windows.win_shell: |
    Get-Service NonExistentService
  register: result
  failed_when: false
  changed_when: false

- name: Handle the error
  ansible.builtin.debug:
    msg: "Service doesn't exist, this is normal"
  when: result.rc != 0
```

## Conclusion

Ansible has transformed how I manage Windows environments. The declarative approach and idempotence enable consistent and reproducible infrastructures.

## Resources

- [Ansible Windows Documentation](https://docs.ansible.com/ansible/latest/os_guide/windows.html)
- [Ansible Galaxy - Windows Collections](https://galaxy.ansible.com/)

---

*Ansible and Windows, a winning duo when you master both worlds!* 🦖
