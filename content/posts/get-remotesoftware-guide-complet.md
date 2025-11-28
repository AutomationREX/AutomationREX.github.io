---
title: "Get-RemoteSoftware : Inventorier les logiciels installés en masse"
date: 2025-11-28T10:30:00+01:00
draft: false
tags: ["PowerShell", "Inventaire", "Registry", "Automatisation", "PSPowerAdminTasks"]
categories: ["PowerShell", "Gestion Parc Informatique"]
author: "iT-REXpert"
showToc: true
TocOpen: true
description: "Guide complet pour créer un inventaire logiciels complet avec Get-RemoteSoftware - Fast, safe, efficient"
---

# Get-RemoteS​oftware : Inventorier les logiciels installés en masse

## Introduction

Avez-vous déjà eu besoin de créer un **inventaire complet** de tous les logiciels installés sur 100+ serveurs ? C'est une tâche courante en IT (conformité, audit, planification de mises à jour) mais traditionnellement très pénible.

**Get-RemoteSoftware** automatise cette collecte à grande échelle : rapide, fiable, et compatible avec toutes les versions Windows Server.

## Pourquoi cette fonction ?

### Les défis de l'inventaire logiciels

#### ❌ Problème 1 : Les outils WMI sont lents

```powershell
# ❌ LENT : Utiliser Win32_Product
Get-WmiObject Win32_Product -ComputerName "SERVER01"

# Peut prendre 10-30 minutes PER SERVER !
# Pourquoi ? Win32_Product fait une réparation Windows Installer
```

#### ❌ Problème 2 : Manquer des logiciels 64-bit

```powershell
# ❌ INCOMPLET : Juste regarder HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall
# Oublie les applications 32-bit sur systèmes 64-bit !
# (elles sont dans Wow6432Node)
```

#### ❌ Problème 3 : Parsing compliqué

```powershell
# ❌ MANUEL : Parser la Registry brute
$path = "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"
# Devoir mapper les noms de propriétés Registry => propriétés "lisibles"
# Devoir nettoyer les GUIDs incompréhensibles
```

### ✅ La solution : Get-RemoteSoftware

En une ligne :

```powershell
Get-RemoteSoftware -ComputerName "SERVER01"
```

Elle gère automatiquement :
- ✅ **Récupération rapide** via Registry (pas WMI)
- ✅ **Détection 64+32 bit** (HKLM et Wow6432Node)
- ✅ **Parsing intelligent** des noms et versions
- ✅ **Filtrage automatique** des mises à jour KB
- ✅ **Compatible** Windows Server 2008 → 2022

## Performance : Les chiffres

| Méthode | Temps pour 100 serveurs |
|---------|-------------------------|
| WMI (Win32_Product) | **4-5 heures** 😱 |
| Registry direkte (manuel) | **20-30 minutes** |
| **Get-RemoteSoftware** | **3-5 minutes** 🚀 |

## Cas d'usage pratiques

### 1. Inventaire simple d'un serveur

```powershell
# Liste tous les logiciels
Get-RemoteSoftware -ComputerName "SERVER01"

# Résultat :
# ComputerName  : SERVER01
# DisplayName   : Microsoft Visual C++ 2019
# Version       : 14.28.29913.0
# Publisher     : Microsoft Corporation
# InstallDate   : 20220315
#
# ComputerName  : SERVER01
# DisplayName   : 7-Zip 21.02
# Version       : 21.02
# Publisher     : Igor Pavlov
# InstallDate   : 20220101
```

### 2. Rechercher les installations d'une application spécifique

```powershell
# Trouver tous les serveurs avec Java installé
$servers = Get-ADComputer -Filter "OperatingSystem -like '*Server*'" |
    Select-Object -ExpandProperty Name

$servers | Get-RemoteSoftware |
    Where-Object { $_.DisplayName -like "*Java*" } |
    Select-Object ComputerName, DisplayName, Version |
    Format-Table -AutoSize
```

**Cas d'usage :** Vérifier que Java est à jour sur tous les serveurs d'application.

### 3. Audit de conformité logiciels

```powershell
# Lister les logiciels interdits
$bannedSoftware = "CCleaner", "TeamViewer", "7-Zip Free"

$servers | Get-RemoteSoftware |
    Where-Object { $_.DisplayName -in $bannedSoftware } |
    Select-Object ComputerName, DisplayName |
    Export-Csv "C:\Audit\forbidden-software.csv"
```

**Cas d'usage :** Vérifier que les logiciels "non autorisés" ne sont pas installés.

### 4. Déterminer les versions logiciels installées

