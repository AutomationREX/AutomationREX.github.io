---
title: "25 Years of Evolution: From Batch to DevOps"
date: 2025-11-24
draft: false
tags: ["DevOps", "Career", "Evolution", "Experience Report"]
categories: ["DevOps"]
author: "iT-REXpert"
description: "How I experienced IT transformation over 25 years: batch scripts, PowerShell, automation, and DevOps"
---

## Introduction

In 25 years of career, I've seen IT transform radically. From manual administration to CI/CD pipelines, here's my journey and lessons learned.

## Era 1: Batch Scripts (2000-2005)

### My Tools Back Then

```batch
@echo off
REM Backup script - Version 2002
echo Starting backup...

xcopy C:\Data D:\Backup\%date:~-4,4%%date:~-7,2%%date:~-10,2% /E /I /Y

if errorlevel 1 (
    echo ERROR during backup
) else (
    echo Backup completed successfully
)
```

**What I learned**: The importance of automation, even basic.

## Era 2: The PowerShell Arrival (2006-2010)

PowerShell changed my life as a Windows administrator.

```powershell
# My first "serious" PowerShell script - circa 2007
$computers = Get-Content "C:\Scripts\servers.txt"

foreach ($computer in $computers) {
    $disk = Get-WmiObject Win32_LogicalDisk -ComputerName $computer -Filter "DeviceID='C:'"
    $percentFree = ($disk.FreeSpace / $disk.Size) * 100

    if ($percentFree -lt 10) {
        Send-MailMessage -To "admin@domain.com" `
                         -Subject "ALERT: Low disk space on $computer" `
                         -Body "Only $([math]::Round($percentFree,2))% free space"
    }
}
```

**What I learned**: PowerShell isn't just a scripting language, it's a philosophy.

## Era 3: Virtualization and Cloud (2011-2015)

Hyper-V, VMware, then Azure revolutionized our approach.

```powershell
# Hyper-V provisioning script - 2012
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

**What I learned**: Infrastructure becomes code.

## Era 4: Configuration Management (2016-2019)

Ansible, DSC, and large-scale configuration management.

```yaml
# My first Ansible playbook for Windows - 2017
---
- name: Standard server configuration
  hosts: windows_servers

  tasks:
    - name: Disable IPv6
      ansible.windows.win_regedit:
        path: HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip6\Parameters
        name: DisabledComponents
        data: 0xFF
        type: dword

    - name: Configure timezone
      community.windows.win_timezone:
        timezone: Romance Standard Time

    - name: Install Windows roles
      ansible.windows.win_feature:
        name:
          - Web-Server
          - NET-Framework-45-Core
        state: present
```

**What I learned**: Idempotence is the key to stability.

## Era 5: Infrastructure as Code (2020-2023)

Terraform and total reproducibility.

```hcl
# Complete infrastructure as code - 2021
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

**What I learned**: Infrastructure must be versioned like code.

## Era 6: DevOps and CI/CD (2024-2025)

Today, everything is automated, tested, and continuously deployed.

```yaml
# Azure DevOps Pipeline - 2025
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

**What I learned**: Manual deployment is a mistake.

## Great Lessons from 25 Years

### 1. Automation is Non-Negotiable

```powershell
# Bad: doing manually
# Good: automate from the second time

function Deploy-Application {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Environment
    )

    # Prerequisites tests
    Test-Prerequisites

    # Deployment
    Invoke-Deployment -Environment $Environment

    # Validation
    Test-Deployment -Environment $Environment
}
```

### 2. Documentation is as Important as Code

Each script must answer:
- **What**: What does this script do?
- **Why**: Why does it exist?
- **How**: How to use it?
- **Who**: Who to contact in case of problem?

### 3. Tests Prevent Disasters

```powershell
Describe "Deployment Tests" {
    It "Service is running" {
        $service = Get-Service -Name "MyApp"
        $service.Status | Should -Be 'Running'
    }

    It "Website responds" {
        $response = Invoke-WebRequest -Uri "http://localhost"
        $response.StatusCode | Should -Be 200
    }
}
```

### 4. Security Must Be Integrated

```powershell
# Never do this
$password = "P@ssw0rd123"

# Always do this
$securePassword = Read-Host "Password" -AsSecureString
$credential = New-Object System.Management.Automation.PSCredential($username, $securePassword)
```

### 5. Monitoring is Not Optional

```powershell
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = 'INFO'
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"

    # Local log
    Add-Content -Path $logFile -Value $logEntry

    # Centralized log
    Send-LogToSplunk -Message $logEntry -Level $Level
}
```

## My Current DevOps Stack (2025)

| Domain | Tools |
|---------|--------|
| **Version Control** | Git, GitHub |
| **CI/CD** | Azure DevOps, GitHub Actions |
| **IaC** | Terraform, ARM Templates |
| **Configuration** | Ansible, PowerShell DSC |
| **Containers** | Docker, Kubernetes |
| **Monitoring** | Azure Monitor, Grafana |
| **Secrets** | Azure Key Vault, HashiCorp Vault |
| **Tests** | Pester, Terraform validate |

## Advice for Young Administrators

### 1. Learn the Fundamentals

Understanding TCP/IP, DNS, Active Directory remains essential. Tools change, concepts remain.

### 2. Code Everything

If you do it more than once, automate it.

### 3. Version Everything

Git isn't just for developers. Your scripts, configs, and docs must be versioned.

### 4. Test Before Deploying

```bash
# Always test in non-prod environment
terraform plan -var-file="staging.tfvars"
terraform apply -var-file="staging.tfvars"

# Validate
./run-tests.sh

# Then only in production
terraform apply -var-file="production.tfvars"
```

### 5. Stay Curious

Technology evolves. 25 years ago, I would never have imagined managing infrastructures with code. Stay open to new paradigms.

## Continuous Evolution

Today, I'm interested in:
- **GitOps**: Infrastructure management via Git
- **Policy as Code**: Azure Policy, OPA
- **FinOps**: Cloud cost optimization
- **AI Ops**: Artificial intelligence for IT

## Conclusion

In 25 years, I've gone from batch scripts to complex CI/CD pipelines. But the essence remains the same: **solving problems elegantly and reproducibly**.

The "IT dinosaur" survived by continuously adapting. And the adventure continues!

## Resources

- [The Phoenix Project](https://itrevolution.com/the-phoenix-project/) - A must-read
- [Site Reliability Engineering](https://sre.google/books/) - Google SRE
- [The DevOps Handbook](https://itrevolution.com/the-devops-handbook/)

---

*"In IT, those who stop learning stop moving forward"* 🦖

**And you, where are you in your DevOps journey? Share your experience!**
