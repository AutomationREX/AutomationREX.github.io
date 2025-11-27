---
title: "PowerShell : Gestion avancée des services Windows"
date: 2025-11-27T14:00:00+01:00
draft: false
tags: ["PowerShell", "Windows", "Automatisation", "Services"]
categories: ["PowerShell", "Windows Server"]
author: "iT-REXpert"
showToc: true
TocOpen: true
description: "Guide complet pour gérer les services Windows avec PowerShell : démarrage, arrêt, monitoring et automatisation"
cover:
    image: ""
    alt: "PowerShell Services"
    caption: "Gestion des services Windows avec PowerShell"
---

# Gestion avancée des services Windows avec PowerShell

La gestion des services Windows est une tâche quotidienne pour tout administrateur système. PowerShell offre des cmdlets puissantes pour automatiser ces opérations.

## Les bases : Get-Service

La cmdlet fondamentale pour interagir avec les services :

```powershell
# Lister tous les services
Get-Service

# Rechercher un service spécifique
Get-Service -Name "wuauserv"

# Services avec wildcard
Get-Service -Name "Win*"

# Filtrer par statut
Get-Service | Where-Object {$_.Status -eq 'Running'}
```

## Démarrer et arrêter des services

### Méthodes standard

```powershell
# Démarrer un service
Start-Service -Name "wuauserv"

# Arrêter un service
Stop-Service -Name "wuauserv"

# Redémarrer un service
Restart-Service -Name "wuauserv"

# Avec confirmation
Stop-Service -Name "wuauserv" -Confirm

# Sans confirmation (attention !)
Stop-Service -Name "wuauserv" -Force
```

### Gestion des dépendances

```powershell
# Voir les dépendances d'un service
Get-Service -Name "WinRM" | Select-Object -ExpandProperty DependentServices

# Voir les services dont il dépend
Get-Service -Name "WinRM" | Select-Object -ExpandProperty ServicesDependedOn

# Arrêter un service et ses dépendants
Stop-Service -Name "WinRM" -Force -Confirm:$false
```

## Modifier le type de démarrage

```powershell
# Définir en automatique
Set-Service -Name "wuauserv" -StartupType Automatic

# Désactiver un service
Set-Service -Name "wuauserv" -StartupType Disabled

# Manuel
Set-Service -Name "wuauserv" -StartupType Manual

# Automatique (démarrage différé)
Set-Service -Name "wuauserv" -StartupType AutomaticDelayedStart
```

## Scripts pratiques

### 1. Monitoring des services critiques

```powershell
function Test-CriticalServices {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string[]]$ServiceNames,

        [switch]$SendAlert
    )

    $stoppedServices = @()

    foreach ($serviceName in $ServiceNames) {
        $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue

        if (-not $service) {
            Write-Warning "Service '$serviceName' n'existe pas"
            continue
        }

        if ($service.Status -ne 'Running' -and $service.StartType -eq 'Automatic') {
            $stoppedServices += [PSCustomObject]@{
                Name        = $service.Name
                DisplayName = $service.DisplayName
                Status      = $service.Status
                StartType   = $service.StartType
            }

            Write-Warning "Service arrêté : $($service.DisplayName)"
        }
    }

    if ($stoppedServices.Count -gt 0) {
        $stoppedServices | Format-Table -AutoSize

        if ($SendAlert) {
            # Ici, vous pouvez ajouter votre logique d'alerte
            # Send-MailMessage, webhook, etc.
            Write-Host "Alerte envoyée !" -ForegroundColor Red
        }
    } else {
        Write-Host "Tous les services critiques sont opérationnels ✓" -ForegroundColor Green
    }
}

# Utilisation
$criticalServices = @('WinRM', 'W32Time', 'Dnscache')
Test-CriticalServices -ServiceNames $criticalServices
```

### 2. Redémarrage intelligent avec retry

```powershell
function Restart-ServiceWithRetry {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$ServiceName,

        [int]$MaxRetries = 3,
        [int]$RetryDelaySeconds = 5,
        [int]$TimeoutSeconds = 30
    )

    $service = Get-Service -Name $ServiceName -ErrorAction Stop

    Write-Host "Arrêt du service $($service.DisplayName)..." -ForegroundColor Yellow

    # Arrêt du service
    Stop-Service -Name $ServiceName -Force -ErrorAction Stop

    # Attendre l'arrêt complet
    $service.WaitForStatus('Stopped', [TimeSpan]::FromSeconds($TimeoutSeconds))

    Write-Host "Service arrêté. Démarrage..." -ForegroundColor Yellow

    # Tentatives de redémarrage
    $attempt = 0
    $started = $false

    while ($attempt -lt $MaxRetries -and -not $started) {
        $attempt++

        try {
            Start-Service -Name $ServiceName -ErrorAction Stop
            $service.WaitForStatus('Running', [TimeSpan]::FromSeconds($TimeoutSeconds))
            $started = $true
            Write-Host "Service redémarré avec succès ✓" -ForegroundColor Green
        }
        catch {
            Write-Warning "Tentative $attempt échouée : $_"

            if ($attempt -lt $MaxRetries) {
                Write-Host "Nouvelle tentative dans $RetryDelaySeconds secondes..."
                Start-Sleep -Seconds $RetryDelaySeconds
            }
        }
    }

    if (-not $started) {
        throw "Impossible de redémarrer le service après $MaxRetries tentatives"
    }
}

# Utilisation
Restart-ServiceWithRetry -ServiceName "wuauserv" -MaxRetries 3
```

