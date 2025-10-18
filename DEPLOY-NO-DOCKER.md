# 🚀 Azure Deployment Zonder Docker

## Overzicht

Deze gids helpt je bij het deployen van je Nuxt.js applicatie op Azure **zonder Docker** - direct via Azure App Service.

## 📋 Vereisten

### 1. Azure CLI installeren

```bash
# Windows (PowerShell)
winget install Microsoft.AzureCLI

# macOS
brew install azure-cli

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### 2. GitHub Repository

- Je code moet in een GitHub repository staan
- Public of private repository (private vereist GitHub token)

## 🚀 Snelle Deployment

### Stap 1: Azure CLI Setup

```bash
# Login to Azure
az login

# Set subscription (optioneel)
az account set --subscription "your-subscription-id"
```

### Stap 2: Deployment Script Uitvoeren

```bash
# Maak script uitvoerbaar
chmod +x deploy-azure.sh

# Voer deployment uit
./deploy-azure.sh
```

### Stap 3: GitHub Repository Configureren

```bash
# Update repository URL in script
# Vervang "your-username/your-repo.git" met je echte repository
```

## 🏗️ Handmatige Deployment

### Stap 1: Resource Group

```bash
az group create \
  --name keuzemodule-rg \
  --location "West Europe"
```

### Stap 2: App Service Plan

```bash
az appservice plan create \
  --name keuzemodule-plan \
  --resource-group keuzemodule-rg \
  --sku B1 \
  --is-linux
```

### Stap 3: Frontend App Service

```bash
az webapp create \
  --resource-group keuzemodule-rg \
  --plan keuzemodule-plan \
  --name keuzemodule-frontend \
  --runtime "NODE:18-lts"
```

### Stap 4: Backend App Service

```bash
az webapp create \
  --resource-group keuzemodule-rg \
  --plan keuzemodule-plan \
  --name keuzemodule-backend \
  --runtime "NODE:18-lts"
```

### Stap 5: App Settings Configureren

```bash
# Frontend settings
az webapp config appsettings set \
  --resource-group keuzemodule-rg \
  --name keuzemodule-frontend \
  --settings \
    NODE_ENV=production \
    PORT=3000 \
    WEBSITE_NODE_DEFAULT_VERSION=18.17.0 \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Backend settings
az webapp config appsettings set \
  --resource-group keuzemodule-rg \
  --name keuzemodule-backend \
  --settings \
    NODE_ENV=production \
    PORT=3000 \
    WEBSITE_NODE_DEFAULT_VERSION=18.17.0 \
    MONGODB_URI="your-mongodb-connection-string" \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### Stap 6: CORS Configureren

```bash
az webapp cors add \
  --resource-group keuzemodule-rg \
  --name keuzemodule-backend \
  --allowed-origins "https://keuzemodule-frontend.azurewebsites.net"
```

### Stap 7: GitHub Deployment

```bash
# Frontend
az webapp deployment source config \
  --resource-group keuzemodule-rg \
  --name keuzemodule-frontend \
  --repo-url "https://github.com/your-username/your-repo.git" \
  --branch main

# Backend
az webapp deployment source config \
  --resource-group keuzemodule-rg \
  --name keuzemodule-backend \
  --repo-url "https://github.com/your-username/your-repo.git" \
  --branch main
```

## 🗄️ Database Setup

### MongoDB Atlas (Aanbevolen)

1. Ga naar [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Maak een gratis account aan
3. Maak een cluster aan (M0 - gratis tier)
4. Kopieer de connection string
5. Update `MONGODB_URI` in Azure portal

### Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/keuzemodule?retryWrites=true&w=majority
```

## ⚙️ Environment Variables

### Azure Portal Configuratie

1. Ga naar Azure Portal
2. Selecteer je App Service
3. Ga naar "Configuration" → "Application settings"
4. Voeg toe:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `WEBSITE_NODE_DEFAULT_VERSION`: `18.17.0`
   - `MONGODB_URI`: `your-connection-string` (alleen backend)

## 🔄 Continuous Deployment

### GitHub Actions (Aanbevolen)

1. Maak `.github/workflows/deploy.yml`
2. Configureer Azure credentials
3. Automatische deployment bij push

### Azure DevOps

1. Maak Azure DevOps project
2. Importeer `azure-deploy.yml`
3. Configureer service connections
4. Run pipeline

## 📊 Monitoring

### Application Insights

```bash
# Application Insights maken
az monitor app-insights component create \
  --app keuzemodule-insights \
  --location "West Europe" \
  --resource-group keuzemodule-rg
```

### Logs Bekijken

```bash
# Frontend logs
az webapp log tail \
  --resource-group keuzemodule-rg \
  --name keuzemodule-frontend

# Backend logs
az webapp log tail \
  --resource-group keuzemodule-rg \
  --name keuzemodule-backend
```

## 🔒 Security

### HTTPS Only

```bash
# HTTPS redirect
az webapp config set \
  --resource-group keuzemodule-rg \
  --name keuzemodule-frontend \
  --https-only true
```

### CORS Security

- Alleen frontend domain toegestaan
- Geen wildcard origins
- Credentials niet toegestaan

## 💰 Kosten

### App Service B1 Plan

- **Frontend**: ~€10/maand
- **Backend**: ~€10/maand
- **Totaal**: ~€20/maand

### Gratis Opties

- **MongoDB Atlas**: M0 tier (gratis)
- **Application Insights**: 5GB/maand gratis
- **Azure Functions**: 1M requests/maand gratis

## 🚨 Troubleshooting

### Veelvoorkomende Problemen

1. **Build Errors**

   ```bash
   # Check Node.js versie
   az webapp config show --resource-group keuzemodule-rg --name keuzemodule-frontend
   ```

2. **Database Connection**

   ```bash
   # Check app settings
   az webapp config appsettings list --resource-group keuzemodule-rg --name keuzemodule-backend
   ```

3. **CORS Issues**
   ```bash
   # Check CORS settings
   az webapp cors show --resource-group keuzemodule-rg --name keuzemodule-backend
   ```

### Debug Commands

```bash
# App status
az webapp show --resource-group keuzemodule-rg --name keuzemodule-frontend

# Restart app
az webapp restart --resource-group keuzemodule-rg --name keuzemodule-frontend

# Check deployment status
az webapp deployment list --resource-group keuzemodule-rg --name keuzemodule-frontend
```

## 🎯 Next Steps

1. **Test je applicatie** op de Azure URLs
2. **Configureer custom domain** (optioneel)
3. **Setup monitoring** met Application Insights
4. **Implementeer CI/CD** met GitHub Actions
5. **Configureer backup** voor database

## 📞 Support

- [Azure Documentation](https://docs.microsoft.com/azure/)
- [App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Nuxt.js Deployment](https://nuxt.com/docs/getting-started/deployment)
