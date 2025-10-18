# 🚀 Azure App Service Setup voor Nuxt.js

## Probleem Opgelost

Je had een Azure Static Web Apps workflow, maar Nuxt.js is een full-stack framework dat Azure App Service nodig heeft, niet Static Web Apps.

## 📋 Vereisten

### 1. Azure App Service maken

```bash
# Resource group
az group create --name keuzemodule-rg --location "West Europe"

# App Service Plan
az appservice plan create \
  --name keuzemodule-plan \
  --resource-group keuzemodule-rg \
  --sku B1 \
  --is-linux

# Frontend App Service
az webapp create \
  --resource-group keuzemodule-rg \
  --plan keuzemodule-plan \
  --name keuzemodule-frontend \
  --runtime "NODE:18-lts"
```

### 2. App Settings configureren

```bash
az webapp config appsettings set \
  --resource-group keuzemodule-rg \
  --name keuzemodule-frontend \
  --settings \
    NODE_ENV=production \
    PORT=3000 \
    WEBSITE_NODE_DEFAULT_VERSION=18.17.0 \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    BACKEND_URL="https://apijobbahub.azurewebsites.net" \
    API_BASE_URL="https://apijobbahub.azurewebsites.net/api"
```

## 🔧 GitHub Secrets Configureren

### **Stap 1: Publish Profile downloaden**

1. Ga naar Azure Portal
2. Selecteer je App Service (keuzemodule-frontend)
3. Klik op "Get publish profile"
4. Download het bestand

### **Stap 2: GitHub Secrets toevoegen**

Ga naar GitHub repository → Settings → Secrets and variables → Actions

#### **AZURE_WEBAPP_PUBLISH_PROFILE**

- **Name**: `AZURE_WEBAPP_PUBLISH_PROFILE`
- **Secret**: [Inhoud van publish profile]

#### **AZURE_CREDENTIALS** (voor CORS)

- **Name**: `AZURE_CREDENTIALS`
- **Secret**:

```json
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "subscriptionId": "your-subscription-id",
  "tenantId": "your-tenant-id"
}
```

#### **AZURE_RESOURCE_GROUP**

- **Name**: `AZURE_RESOURCE_GROUP`
- **Secret**: `keuzemodule-rg`

## 🚀 Workflow Configuratie

### **`.github/workflows/azure-deploy.yml`**

```yaml
name: Build and Deploy to Azure App Service

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

env:
  AZURE_WEBAPP_NAME: "keuzemodule-frontend"
  NODE_VERSION: "18.x"

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    name: Build and Deploy Frontend
    environment: "production"

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: |
          npm install
          npm ci

      - name: Build application
        run: |
          npm run build
        env:
          BACKEND_URL: "https://apijobbahub.azurewebsites.net"
          API_BASE_URL: "https://apijobbahub.azurewebsites.net/api"

      - name: Create deployment package
        run: |
          zip -r app.zip .output -x "*.map"

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ env.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: app.zip

  configure-cors:
    runs-on: ubuntu-latest
    name: Configure CORS
    needs: build-and-deploy
    if: always()

    steps:
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Configure CORS for backend
        run: |
          az webapp cors add \
            --resource-group ${{ secrets.AZURE_RESOURCE_GROUP }} \
            --name apijobbahub \
            --allowed-origins "https://${{ env.AZURE_WEBAPP_NAME }}.azurewebsites.net"
```

## 🛠️ Setup Stappen

### **Stap 1: Verwijder Static Web Apps workflow**

```bash
# Verwijder de oude workflow
rm .github/workflows/azure-static-web-apps-polite-forest-0ffd14803.yml
```

### **Stap 2: Azure App Service maken**

```bash
# Resource group
az group create --name keuzemodule-rg --location "West Europe"

# App Service Plan
az appservice plan create \
  --name keuzemodule-plan \
  --resource-group keuzemodule-rg \
  --sku B1 \
  --is-linux

# Frontend App Service
az webapp create \
  --resource-group keuzemodule-rg \
  --plan keuzemodule-plan \
  --name keuzemodule-frontend \
  --runtime "NODE:18-lts"
```

### **Stap 3: App Settings configureren**

```bash
az webapp config appsettings set \
  --resource-group keuzemodule-rg \
  --name keuzemodule-frontend \
  --settings \
    NODE_ENV=production \
    PORT=3000 \
    WEBSITE_NODE_DEFAULT_VERSION=18.17.0 \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    BACKEND_URL="https://apijobbahub.azurewebsites.net" \
    API_BASE_URL="https://apijobbahub.azurewebsites.net/api"
```

### **Stap 4: GitHub Secrets toevoegen**

1. Ga naar GitHub repository → Settings → Secrets and variables → Actions
2. Voeg de secrets toe zoals hierboven beschreven

### **Stap 5: Workflow activeren**

1. Push code naar main branch
2. Ga naar "Actions" tab in GitHub
3. Controleer of workflow draait

## 🔍 Verschil tussen Static Web Apps en App Service

### **Azure Static Web Apps**

- ❌ Alleen voor statische websites
- ❌ Geen server-side rendering
- ❌ Geen API routes
- ❌ Geen database connecties

### **Azure App Service**

- ✅ Full-stack applicaties
- ✅ Server-side rendering (Nuxt.js)
- ✅ API routes
- ✅ Database connecties
- ✅ Environment variables

## 🚨 Troubleshooting

### **"Permission denied" Error**

Dit komt omdat Static Web Apps niet geschikt is voor Nuxt.js. Gebruik Azure App Service.

### **Build Errors**

```bash
# Test build lokaal
npm run build

# Controleer Node.js versie
node --version
```

### **Deployment Fails**

1. Controleer GitHub secrets
2. Controleer Azure App Service status
3. Bekijk GitHub Actions logs

## 📝 Checklist

- [ ] Oude Static Web Apps workflow verwijderd
- [ ] Azure App Service aangemaakt
- [ ] App settings geconfigureerd
- [ ] GitHub secrets toegevoegd
- [ ] Nieuwe workflow gecommit
- [ ] Eerste deployment getest
- [ ] CORS geconfigureerd

## 🎯 Next Steps

1. **Verwijder Static Web Apps** workflow
2. **Maak Azure App Service** aan
3. **Configureer GitHub secrets**
4. **Test deployment** door code te pushen
5. **Monitor logs** voor eventuele problemen
