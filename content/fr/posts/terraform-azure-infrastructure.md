---
title: "Terraform sur Azure : Infrastructure as Code pour Windows Server"
date: 2025-11-25
draft: false
tags: ["Terraform", "Azure", "Infrastructure as Code", "Windows Server"]
categories: ["Terraform"]
author: "iT-REXpert"
description: "Provisionner une infrastructure Windows sur Azure avec Terraform - Retour d'expérience"
---

## Introduction

Après avoir provisionné manuellement des centaines de serveurs au fil des années, Terraform a révolutionné ma façon de travailler. Voici comment je déploie maintenant des infrastructures Windows sur Azure.

## Structure du projet Terraform

```
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── providers.tf
└── modules/
    ├── network/
    ├── vm-windows/
    └── security/
```

## Configuration du provider Azure

```hcl
# providers.tf
terraform {
  required_version = ">= 1.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfstatestorage"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}

provider "azurerm" {
  features {
    virtual_machine {
      delete_os_disk_on_deletion = true
    }
  }
}
```

## Variables de configuration

```hcl
# variables.tf
variable "environment" {
  description = "Environnement (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "location" {
  description = "Région Azure"
  type        = string
  default     = "West Europe"
}

variable "vm_size" {
  description = "Taille des VMs"
  type        = string
  default     = "Standard_D2s_v3"
}

variable "admin_username" {
  description = "Nom de l'administrateur"
  type        = string
  sensitive   = true
}

variable "admin_password" {
  description = "Mot de passe administrateur"
  type        = string
  sensitive   = true
}

variable "vm_count" {
  description = "Nombre de VMs à créer"
  type        = number
  default     = 2
}
```

## Création du réseau virtuel

```hcl
# main.tf - Network
resource "azurerm_resource_group" "main" {
  name     = "rg-${var.environment}-windows"
  location = var.location

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
    Owner       = "iT-REXpert"
  }
}

resource "azurerm_virtual_network" "main" {
  name                = "vnet-${var.environment}"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tags = azurerm_resource_group.main.tags
}

resource "azurerm_subnet" "internal" {
  name                 = "subnet-internal"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}
```

## Network Security Group

```hcl
resource "azurerm_network_security_group" "main" {
  name                = "nsg-${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  security_rule {
    name                       = "AllowRDP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3389"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowWinRM"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_ranges    = ["5985", "5986"]
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "*"
  }

  tags = azurerm_resource_group.main.tags
}
```

## Déploiement de VMs Windows Server

```hcl
resource "azurerm_network_interface" "main" {
  count               = var.vm_count
  name                = "nic-${var.environment}-${count.index + 1}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.internal.id
    private_ip_address_allocation = "Dynamic"
  }

  tags = azurerm_resource_group.main.tags
}

resource "azurerm_network_interface_security_group_association" "main" {
  count                     = var.vm_count
  network_interface_id      = azurerm_network_interface.main[count.index].id
  network_security_group_id = azurerm_network_security_group.main.id
}

resource "azurerm_windows_virtual_machine" "main" {
  count               = var.vm_count
  name                = "vm-${var.environment}-${count.index + 1}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  size                = var.vm_size
  admin_username      = var.admin_username
  admin_password      = var.admin_password

  network_interface_ids = [
    azurerm_network_interface.main[count.index].id,
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
    disk_size_gb         = 128
  }

  source_image_reference {
    publisher = "MicrosoftWindowsServer"
    offer     = "WindowsServer"
    sku       = "2022-Datacenter"
    version   = "latest"
  }

  tags = merge(
    azurerm_resource_group.main.tags,
    {
      Name = "vm-${var.environment}-${count.index + 1}"
    }
  )
}
```

## Extension de configuration personnalisée

