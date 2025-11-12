# ================================
# Prisma - Database
# ================================

# Créer et appliquer une migration
# Usage: make migrate name=ajout_user_age
migrate:
	npx prisma migrate dev --name "${name}"

# Réinitialiser complètement la base de données
# ⚠️ ATTENTION: Supprime toutes les données !
reset:
	npx prisma migrate reset

# Générer le client Prisma
# À utiliser après git pull ou modification du schema
generate:
	npx prisma generate

# Ouvrir Prisma Studio
studio:
	npx prisma studio

# Seed la base de données
seed:
	npx prisma db seed

# Push le schema sans créer de migration (dev rapide)
push:
	npx prisma db push

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
	npx prisma generate

# ================================
# Workflow complet
# ================================

# Setup complet du projet
setup: install generate migrate seed

# Redémarrage propre
restart: clean dev

.PHONY: migrate reset generate studio seed push dev build start lint install clean setup restart