---
title: "PowerShell: Best Practices After 25 Years in IT"
date: 2025-11-27
draft: false
tags: ["PowerShell", "Windows", "Automation", "Best Practices"]
categories: ["PowerShell"]
author: "iT-REXpert"
description: "Discover PowerShell best practices accumulated after 25 years of Windows administration experience"
---

## Introduction

After 25 years administering Windows environments, I've seen PowerShell evolve from a "nice to have" tool to the cornerstone of all modern Windows automation. Here are my essential recommendations.

## 1. Always Use Approved Cmdlets

```powershell
# ❌ Avoid
Get-ChildItem | ? {$_.Length -gt 1MB}

# ✅ Recommended
Get-ChildItem | Where-Object {$_.Length -gt 1MB}
```

Aliases are convenient in command line, but in scripts, always use full names for readability.

## 2. Handle Errors Correctly

```powershell
try {
    Get-ADUser -Identity "user" -ErrorAction Stop
    Write-Host "User found"
}
catch [Microsoft.ActiveDirectory.Management.ADIdentityNotFoundException] {
    Write-Warning "User does not exist"
}
catch {
    Write-Error "Unexpected error: $($_.Exception.Message)"
}
```

## 3. Robust Function Parameters

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
            # Your code here
        }
    }
}
```

## 4. Documentation with Comment-Based Help

```powershell
<#
.SYNOPSIS
    Retrieves system information from a server

.DESCRIPTION
    This function collects different types of system
    information from one or more remote servers.

.PARAMETER ComputerName
    Name(s) of server(s) to query

.EXAMPLE
    Get-ServerInfo -ComputerName "SRV01" -InfoType OS

.NOTES
    Author: iT-REXpert
    Version: 1.0
#>
```

## 5. Use Pester for Testing

```powershell
Describe "Get-ServerInfo Tests" {
    It "Returns an object for a valid server" {
        $result = Get-ServerInfo -ComputerName "localhost"
        $result | Should -Not -BeNullOrEmpty
    }

    It "Throws an error for a non-existent server" {
        { Get-ServerInfo -ComputerName "NONEXISTENT_SERVER" -ErrorAction Stop } |
            Should -Throw
    }
}
```

## 6. Structured Logging

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

These practices have allowed me to maintain robust and maintainable scripts for years. The initial investment in rigor translates into considerable time savings in the long run.

## Resources

- [PowerShell Best Practices](https://docs.microsoft.com/powershell)
- [The PowerShell Best Practices and Style Guide](https://github.com/PoshCode/PowerShellPracticeAndStyle)

---

*Have other best practices to share? Feel free to contact me!* 🦖
