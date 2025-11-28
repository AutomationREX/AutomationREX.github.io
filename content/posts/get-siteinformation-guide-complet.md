---
title: "Get-SiteInformation : Auditer votre topologie Active Directory Sites and Services"
date: 2025-11-28T10:45:00+01:00
draft: false
tags: ["PowerShell", "Active Directory", "Topologie", "Audit", "PSPowerAdminTasks"]
categories: ["PowerShell", "Active Directory"]
author: "iT-REXpert"
showToc: true
TocOpen: true
description: "Guide complet pour analyser et auditer la topologie AD Sites avec Get-SiteInformation"
---

# Get-SiteInformation : Auditer votre topologie Active Directory Sites and Services

## Introduction

La **topologie Active Directory Sites and Services** est le fondement de la réplication AD, du routage des authentifications, et de la performance globale. Pourtant, peu d'administrateurs ont une vision claire de cette topologie.

Questions courantes :
- ❓ Combien de sites avons-nous exactement ?
- ❓ Quels sont les sous-réseaux attribués à chaque site ?
- ❓ Comment sont configurés les liens entre sites ?
- ❓ Quand cette topologie a-t-elle été modifiée pour la dernière fois ?

**Get-SiteInformation** répond à toutes ces questions en une requête PowerShell simple.

## Pourquoi cette fonction ?

### Le défi traditionnel

Examiner la topologie AD sans cette fonction :

```powershell
# ❌ MANUEL : Ouvrir ADSI Edit
# 1. Connecter à Active Directory Sites and Services
# 2. Naviguer : CN=Sites,CN=Configuration,DC=...
# 3. Consulter manuellement chaque site
# 4. Vérifier les subnets
# 5. Parser les DNs incompréhensibles
# 6. Recréer les liens entre sites...

# Très fastidieux, facile d'oublier des détails
```

### La solution : Get-SiteInformation

En une ligne :

```powershell
Get-SiteInformation
```

Vous obtenez :
- ✅ **Tous les sites** avec leurs détails
- ✅ **Subnets associés** lisibilité garantie
- ✅ **Liens inter-sites** et coûts
- ✅ **Métadonnées** (création, modification)
- ✅ **Objets SITE** structurés et exploitables

## Cas d'usage pratiques

### 1. Voir tous les sites du domaine

```powershell
# Liste complète
Get-SiteInformation

# Résultat :
# Name: Default-First-Site-Name
# Description: First site created by the system
# Location: Headquarters
# Subnets: 192.168.1.0/24, 10.0.0.0/8
# SiteLinks: DEFAULTIPSITELINK
# Created: 2020-01-15
# Modified: 2025-11-20
#
# Name: Site-Paris
# Description: Paris office
# Location: Paris, France
# Subnets: 172.16.0.0/24, 172.17.0.0/24
# SiteLinks: Europe-Link, Paris-Link
# Created: 2021-06-10
# Modified: 2025-10-15
```

### 2. Rechercher un site spécifique

```powershell
# Recherche exacte
Get-SiteInformation -Name "Site-Paris"

# Recherche avec wildcard
Get-SiteInformation -Name "Site-*"
```

**Cas d'usage :** Vérifier la configuration d'un site avant d'y ajouter des ressources.

### 3. Auditer les subnets par site

```powershell
# Voir les subnets de chaque site
Get-SiteInformation |
    Select-Object Name, Location, @{
        Name = 'SubnetCount'
        Expression = { @($_.Subnets).Count }
    }, Subnets |
    Format-Table -AutoSize
```

**Résultat :**
```
Name                        Location        SubnetCount Subnets
----                        --------        ----------- -------
Default-First-Site-Name     Headquarters    2           {192.168.1.0/24, 10.0.0.0/8}
Site-Paris                  Paris, France   2           {172.16.0.0/24, 172.17.0.0/24}
Site-London                 London, UK      3           {10.128.0.0/24, 10.129.0.0/24, 10.130.0.0/24}
```

**Cas d'usage :** Audit des allocations réseau par site.

### 4. Identifier les sites sans subnets configurés

```powershell
# Sites orphelins (pas de subnets = pas de routing)
Get-SiteInformation |
    Where-Object { -not $_.Subnets -or @($_.Subnets).Count -eq 0 } |
    Select-Object Name, Description, Location

# ⚠️ ATTENTION : Les ordinateurs de ces sites doivent être dans
# le site "Default-First-Site-Name"
```

**Cas d'usage :** Identification des problèmes de topologie.

### 5. Analyser les liens inter-sites

```powershell
# Voir la structure des liens entre sites
Get-SiteInformation |
    Select-Object Name, @{
        Name = 'LinkCount'
        Expression = { @($_.SiteLinks).Count }
    }, SiteLinks |
    Format-Table -AutoSize
```

