---
title: "Get-RemoteRebootLog : Tracer l'historique des redémarrages serveurs"
date: 2025-11-28T10:15:00+01:00
draft: false
tags: ["PowerShell", "Event Log", "Monitoring", "Automatisation", "PSPowerAdminTasks"]
categories: ["PowerShell", "Administration Serveurs"]
author: "iT-REXpert"
showToc: true
TocOpen: true
description: "Guide complet pour auditer et analyser l'historique des redémarrages serveurs avec Get-RemoteRebootLog"
---

# Get-RemoteRebootLog : Tracer l'historique des redémarrages serveurs

## Introduction

Combien de fois vous-êtes demandé : **"Quand exactement ce serveur a-t-il redémarré ?"** ou **"Qui a déclenché ce redémarrage ?"**

Ces informations critiques pour l'audit et le troubleshooting sont dispersées dans les **Event Logs** Windows. La fonction **Get-RemoteRebootLog** centralise ces données et les présente de manière lisible et exploitable.

## Pourquoi cette fonction ?

### Le défi sans automatisation

Extraire l'historique des redémarrages sans cette fonction est laborieux :

```powershell
# Approche manuelle (complexe et lente)
Get-WinEvent -ComputerName "SERVER01" `
    -FilterHashtable @{
        LogName = 'System'
        ID = 1074, 6006, 6008
        StartTime = (Get-Date).AddDays(-30)
    } | Select-Object TimeCreated, Message

# Mais les messages ne sont pas structurés...
# Il faut parser manuellement pour extraire les détails
```

### La solution : Get-RemoteRebootLog

En une seule ligne :

```powershell
Get-RemoteRebootLog -ComputerName "SERVER01"
```

Vous obtenez :
- ✅ **Horodatage exact** de chaque redémarrage
- ✅ **Initiateur** (système, administrateur, mise à jour)
- ✅ **Raison** du redémarrage
- ✅ **Type d'événement** (planifié, forcé, crash)
- ✅ **Parsing automatique** des événements complexes

## Cas d'usage pratiques

### 1. Vérifier les redémarrages récents d'un serveur

```powershell
# Voir les 10 derniers redémarrages
Get-RemoteRebootLog -ComputerName "SERVER01" -MaxEvents 10
```

**Résultat :**
```
ComputerName: SERVER01
TimeCreated: 2025-11-27 14:32:00
InitiatedBy: System
Reason: Windows Update
Type: Planifié

ComputerName: SERVER01
TimeCreated: 2025-11-25 09:15:00
InitiatedBy: DOMAIN\Administrator
Reason: Maintenance
Type: Non-planifié
...
```

### 2. Audit des redémarrages sur la dernière semaine

```powershell
# Redémarrages depuis 7 jours
Get-RemoteRebootLog -ComputerName "SERVER01" `
    -StartTime (Get-Date).AddDays(-7) `
    -MaxEvents 50
```

**Cas d'usage :** Une application s'est plantée. Vous vérifiez si le serveur a redémarré inopinément.

### 3. Identifier les redémarrages forcés (crashs)

```powershell
# Récupérer les redémarrages des 30 derniers jours
Get-RemoteRebootLog -ComputerName "SERVER01" |
    Where-Object { $_.Type -eq "Crash" } |
    Select-Object TimeCreated, InitiatedBy, Reason
```

**Cas d'usage :** Diagnostic d'un serveur instable - identifier les redémarrages non planifiés.

### 4. Vérifier que les patches ont provoqué les redémarrages

```powershell
# Tous les redémarrages liés aux mises à jour
Get-RemoteRebootLog -ComputerName "SERVERS" |
    Where-Object { $_.Reason -like "*Update*" } |
    Format-Table -AutoSize
```

**Cas d'usage :** Patch Tuesday - vérifier que tous les serveurs ont bien redémarré après les mises à jour.

### 5. Audit multi-serveurs avec rapport

```powershell
# Analyser le parc serveur
$servers = Get-ADComputer -Filter "OperatingSystem -like '*Server 2022*'" |
    Select-Object -ExpandProperty Name

