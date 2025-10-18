#!/bin/bash

# Azure Deployment Script voor Keuzemodule (Zonder Docker)
# Voer dit script uit na het installeren van Azure CLI

echo "🚀 Starting Azure deployment (No Docker)..."

# Variabelen
RESOURCE_GROUP="keuzemodule-rg"
LOCATION="West Europe"
FRONTEND_APP_NAME="keuzemodule-frontend"
BACKEND_APP_NAME="keuzemodule-backend"
MONGODB_URI="your-mongodb-connection-string"

# 1. Login to Azure
echo "📝 Logging in to Azure..."
az login

# 2. Create Resource Group
echo "🏗️ Creating resource group..."
az group create \
  --name $RESOURCE_GROUP \
  --location "$LOCATION"

# 3. Create App Service Plan
echo "📋 Creating app service plan..."
az appservice plan create \
  --name keuzemodule-plan \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# 4. Create Frontend App Service
echo "🌐 Creating frontend app service..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan keuzemodule-plan \
  --name $FRONTEND_APP_NAME \
  --runtime "NODE:18-lts"

# 5. Create Backend App Service
echo "⚙️ Creating backend app service..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan keuzemodule-plan \
  --name $BACKEND_APP_NAME \
  --runtime "NODE:18-lts"

# 6. Configure App Settings
echo "⚙️ Configuring app settings..."

# Frontend settings
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $FRONTEND_APP_NAME \
  --settings \
    NODE_ENV=production \
    PORT=3000 \
    WEBSITE_NODE_DEFAULT_VERSION=18.17.0 \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Backend settings
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --settings \
    NODE_ENV=production \
    PORT=3000 \
    WEBSITE_NODE_DEFAULT_VERSION=18.17.0 \
    MONGODB_URI="$MONGODB_URI" \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true

# 7. Enable CORS for backend
echo "🔗 Configuring CORS..."
az webapp cors add \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --allowed-origins "https://$FRONTEND_APP_NAME.azurewebsites.net"

# 8. Configure deployment source
echo "📦 Configuring deployment source..."
az webapp deployment source config \
  --resource-group $RESOURCE_GROUP \
  --name $FRONTEND_APP_NAME \
  --repo-url "https://github.com/your-username/your-repo.git" \
  --branch main \
  --manual-integration

az webapp deployment source config \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --repo-url "https://github.com/your-username/your-repo.git" \
  --branch main \
  --manual-integration

echo "✅ Deployment completed!"
echo "🌐 Frontend URL: https://$FRONTEND_APP_NAME.azurewebsites.net"
echo "⚙️ Backend URL: https://$BACKEND_APP_NAME.azurewebsites.net"
echo ""
echo "📝 Next steps:"
echo "1. Update MONGODB_URI in Azure portal"
echo "2. Configure GitHub repository URL"
echo "3. Enable continuous deployment"