```powershell
# Retrouver les serveurs avec SQL Server 2012 (obsolète)
$servers | Get-RemoteSoftware |
    Where-Object { $_.DisplayName -like "*SQL Server*2012*" } |
    Select-Object ComputerName, DisplayName, Version |
    Format-Table -AutoSize
```

**Cas d'usage :** Planifier les mises à jour (ex : SQL Server 2012 EoL).

### 5. Export pour conformité/audit

```powershell
# Créer un inventaire CSV complet
$timestamp = Get-Date -Format "yyyy-MM-dd"
$outputPath = "C:\Inventories\$timestamp-software-inventory.csv"

$servers | Get-RemoteSoftware |
    Select-Object ComputerName, DisplayName, Version, Publisher, InstallDate |
    Sort-Object ComputerName, DisplayName |
    Export-Csv $outputPath -NoTypeInformation

Write-Host "Inventaire exporté vers : $outputPath"
```

**Cas d'usage :** Rapport d'audit mensuel des installations logiciels.

### 6. Avec credentials alternates

```powershell
# Si vous n'êtes pas administrateur local
$cred = Get-Credential "DOMAIN\ServiceAccount"

Get-RemoteSoftware -ComputerName "RESTRICTED-SERVER" -Credential $cred
```

**Cas d'usage :** Accéder à un serveur d'un autre domaine.

### 7. Comptage : Combien de versions de .NET ?

```powersharp
# Analyser les versions .NET Framework installées
$servers | Get-RemoteSoftware |
    Where-Object { $_.DisplayName -like "*.NET*" } |
    Group-Object Version |
    Sort-Object Count -Descending |
    Format-Table Name, Count
```

**Résultat :**
```
Name                Count
----                -----
4.8                   45
4.7.2                 28
3.5                   12
```

## Filtrage avancé

### Trouver les logiciels avec patterns spécifiques

```powershell
# Toutes les versions de Microsoft Office
Get-RemoteSoftware -ComputerName $servers |
    Where-Object { $_.DisplayName -match "Microsoft Office|Microsoft 365|Office \d+" }

# Tous les antivirus et outils de sécurité
Get-RemoteSoftware -ComputerName $servers |
    Where-Object { $_.DisplayName -match "Antivirus|Norton|McAfee|Kaspersky|Defender" }

# Tous les navigateurs
Get-RemoteSoftware -ComputerName $servers |
    Where-Object { $_.DisplayName -match "Chrome|Firefox|Edge|Safari" }
```

### Trouver les versions "vieilles"

```powershell
# Applications dont l'installation date de plus de 2 ans
$threshold = (Get-Date).AddYears(-2).ToString("yyyyMMdd")

Get-RemoteSoftware -ComputerName $servers |
    Where-Object { [int]$_.InstallDate -lt [int]$threshold } |
    Select-Object ComputerName, DisplayName, InstallDate |
    Sort-Object InstallDate |
    Format-Table -AutoSize
```

## Cas d'usage avancés

### 1. Dashboard de conformité logiciels

```powershell
# Créer un résumé pour chaque serveur
$summary = @()

foreach ($server in $servers) {
    $software = Get-RemoteSoftware -ComputerName $server -ErrorAction SilentlyContinue

    $summary += [PSCustomObject]@{
        ComputerName = $server
        TotalApplications = @($software).Count
        HasJava = [bool]($software | Where-Object { $_.DisplayName -like "*Java*" })
        Has7Zip = [bool]($software | Where-Object { $_.DisplayName -like "*7-Zip*" })
        HasVisualStudio = [bool]($software | Where-Object { $_.DisplayName -like "*Visual Studio*" })
    }
}

$summary | Format-Table -AutoSize
```

### 2. Créer un inventaire Excel avec Pivot Table

```powershell
# Si vous avez ImportExcel module
$data = $servers | Get-RemoteSoftware

$data |
    Sort-Object ComputerName, DisplayName |
    Export-Excel "C:\Inventories\software-inventory.xlsx" `
        -TableName "SoftwareInventory" `
        -AutoFilter `
        -ConditionalText $(@{
            Range = "B:B"
            ConditionalType = 'UniqueValues'
        })
```

### 3. Notifier des installations suspectes

```powershell
# Configuration : logiciels à surveiller
$suspiciousSoftware = @{
    "CCleaner" = "Non autorisé"
    "TeamViewer" = "Potentiel accès non autorisé"
    "VNC" = "Accès à distance non approuvé"
}