### 3. Export de la configuration des services

```powershell
function Export-ServiceConfiguration {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$OutputPath,

        [string[]]$ServiceNames = @()
    )

    if ($ServiceNames.Count -eq 0) {
        $services = Get-Service
    } else {
        $services = Get-Service -Name $ServiceNames
    }

    $config = $services | Select-Object `
        Name,
        DisplayName,
        Status,
        StartType,
        @{Name='BinaryPath';Expression={(Get-WmiObject Win32_Service -Filter "Name='$($_.Name)'").PathName}}

    $config | Export-Csv -Path $OutputPath -NoTypeInformation -Encoding UTF8

    Write-Host "Configuration exportée vers : $OutputPath" -ForegroundColor Green
}

# Utilisation
Export-ServiceConfiguration -OutputPath "C:\Admin\services-backup.csv"
```

### 4. Comparer les configurations de services

```powershell
function Compare-ServiceConfiguration {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$ReferenceFile,

        [Parameter(Mandatory)]
        [string]$DifferenceFile
    )

    $ref = Import-Csv -Path $ReferenceFile
    $diff = Import-Csv -Path $DifferenceFile

    $comparison = Compare-Object -ReferenceObject $ref -DifferenceObject $diff `
        -Property Name, StartType, Status `
        -PassThru

    $comparison | Format-Table Name, StartType, Status, SideIndicator -AutoSize
}

# Utilisation
Compare-ServiceConfiguration `
    -ReferenceFile "C:\Admin\services-prod.csv" `
    -DifferenceFile "C:\Admin\services-dev.csv"
```

## Gestion à distance

```powershell
# Service sur un ordinateur distant
Get-Service -Name "wuauserv" -ComputerName "SERVER01"

# Avec Invoke-Command (préféré pour PSRemoting)
Invoke-Command -ComputerName "SERVER01" -ScriptBlock {
    Get-Service -Name "wuauserv"
}

# Sur plusieurs serveurs
$servers = @("SERVER01", "SERVER02", "SERVER03")

Invoke-Command -ComputerName $servers -ScriptBlock {
    Get-Service | Where-Object {
        $_.Status -eq 'Stopped' -and
        $_.StartType -eq 'Automatic'
    }
} | Select-Object PSComputerName, Name, DisplayName, Status
```

## Bonnes pratiques

### 1. Toujours vérifier avant d'agir

```powershell
$service = Get-Service -Name "wuauserv" -ErrorAction SilentlyContinue

if ($service) {
    if ($service.Status -eq 'Running') {
        Stop-Service -Name $service.Name
    }
} else {
    Write-Warning "Service non trouvé"
}
```

### 2. Utiliser les paramètres -WhatIf et -Confirm

```powershell
# Simulation
Stop-Service -Name "wuauserv" -WhatIf

# Demander confirmation
Stop-Service -Name "wuauserv" -Confirm
```

### 3. Logger les actions

```powershell
function Stop-ServiceWithLogging {
    param([string]$ServiceName)

    $logFile = "C:\Admin\Logs\service-operations.log"
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    try {
        Stop-Service -Name $ServiceName -ErrorAction Stop
        $message = "$timestamp - SUCCESS: Service $ServiceName arrêté"
        Add-Content -Path $logFile -Value $message
        Write-Host $message -ForegroundColor Green
    }
    catch {
        $message = "$timestamp - ERROR: Impossible d'arrêter $ServiceName - $_"
        Add-Content -Path $logFile -Value $message
        Write-Error $message
    }
}
```

## Conclusion

La gestion des services Windows avec PowerShell est un pilier de l'administration système. Ces cmdlets et scripts vous permettront :

- ✅ D'automatiser les tâches répétitives
- ✅ De monitorer les services critiques
- ✅ De gérer des flottes de serveurs
- ✅ De documenter et sauvegarder les configurations

Dans le prochain article, nous verrons comment créer des services Windows personnalisés avec PowerShell et NSSM !

---

*iT-REXpert - Le dino de l'IT* 🦖

**Tags:** `PowerShell` `Windows` `Automatisation` `Administration`