```hcl
resource "azurerm_virtual_machine_extension" "custom_script" {
  count                = var.vm_count
  name                 = "CustomScriptExtension"
  virtual_machine_id   = azurerm_windows_virtual_machine.main[count.index].id
  publisher            = "Microsoft.Compute"
  type                 = "CustomScriptExtension"
  type_handler_version = "1.10"

  settings = <<SETTINGS
    {
        "commandToExecute": "powershell.exe -ExecutionPolicy Unrestricted -File ConfigureServer.ps1"
    }
SETTINGS

  protected_settings = <<PROTECTED_SETTINGS
    {
        "storageAccountName": "${azurerm_storage_account.scripts.name}",
        "storageAccountKey": "${azurerm_storage_account.scripts.primary_access_key}"
    }
PROTECTED_SETTINGS
}
```

## Configuration WinRM automatique

```hcl
resource "azurerm_virtual_machine_extension" "winrm" {
  count                = var.vm_count
  name                 = "EnableWinRM"
  virtual_machine_id   = azurerm_windows_virtual_machine.main[count.index].id
  publisher            = "Microsoft.Compute"
  type                 = "CustomScriptExtension"
  type_handler_version = "1.10"

  settings = <<SETTINGS
    {
        "commandToExecute": "powershell.exe -ExecutionPolicy Unrestricted -Command \"& {Enable-PSRemoting -Force; Set-NetFirewallRule -Name WINRM-HTTP-In-TCP -RemoteAddress Any; winrm set winrm/config/service/auth '@{Basic=\\\"true\\\"}'; winrm set winrm/config/service '@{AllowUnencrypted=\\\"true\\\"}'}\""
    }
SETTINGS
}
```

## Outputs utiles

```hcl
# outputs.tf
output "vm_private_ips" {
  description = "Adresses IP privées des VMs"
  value       = azurerm_network_interface.main[*].private_ip_address
}

output "vm_names" {
  description = "Noms des VMs créées"
  value       = azurerm_windows_virtual_machine.main[*].name
}

output "resource_group_name" {
  description = "Nom du groupe de ressources"
  value       = azurerm_resource_group.main.name
}
```

## Utilisation en pratique

```bash
# Initialiser Terraform
terraform init

# Valider la configuration
terraform validate

# Planifier les changements
terraform plan -var-file="prod.tfvars"

# Appliquer les changements
terraform apply -var-file="prod.tfvars"

# Détruire l'infrastructure (attention !)
terraform destroy -var-file="prod.tfvars"
```

## Fichier de variables (prod.tfvars)

```hcl
environment     = "prod"
location        = "West Europe"
vm_size         = "Standard_D2s_v3"
vm_count        = 3
admin_username  = "adminuser"
# Ne jamais commiter le mot de passe !
# Utiliser une variable d'environnement : export TF_VAR_admin_password="..."
```

## Bonnes pratiques du vétéran

### 1. État distant sécurisé

Toujours utiliser un backend distant pour l'état Terraform :

```bash
# Créer le storage account pour l'état
az group create --name terraform-state-rg --location westeurope
az storage account create --name tfstatestorage --resource-group terraform-state-rg --location westeurope --sku Standard_LRS
az storage container create --name tfstate --account-name tfstatestorage
```

### 2. Modules réutilisables

```hcl
# modules/windows-vm/main.tf
module "web_servers" {
  source = "./modules/windows-vm"

  vm_count        = 2
  vm_name_prefix  = "web"
  environment     = var.environment
  subnet_id       = azurerm_subnet.internal.id
  resource_group  = azurerm_resource_group.main
}
```

### 3. Tagging systématique

Tous mes resources ont des tags cohérents pour la gestion des coûts et l'organisation.

### 4. Validation avec tflint

```bash
# Installer tflint
brew install tflint

# Analyser le code
tflint
```

## Conclusion

Terraform a transformé ma façon de provisionner des infrastructures. Ce qui prenait des heures manuellement se fait maintenant en minutes, de façon reproductible et versionnée.

## Ressources

- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Architecture Center](https://docs.microsoft.com/azure/architecture/)

---

*Infrastructure as Code : parce que cliquer dans un portail, c'est tellement 2010 !* 🦖