foreach ($server in $servers) {
    $installed = Get-RemoteSoftware -ComputerName $server -ErrorAction SilentlyContinue

    foreach ($suspicious in $suspiciousSoftware.Keys) {
        if ($installed | Where-Object { $_.DisplayName -like "*$suspicious*" }) {
            Write-Warning "$server : $suspicious détecté - $(​$suspiciousSoftware[$suspicious])"
            # Envoyer une alerte...
        }
    }
}
```

### 4. Rapport comparatif : avant/après mise à jour

```powershell
# Sauvegarder l'inventaire avant
$before = Get-RemoteSoftware -ComputerName $servers
$before | Export-Csv "C:\Before.csv" -NoTypeInformation

# Effectuer une mise à jour...

# Comparer après
$after = Get-RemoteSoftware -ComputerName $servers

# Nouveau logiciels
$after | Where-Object { $_ -notin $before }

# Logiciels supprimés
$before | Where-Object { $_ -notin $after }
```

## Gestion des erreurs

### Erreur : « Access denied »

```powershell
# Vérifier les credentials
Test-Path \\$computer\c$

# Ajouter le compte au groupe local "Administrators"
# OU utiliser des credentials alternates
```

### Erreur : « Cannot find path »

```powershell
# Le serveur n'est pas accessible
Test-Connection -ComputerName $server
Test-WSMan -ComputerName $server
```

## Performance et optimisation

### Traiter plusieurs serveurs en parallèle

```powershell
# PowerShell 7+ : utiliser ForEach-Object -Parallel
$servers | ForEach-Object -Parallel {
    Get-RemoteSoftware -ComputerName $_
} -ThrottleLimit 10

# PowerShell 5.1 : utiliser runspaces ou Invoke-Command
Invoke-Command -ComputerName $servers -ScriptBlock {
    Get-RemoteSoftware
}
```

### Limiter le nombre de résultats

```powershell
# Ne récupérer que les applications principales
Get-RemoteSoftware -ComputerName "SERVER01" |
    Where-Object { $_.DisplayName -notmatch "KB\d+|Update|Patch" } |
    Measure-Object

# Réduit de 200+ à ~50 applications
```

## Intégration avec l'écosystème

### Avec Active Directory

```powershell
# Interroger tous les serveurs du domaine
Get-ADComputer -Filter "OperatingSystem -like '*Server*'" |
    Select-Object -ExpandProperty Name |
    Get-RemoteSoftware |
    Export-Csv "C:\Audit\complete-inventory.csv"
```

### Avec SCCM/ConfigMgr

```powershell
# Comparer avec SCCM pour validité des données
$sccmSoftware = Get-CMDevice -DeviceName "SERVER01" |
    Get-CMRegistryDeploymentType

$localSoftware = Get-RemoteSoftware -ComputerName "SERVER01"

# Trouver les divergences...
```

### Avec ServiceNow CMDB

```powershell
# Synchroniser vers CMDB
Get-RemoteSoftware -ComputerName $servers |
    Select-Object @{
        Name = 'cmdb_ci_server'
        Expression = { $_.ComputerName }
    }, @{
        Name = 'software_name'
        Expression = { $_.DisplayName }
    }, @{
        Name = 'software_version'
        Expression = { $_.Version }
    } |
    Export-Csv "C:\ServiceNow\sync.csv"
```

## Avantages clés

| Avantage | Bénéfice |
|----------|----------|
| **Rapidité** | 3-5 min pour 100 serveurs |
| **Fiabilité** | Registry vs WMI = pas de timeouts |
| **Complétude** | 32-bit ET 64-bit |
| **Compatible** | Windows Server 2008 → 2022 |
| **Scalable** | PowerShell Remoting = peut monter en charge |
| **Auditable** | Export CSV/Excel pour traçabilité |

## Conclusion

**Get-RemoteSoftware** est indispensable pour :

- 📊 **Créer** un inventaire complet du parc
- ✅ **Vérifier** la conformité logiciels
- 🔍 **Détecter** les logiciels non autorisés
- 🚀 **Planifier** les mises à jour
- 📋 **Auditer** l'infrastructure logicielle
- 🔐 **Identifier** les logiciels obsolètes

Elle transforme une tâche réclamant des **heures de travail manuel** en une **requête automatisée de quelques minutes**.

---

## Pour démarrer

```powershell
Get-Help Get-RemoteSoftware -Full

# Votre premier inventaire
Get-RemoteSoftware -ComputerName "SERVER01" | Format-Table
```

Découvrez le projet : [PSPowerAdminTasks](https://github.com/AutomationREX/PSPowerAdminTasks)
