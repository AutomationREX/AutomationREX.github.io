---
title: "PowerShell : Les bonnes pratiques après 25 ans d'IT"
date: 2025-11-27
draft: false
tags: ["PowerShell", "Windows", "Automatisation", "Bonnes pratiques"]
categories: ["PowerShell"]
author: "iT-REXpert"
description: "Découvrez les bonnes pratiques PowerShell accumulées après 25 ans d'expérience en administration Windows"
---

## Introduction

Après 25 ans à administrer des environnements Windows, j'ai vu PowerShell évoluer de l'outil "nice to have" à la pierre angulaire de toute automatisation Windows moderne. Voici mes recommandations essentielles.

## 1. Toujours utiliser les applets de commande approuvées

```powershell
# ❌ À éviter
Get-ChildItem | ? {$_.Length -gt 1MB}

# ✅ Recommandé
Get-ChildItem | Where-Object {$_.Length -gt 1MB}
```

Les alias sont pratiques en ligne de commande, mais dans les scripts, utilisez toujours les noms complets pour la lisibilité.

## 2. Gérer les erreurs correctement

```powershell
try {
    Get-ADUser -Identity "utilisateur" -ErrorAction Stop
    Write-Host "Utilisateur trouvé"
}
catch [Microsoft.ActiveDirectory.Management.ADIdentityNotFoundException] {
    Write-Warning "Utilisateur inexistant"
}
catch {
    Write-Error "Erreur inattendue : $($_.Exception.Message)"
}
```

## 3. Paramètres de fonction robustes

```powershell
function Get-ServerInfo {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true, ValueFromPipeline=$true)]
        [ValidateNotNullOrEmpty()]
        [string[]]$ComputerName,

        [Parameter(Mandatory=$false)]
        [ValidateSet('OS', 'Hardware', 'Network')]
        [string]$InfoType = 'OS'
    )

    process {
        foreach ($computer in $ComputerName) {
            # Votre code ici
        }
    }
}
```

## 4. Documentation avec Comment-Based Help

```powershell
<#
.SYNOPSIS
    Récupère les informations système d'un serveur

.DESCRIPTION
    Cette fonction permet de collecter différents types d'informations
    système depuis un ou plusieurs serveurs distants.

.PARAMETER ComputerName
    Nom(s) du/des serveur(s) à interroger

.EXAMPLE
    Get-ServerInfo -ComputerName "SRV01" -InfoType OS

.NOTES
    Auteur: iT-REXpert
    Version: 1.0
#>
```

## 5. Utiliser Pester pour les tests

```powershell
Describe "Get-ServerInfo Tests" {
    It "Retourne un objet pour un serveur valide" {
        $result = Get-ServerInfo -ComputerName "localhost"
        $result | Should -Not -BeNullOrEmpty
    }

    It "Lève une erreur pour un serveur inexistant" {
        { Get-ServerInfo -ComputerName "SERVEUR_INEXISTANT" -ErrorAction Stop } |
            Should -Throw
    }
}
```

## 6. Logging structuré

```powershell
function Write-Log {
    param(
        [string]$Message,
        [ValidateSet('INFO','WARNING','ERROR')]
        [string]$Level = 'INFO'
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"

    Add-Content -Path "C:\Logs\script.log" -Value $logMessage

    switch ($Level) {
        'WARNING' { Write-Warning $Message }
        'ERROR'   { Write-Error $Message }
        default   { Write-Host $Message }
    }
}
```

## Conclusion

Ces pratiques m'ont permis de maintenir des scripts robustes et maintenables pendant des années. L'investissement initial en rigueur se traduit par un gain de temps considérable à long terme.

## Ressources

- [PowerShell Best Practices](https://docs.microsoft.com/powershell)
- [The PowerShell Best Practices and Style Guide](https://github.com/PoshCode/PowerShellPracticeAndStyle)

---

*Vous avez d'autres bonnes pratiques à partager ? N'hésitez pas à me contacter !* 🦖
