---
title: "25 ans d'évolution : Du batch au DevOps"
date: 2025-11-24
draft: false
tags: ["DevOps", "Carrière", "Évolution", "Retour d'expérience"]
categories: ["DevOps"]
author: "iT-REXpert"
description: "Comment j'ai vécu la transformation de l'IT en 25 ans : scripts batch, PowerShell, automation, et DevOps"
---

## Introduction

En 25 ans de carrière, j'ai vu l'IT se transformer radicalement. De l'administration manuelle aux pipelines CI/CD, voici mon parcours et les leçons apprises.

## Ère 1 : Les scripts batch (2000-2005)

### Mes outils de l'époque

```batch
@echo off
REM Script de sauvegarde - Version 2002
echo Démarrage de la sauvegarde...

xcopy C:\Data D:\Backup\%date:~-4,4%%date:~-7,2%%date:~-10,2% /E /I /Y

if errorlevel 1 (
    echo ERREUR lors de la sauvegarde
) else (
    echo Sauvegarde terminée avec succès
)
```

**Ce que j'ai appris** : L'importance de l'automatisation, même basique.

## Ère 2 : L'arrivée de PowerShell (2006-2010)

PowerShell a changé ma vie d'administrateur Windows.

```powershell
# Mon premier script PowerShell "sérieux" - circa 2007
$computers = Get-Content "C:\Scripts\servers.txt"

foreach ($computer in $computers) {
    $disk = Get-WmiObject Win32_LogicalDisk -ComputerName $computer -Filter "DeviceID='C:'"
    $percentFree = ($disk.FreeSpace / $disk.Size) * 100

    if ($percentFree -lt 10) {
        Send-MailMessage -To "admin@domain.com" `
                         -Subject "ALERTE: Espace disque faible sur $computer" `
                         -Body "Seulement $([math]::Round($percentFree,2))% d'espace libre"
    }
}
```

**Ce que j'ai appris** : PowerShell n'est pas juste un langage de script, c'est une philosophie.

## Ère 3 : Virtualisation et Cloud (2011-2015)

Hyper-V, VMware, puis Azure ont révolutionné notre approche.

```powershell
# Script de provisioning Hyper-V - 2012
$vmName = "SRV-APP-01"
$vhdPath = "D:\VMs\$vmName\$vmName.vhdx"

New-VM -Name $vmName `
       -MemoryStartupBytes 4GB `
       -Generation 2 `
       -NewVHDPath $vhdPath `
       -NewVHDSizeBytes 60GB

Set-VMMemory $vmName -DynamicMemoryEnabled $true -MinimumBytes 2GB -MaximumBytes 8GB
Start-VM $vmName
```

**Ce que j'ai appris** : L'infrastructure devient du code.

## Ère 4 : Configuration Management (2016-2019)

Ansible, DSC, et la gestion de configuration à grande échelle.

```yaml
# Mon premier playbook Ansible pour Windows - 2017
---
- name: Configuration standard des serveurs
  hosts: windows_servers

  tasks:
    - name: Désactiver IPv6
      ansible.windows.win_regedit:
        path: HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip6\Parameters
        name: DisabledComponents
        data: 0xFF
        type: dword

    - name: Configurer le fuseau horaire
      community.windows.win_timezone:
        timezone: Romance Standard Time

    - name: Installer les rôles Windows
      ansible.windows.win_feature:
        name:
          - Web-Server
          - NET-Framework-45-Core
        state: present
```

**Ce que j'ai appris** : L'idempotence est la clé de la stabilité.

## Ère 5 : Infrastructure as Code (2020-2023)

Terraform et la reproductibilité totale.

```hcl
# Infrastructure complète en code - 2021
resource "azurerm_resource_group" "main" {
  name     = "rg-production"
  location = "West Europe"
}

module "network" {
  source              = "./modules/network"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
}

module "vm_cluster" {
  source    = "./modules/vm-windows"
  vm_count  = 5
  subnet_id = module.network.subnet_id
}
```

**Ce que j'ai appris** : L'infrastructure doit être versionnée comme le code.

## Ère 6 : DevOps et CI/CD (2024-2025)

Aujourd'hui, tout est automatisé, testé, et déployé en continu.

```yaml
# Pipeline Azure DevOps - 2025
trigger:
  - main

stages:
  - stage: Build
    jobs:
      - job: BuildScripts
        steps:
          - task: PowerShell@2
            inputs:
              targetType: 'inline'
              script: |
                Install-Module -Name Pester -Force
                Invoke-Pester -Path ./tests -OutputFile test-results.xml

  - stage: Deploy
    dependsOn: Build
    jobs:
      - job: DeployToProduction
        steps:
          - task: PowerShell@2
            inputs:
              filePath: './deploy.ps1'
              arguments: '-Environment Production'
```