**Cas d'usage :** Vérifier que tous les sites sont connectés.

### 6. Audit de conformité : Vérifier les descriptions

```powershell
# Sites sans description (mauvaise documentation)
Get-SiteInformation |
    Where-Object { -not $_.Description } |
    Select-Object Name, Location

# Ces sites devraient être documentés
```

**Cas d'usage :** Assurer que la documentation est à jour.

### 7. Rapport de modification

```powershell
# Quand ont été modifiés les sites ?
Get-SiteInformation |
    Sort-Object Modified -Descending |
    Select-Object Name, Modified, Created |
    Format-Table -AutoSize
```

**Cas d'usage :** Vérifier les changements récents de topologie.

### 8. Avec un serveur Active Directory spécifique

```powershell
# Interroger un DC spécifique
Get-SiteInformation -Server "DC01.contoso.com"

# Cas d'usage : En cas de cache ou si les modifications
# ne sont pas encore répliquées
```

### 9. Avec credentials alternates

```powershell
# Utiliser d'autres credentials
$cred = Get-Credential "DOMAIN\Administrator"

Get-SiteInformation -Credential $cred
```

**Cas d'usage :** Interroger un domaine auquel vous n'êtes pas connecté.

## Structure des objets retournés

Chaque objet **SITE** contient :

```powershell
$site = Get-SiteInformation -Name "Site-Paris" | Select-Object -First 1

$site | Format-List

# Name               : Site-Paris
# Description        : Paris office
# Location           : Paris, France
# Subnets            : {172.16.0.0/24, 172.17.0.0/24}
# SiteLinks          : {Europe-Link, Paris-Link}
# Created            : 2021-06-10 14:32:00
# Modified           : 2025-11-20 09:15:00
# DistinguishedName  : CN=Site-Paris,CN=Sites,CN=Configuration,DC=contoso,DC=com
```

## Cas d'usage avancés

### 1. Cartographie de topologie AD

```powershell
# Créer une vue d'ensemble de la topologie
$sites = Get-SiteInformation

Write-Host "===== TOPOLOGIE ACTIVE DIRECTORY ====="
Write-Host "Nombre total de sites : $($sites.Count)"
Write-Host ""

foreach ($site in $sites | Sort-Object Name) {
    $subnetCount = @($site.Subnets).Count
    $linkCount = @($site.SiteLinks).Count

    Write-Host "📍 $($site.Name)"
    Write-Host "   📍 Localisation: $($site.Location)"
    Write-Host "   🌐 Subnets: $subnetCount"
    Write-Host "   🔗 Liens: $linkCount"
    Write-Host "   ⏰ Modifié: $($site.Modified.ToString('yyyy-MM-dd'))"
    Write-Host ""
}
```

### 2. Export pour documentation

```powershell
# Créer une documentation JSON de la topologie
$topology = Get-SiteInformation | ConvertTo-Json -Depth 10

$topology | Out-File "C:\Audit\ad-topology-$(Get-Date -Format 'yyyy-MM-dd').json"
```

### 3. Vérifier la couverture réseau

```powershell
# Lister tous les subnets configurés
$allSubnets = Get-SiteInformation |
    Select-Object -ExpandProperty Subnets -Unique |
    Sort-Object

Write-Host "Subnets configurés dans AD Sites:"
$allSubnets | ForEach-Object { Write-Host "  - $_" }

# Comparer avec votre inventaire réseau...
```

### 4. Déterminer le site d'un ordinateur

```powersharp
# Pour un ordinateur donné, quel site ?
# (combinaison manuelle avec vos données réseau)

$targetIP = "172.16.10.50"
$sites = Get-SiteInformation

foreach ($site in $sites) {
    foreach ($subnet in $site.Subnets) {
        # Vérifier si l'IP est dans ce subnet
        # (nécessite une fonction de validation CIDR)
        if (Test-SubnetContainsIP -Subnet $subnet -IP $targetIP) {
            Write-Host "L'IP $targetIP est dans le site $($site.Name)"
        }
    }
}
```

### 5. Audit de sites vides

```powershell
# Trouver les sites sans ressources
$sitesWithoutServers = Get-SiteInformation |
    Where-Object {
        # Vérifier s'il y a des serveurs AD dans ce site
        $servers = Get-ADComputer -Filter * -SearchScope Base |
            Where-Object { $_.SamAccountName -like "*$($_.Name)*" }

        -not $servers
    }

if ($sitesWithoutServers) {
    Write-Warning "Sites sans serveurs AD: $($sitesWithoutServers.Name)"
}
```

### 6. Comparer avec la réalité réseau

