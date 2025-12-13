# ================================
# Prisma - Database
# ================================

PRISMA_ENV = .env.local
name ?= init

# Créer et appliquer une migration
# Usage: make migrate name=ajout_user_age
migrate:
	npx dotenv -e $(PRISMA_ENV) -- prisma migrate dev --name "$(word 2,$(MAKECMDGOALS))"

# Réinitialiser complètement la base de données
# ⚠️ ATTENTION: Supprime toutes les données !
reset:
	npx dotenv -e $(PRISMA_ENV) -- prisma migrate reset --force

# Générer le client Prisma
# À utiliser après git pull ou modification du schema
generate:
	npx dotenv -e $(PRISMA_ENV) -- prisma generate

# Ouvrir Prisma Studio
studio:
	npx dotenv -e $(PRISMA_ENV) -- prisma studio

# Seed la base de données
seed:
	npx dotenv -e $(PRISMA_ENV) -- prisma db seed

# Push le schema sans créer de migration (dev rapide)
push:
	npx dotenv -e $(PRISMA_ENV) -- prisma db push

# ================================
# Next.js - Développement
# ================================

# Démarrer le serveur de développement
dev:
	npm run dev

# Build de production
build:
	npm run build

# Démarrer en production
start:
	npm run start

# Linter
lint:
	npm run lint

# ================================
# Installation & Nettoyage
# ================================

# Installer les dépendances
install:
	npm install

# Nettoyer le cache et rebuild
clean:
	rm -rf .next node_modules
	npm install
	$(MAKE) generate

# ================================
# Workflow complet
# ================================

# Setup complet du projet
setup:
	@echo "📦 Installation des dépendances..."
	@$(MAKE) install

	@echo "📋 Vérification du .env.local..."
	@if [ ! -f .env.local ]; then \
		echo "⚠️  Création du .env.local depuis .env.example..."; \
		cp .env.example .env.local; \
		echo "🔑 Générez une clé avec: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""; \
		echo "📝 Ajoutez-la dans NEXTAUTH_SECRET dans .env.local"; \
		echo "Puis relancez: make setup"; \
		exit 1; \
	fi

	@echo "✅ Génération du client Prisma..."
	@$(MAKE) generate

	@echo "🗄️  Migration de la base de données..."
	@$(MAKE) migrate

	@echo "🌱 Seed de la base..."
	@$(MAKE) seed

	@echo "✨ Setup terminé !"

# Redémarrage propre
restart: clean dev

# Lance les scripts
script:
	npx dotenv -e .env.local -- tsx _scripts/$(word 2,$(MAKECMDGOALS)).ts

%:
	@:

.PHONY: migrate reset generate studio seed push dev build start lint install clean setup restart