**Ce que j'ai appris** : Le déploiement manuel est une erreur.

## Les grandes leçons de 25 ans

### 1. L'automatisation est non-négociable

```powershell
# Mauvais : faire manuellement
# Bon : automatiser dès la deuxième fois

function Deploy-Application {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Environment
    )

    # Tests préalables
    Test-Prerequisites

    # Déploiement
    Invoke-Deployment -Environment $Environment

    # Validation
    Test-Deployment -Environment $Environment
}
```

### 2. La documentation est aussi importante que le code

Chaque script doit répondre à :
- **Quoi** : Que fait ce script ?
- **Pourquoi** : Pourquoi existe-t-il ?
- **Comment** : Comment l'utiliser ?
- **Qui** : Qui contacter en cas de problème ?

### 3. Les tests évitent les catastrophes

```powershell
Describe "Deployment Tests" {
    It "Le service est démarré" {
        $service = Get-Service -Name "MyApp"
        $service.Status | Should -Be 'Running'
    }

    It "Le site web répond" {
        $response = Invoke-WebRequest -Uri "http://localhost"
        $response.StatusCode | Should -Be 200
    }
}
```

### 4. La sécurité doit être intégrée

```powershell
# Ne jamais faire ça
$password = "P@ssw0rd123"

# Toujours faire ça
$securePassword = Read-Host "Mot de passe" -AsSecureString
$credential = New-Object System.Management.Automation.PSCredential($username, $securePassword)
```

### 5. Le monitoring n'est pas optionnel

```powershell
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = 'INFO'
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"

    # Log local
    Add-Content -Path $logFile -Value $logEntry

    # Log centralisé
    Send-LogToSplunk -Message $logEntry -Level $Level
}
```

## Ma stack DevOps actuelle (2025)

| Domaine | Outils |
|---------|--------|
| **Version Control** | Git, GitHub |
| **CI/CD** | Azure DevOps, GitHub Actions |
| **IaC** | Terraform, ARM Templates |
| **Configuration** | Ansible, PowerShell DSC |
| **Containers** | Docker, Kubernetes |
| **Monitoring** | Azure Monitor, Grafana |
| **Secrets** | Azure Key Vault, HashiCorp Vault |
| **Tests** | Pester, Terraform validate |

## Conseils aux jeunes administrateurs

### 1. Apprenez les fondamentaux

Comprendre TCP/IP, DNS, Active Directory reste essentiel. Les outils changent, les concepts restent.

### 2. Codez tout

Si vous le faites plus d'une fois, automatisez-le.

### 3. Versionnez tout

Git n'est pas que pour les développeurs. Vos scripts, configs, et docs doivent être versionnés.

### 4. Testez avant de déployer

```bash
# Toujours tester dans un environnement non-prod
terraform plan -var-file="staging.tfvars"
terraform apply -var-file="staging.tfvars"

# Valider
./run-tests.sh

# Puis seulement en production
terraform apply -var-file="production.tfvars"
```

### 5. Restez curieux

La technologie évolue. Il y a 25 ans, je n'aurais jamais imaginé gérer des infrastructures avec du code. Restez ouverts aux nouveaux paradigmes.

## L'évolution continue

Aujourd'hui, je m'intéresse à :
- **GitOps** : Gestion d'infrastructure via Git
- **Policy as Code** : Azure Policy, OPA
- **FinOps** : Optimisation des coûts cloud
- **AI Ops** : Intelligence artificielle pour l'IT

## Conclusion

En 25 ans, je suis passé de scripts batch à des pipelines CI/CD complexes. Mais l'essence reste la même : **résoudre des problèmes de manière élégante et reproductible**.

Le "dino de l'IT" a survécu en s'adaptant continuellement. Et l'aventure continue !

## Ressources

- [The Phoenix Project](https://itrevolution.com/the-phoenix-project/) - Un must-read
- [Site Reliability Engineering](https://sre.google/books/) - Google SRE
- [The DevOps Handbook](https://itrevolution.com/the-devops-handbook/)

---

*"Dans l'IT, celui qui arrête d'apprendre arrête d'avancer"* 🦖

**Et vous, où en êtes-vous dans votre parcours DevOps ? Partagez votre expérience !**