$servers | Get-RemoteRebootLog -MaxEvents 20 |
    Sort-Object TimeCreated -Descending |
    Export-Csv "C:\Audit\reboot-history.csv" -NoTypeInformation
```

**Cas d'usage :** Rapport mensuel d'audit des redémarrages sur l'infrastructure.

### 6. Surveillance continue avec alertes

```powershell
# Vérifier les redémarrages depuis la dernière exécution
$lastCheck = (Get-Date).AddHours(-24)

$servers = "APP-01", "APP-02", "DB-01"

foreach ($server in $servers) {
    $reboots = Get-RemoteRebootLog -ComputerName $server `
        -StartTime $lastCheck `
        -ErrorAction SilentlyContinue

    if ($reboots) {
        Write-Warning "$server a redémarré $(($reboots | Measure-Object).Count) fois"
        # Envoyer une alerte...
    }
}
```

**Cas d'usage :** Surveillance proactive - détecter les redémarrages anormaux.

### 7. Avec des credentials alternates

```powershell
# Se connecter avec un compte spécifique
$cred = Get-Credential "DOMAIN\ServiceAccount"

Get-RemoteRebootLog -ComputerName "LEGACY-SERVER" -Credential $cred
```

**Cas d'usage :** Serveur sur un domaine différent ou authentification spéciale nécessaire.

## Événements détectés

La fonction analyse automatiquement les événements de redémarrage :

| ID Event | Signification |
|----------|---------------|
| **1074** | Redémarrage/Arrêt initié par un utilisateur ou processus |
| **6006** | Arrêt correct du système |
| **6008** | Redémarrage inattendu (crash) ou perte d'alimentation |

Chaque événement est **parsé intelligemment** pour extraire les détails structurés.

## Structure des résultats

Chaque objet retourné contient :

```powershell
$result = Get-RemoteRebootLog -ComputerName "SERVER01" | Select-Object -First 1

$result | Format-List
# ComputerName: SERVER01
# TimeCreated: 2025-11-27 14:32:00
# InitiatedBy: DOMAIN\Administrator
# Reason: Maintenance scheduled
# Type: Planifié
# EventID: 1074
```

## Filtrages avancés

### Redémarrages non planifiés

```powershell
# Identifier les crashes ou redémarrages forcés
Get-RemoteRebootLog -ComputerName "SERVER01" |
    Where-Object { $_.Type -eq "Crash" -or $_.Type -eq "Forcé" }
```

### Redémarrages par initiateur

```powershell
# Redémarrages manuels par un administrateur
Get-RemoteRebootLog -ComputerName $servers |
    Where-Object { $_.InitiatedBy -like "*Administrator*" } |
    Group-Object InitiatedBy |
    Select-Object Name, Count
```

### Historique de redémarrages sur 90 jours

```powershell
# Audit trimestriel
$quarter = (Get-Date).AddDays(-90)

Get-RemoteRebootLog -ComputerName "CRITICAL-SERVER" `
    -StartTime $quarter `
    -MaxEvents 200 |
    Measure-Object

# Combien de fois le serveur a redémarré en 90 jours
```

## Gestion des erreurs

### Erreur : « Unable to reach SERVER01 »

```powershell
# Vérifier la connectivité réseau
Test-Connection -ComputerName "SERVER01"
```

### Erreur : « Access denied »

```powershell
# Les credentials n'ont pas accès aux Event Logs
# Solution : ajouter le compte au groupe local "Event Log Readers"

# Ou utiliser des credentials avec privilèges
$adminCred = Get-Credential "DOMAIN\Administrator"
Get-RemoteRebootLog -ComputerName "SERVER01" -Credential $adminCred
```

### Serveur sans événement sur la période

```powershell
# Pas de redémarrages, normal !
Get-RemoteRebootLog -ComputerName "STABLE-SERVER"
# (pas de résultat) = serveur stable depuis > 30 jours
```

## Cas d'usage avancés

### 1. Audit de conformité : Vérifier que les serveurs redémarrent régulièrement

Beaucoup de policies d'entreprise exigent un redémarrage mensuel :

```powershell
# Vérifier que chaque serveur a redémarré au moins une fois ce mois-ci
$month = (Get-Date -Day 1)