```powershell
# Valider que les subnets configurés existent réellement
$adSubnets = Get-SiteInformation | Select-Object -ExpandProperty Subnets

# Comparer avec votre inventaire réseau (ex: Cisco DNA, CheckPoint, etc)
# Identifier :
#  - Les subnets dans AD mais pas en production
#  - Les subnets en production mais pas dans AD
```

### 7. Générer un rapport HTML visuel

```powershell
# Créer un rapport HTML de la topologie (nécessite un template)
$sites = Get-SiteInformation

$html = @"
<html>
<head><title>Topologie AD</title></head>
<body>
<h1>Topologie Active Directory Sites and Services</h1>
<table border='1'>
<tr><th>Site</th><th>Localisation</th><th>Subnets</th><th>Liens</th></tr>
"@

foreach ($site in $sites) {
    $subnets = ($site.Subnets -join "<br>")
    $links = (@($site.SiteLinks) -join "<br>")

    $html += "<tr><td>$($site.Name)</td><td>$($site.Location)</td><td>$subnets</td><td>$links</td></tr>"
}

$html += "</table></body></html>"

$html | Out-File "C:\Reports\ad-topology.html"
```

### 8. Monitoring de changements de topologie

```powershell
# Créer une baseline
$baseline = Get-SiteInformation | Export-Csv "C:\Baseline-sites.csv" -Force

# Ultérieurement, comparer
$current = Get-SiteInformation | Export-Csv "C:\Current-sites.csv" -Force

# Comparer avec diff ou Compare-Object
Compare-Object (Import-Csv "C:\Baseline-sites.csv") (Import-Csv "C:\Current-sites.csv")

# Alerte si changements détectés
```

## Gestion des erreurs

### Erreur : « Access denied »

```powershell
# Vous n'avez pas accès à AD Sites
# Solution : utiliser un compte avec permissions

$cred = Get-Credential "DOMAIN\Administrator"
Get-SiteInformation -Credential $cred
```

### Erreur : « Cannot find domain »

```powershell
# Vous n'êtes pas connecté au domaine
# Solution : spécifier un serveur

Get-SiteInformation -Server "DC01.contoso.com"
```

## Intégration avec d'autres outils

### Avec Active Directory Users and Computers

```powershell
# Synchroniser les sites avec vos OU
$sites = Get-SiteInformation

# Vérifier que chaque site a une OU correspondante
foreach ($site in $sites) {
    $ou = Get-ADOrganizationalUnit -Filter "Name -eq '$($site.Name)'" -ErrorAction SilentlyContinue

    if (-not $ou) {
        Write-Warning "Site $($site.Name) n'a pas d'OU correspondante"
    }
}
```

### Avec Visio pour diagramme

```powershell
# Exporter les données pour créer un diagramme Visio
Get-SiteInformation |
    Select-Object Name, Location, @{
        Name = 'SubnetList'
        Expression = { $_.Subnets -join ',' }
    }, @{
        Name = 'LinkList'
        Expression = { $_.SiteLinks -join ',' }
    } |
    Export-Csv "C:\Visio\sites-data.csv"

# Importer dans Visio via Data > Import Data Wizard
```

### Avec Excel

```powershell
# Utiliser ImportExcel module
Get-SiteInformation |
    Export-Excel "C:\AD-Sites.xlsx" `
        -TableName "Sites" `
        -AutoFilter `
        -ConditionalFormat @{
            Range = "C:C"
            ConditionalType = 'CellValue'
            Operator = 'equal'
            Formula = 'Headquarters'
            BackgroundColor = '#90EE90'
        }
```

## Avantages clés

| Avantage | Bénéfice |
|----------|----------|
| **Clarté** | Vision d'ensemble immédiate de la topologie |
| **Audit** | Traçabilité des changements |
| **Documentation** | Maintenir un inventaire de la topologie |
| **Performance** | Identifier les problèmes de topologie |
| **Intégration** | Exporter vers outils tiers |
| **Conformité** | Vérifier que la topologie est conforme |

## Conclusion

**Get-SiteInformation** est indispensable pour :

- 📊 **Comprendre** votre topologie AD
- ✅ **Auditer** la conformité topologique
- 🔍 **Identifier** les problèmes de configuration
- 🚀 **Planifier** les extensions et modifications
- 📋 **Documenter** l'infrastructure AD
- 🔐 **Valider** que tout est correctement configuré

Elle transforme une **analyse manuelle complexe** en une **requête PowerShell simple**.

---

## Pour commencer

```powershell
# Voir tous les sites
Get-SiteInformation

# Filtrer sur un site
Get-SiteInformation -Name "Default-First-Site-Name"

# Obtenir l'aide complète
Get-Help Get-SiteInformation -Full
```

Découvrez le projet : [PSPowerAdminTasks](https://github.com/AutomationREX/PSPowerAdminTasks)