$servers = Get-ADComputer -Filter "OperatingSystem -like '*Server*'" |
    Select-Object -ExpandProperty Name

foreach ($server in $servers) {
    $reboots = Get-RemoteRebootLog -ComputerName $server `
        -StartTime $month `
        -ErrorAction SilentlyContinue

    if ($reboots) {
        Write-Host "✓ $server - Conforme ($(($reboots | Measure-Object).Count) redémarrages)"
    } else {
        Write-Warning "✗ $server - NON conforme (aucun redémarrage ce mois-ci)"
    }
}
```

### 2. Troubleshooting d'application : Corréler redémarrages et erreurs

```powershell
# Récupérer les redémarrages
$reboots = Get-RemoteRebootLog -ComputerName "APP-SERVER" -MaxEvents 30

# Vérifier si l'app s'est plantée après chaque redémarrage
foreach ($reboot in $reboots) {
    $errorLog = Get-WinEvent -FilterHashtable @{
        LogName = 'Application'
        StartTime = $reboot.TimeCreated
        EndTime = $reboot.TimeCreated.AddHours(2)
    } -ErrorAction SilentlyContinue

    if ($errorLog) {
        Write-Host "Erreurs 2h après redémarrage du $($reboot.TimeCreated)"
        $errorLog | Select-Object Message
    }
}
```

### 3. Rapport visuel avec statistiques

```powershell
# Analyser les patterns de redémarrages
$data = Get-RemoteRebootLog -ComputerName $servers -MaxEvents 100

# Redémarrages par jour de semaine
$data | Group-Object { $_.TimeCreated.DayOfWeek } |
    Sort-Object Name |
    Format-Table Name, Count

# Initiateurs de redémarrages
$data | Group-Object InitiatedBy |
    Sort-Object Count -Descending |
    Format-Table Name, Count
```

## Intégration avec d'autres outils

### Avec ServiceNow/ITSM

```powershell
# Exporter pour import dans ServiceNow
Get-RemoteRebootLog -ComputerName $servers |
    Select-Object @{
        Name = 'cmdb_ci_server'
        Expression = { $_.ComputerName }
    }, @{
        Name = 'u_reboot_time'
        Expression = { $_.TimeCreated }
    }, @{
        Name = 'u_initiated_by'
        Expression = { $_.InitiatedBy }
    }, @{
        Name = 'u_reason'
        Expression = { $_.Reason }
    } |
    Export-Csv "C:\ServiceNow\reboot-import.csv"
```

### Avec Splunk/ELK

```powershell
# Envoyer les logs dans Splunk
$logs = Get-RemoteRebootLog -ComputerName $servers

$logs | ForEach-Object {
    $json = $_ | ConvertTo-Json
    # Envoyer à l'endpoint Splunk HEC
    Invoke-RestMethod -Uri "https://splunk:8088/services/collector" `
        -Method Post `
        -Body $json `
        -Headers @{ Authorization = "Splunk $token" }
}
```

## Avantages clés

| Avantage | Bénéfice |
|----------|----------|
| **Rapidité** | Réponse en secondes au lieu de minutes |
| **Précision** | Parsing automatique des événements complexes |
| **Scalabilité** | Interroger 100+ serveurs facilement |
| **Audit** | Traçabilité complète des redémarrages |
| **Intégration** | Export CSV, JSON, intégration ITSM |

## Conclusion

**Get-RemoteRebootLog** est indispensable pour :

- 🔍 **Diagnostiquer** les problèmes de stabilité serveur
- 📊 **Auditer** la conformité des redémarrages
- 🚨 **Détecter** les redémarrages anormaux
- 📋 **Documenter** l'historique d'exploitation
- 🔐 **Tracer** qui a redémarré quoi et quand

Elle transforme une tâche complexe d'analyse Event Log en une simple requête PowerShell.

---

## Pour aller plus loin

```powershell
Get-Help Get-RemoteRebootLog -Full
```

Découvrez le projet : [PSPowerAdminTasks](https://github.com/AutomationREX/PSPowerAdminTasks)
