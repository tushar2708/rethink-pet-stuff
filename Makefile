.PHONY: help dev dev-frontend dev-backend install install-frontend install-backend \
       build build-frontend build-backend \
       db-generate db-migrate db-migrate-create db-migrate-status db-push db-studio db-reset \
       docker-build docker-run stop kill-port lint lint-frontend lint-backend \
       typecheck typecheck-frontend typecheck-backend \
       deploy deploy-vars deploy-up

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'

# ── Install ──────────────────────────────────────────────────

install: install-frontend install-backend ## Install all dependencies

install-frontend: ## Install frontend dependencies
	cd /Users/tushar/Documents/RethinkSystem/PetStuff && npm install

install-backend: ## Install backend dependencies
	cd /Users/tushar/Documents/RethinkSystem/PetStuff/backend && npm install

# ── Development ──────────────────────────────────────────────

dev: stop ## Start backend then frontend (both in background)
	@echo "Starting backend (port 3001)..."
	@cd /Users/tushar/Documents/RethinkSystem/PetStuff/backend && npm run dev &
	@sleep 2
	@echo "Starting frontend (port 5173)..."
	@cd /Users/tushar/Documents/RethinkSystem/PetStuff && npm run dev &
	@sleep 2
	@echo ""
	@echo "✓ Backend:  http://localhost:3001"
	@echo "✓ Frontend: http://localhost:5173"
	@echo ""
	@echo "Run 'make stop' to stop both."
	@wait

dev-frontend: ## Start frontend dev server (port 5173)
	cd /Users/tushar/Documents/RethinkSystem/PetStuff && npm run dev

dev-backend: kill-port ## Start backend dev server (port 3001)
	cd /Users/tushar/Documents/RethinkSystem/PetStuff/backend && npm run dev

# ── Build ────────────────────────────────────────────────────

build: build-frontend build-backend ## Build both frontend and backend

build-frontend: ## Build frontend for production
	cd /Users/tushar/Documents/RethinkSystem/PetStuff && npm run build

build-backend: ## Build backend TypeScript
	cd /Users/tushar/Documents/RethinkSystem/PetStuff/backend && npm run build

# ── Database ─────────────────────────────────────────────────

db-generate: ## Generate Prisma client
	cd /Users/tushar/Documents/RethinkSystem/PetStuff/backend && npx prisma generate

db-migrate: ## Create and apply Prisma migration (dev)
	cd /Users/tushar/Documents/RethinkSystem/PetStuff/backend && npx prisma migrate dev

db-migrate-create: ## Create migration without applying (requires NAME=xxx)
	cd /Users/tushar/Documents/RethinkSystem/PetStuff/backend && npx prisma migrate dev --create-only --name $(NAME)

db-migrate-status: ## Check migration status (pending/applied)
	cd /Users/tushar/Documents/RethinkSystem/PetStuff/backend && npx prisma migrate status

db-push: ## Push schema to DB without migration file
	cd /Users/tushar/Documents/RethinkSystem/PetStuff/backend && npx prisma db push

db-studio: ## Open Prisma Studio
	cd /Users/tushar/Documents/RethinkSystem/PetStuff/backend && npx prisma studio

db-reset: ## Reset database (WARNING: destroys all data)
	cd /Users/tushar/Documents/RethinkSystem/PetStuff/backend && npx prisma migrate reset

# ── Type Checking ────────────────────────────────────────────

typecheck: typecheck-frontend typecheck-backend ## Type-check both

typecheck-frontend: ## Type-check frontend
	cd /Users/tushar/Documents/RethinkSystem/PetStuff && npx tsc --noEmit --project tsconfig.app.json

typecheck-backend: ## Type-check backend
	cd /Users/tushar/Documents/RethinkSystem/PetStuff/backend && npx tsc --noEmit

# ── Lint ─────────────────────────────────────────────────────

lint: lint-frontend ## Lint all

lint-frontend: ## Lint frontend
	cd /Users/tushar/Documents/RethinkSystem/PetStuff && npm run lint

# ── Docker ───────────────────────────────────────────────────

docker-build: ## Build Docker image
	cd /Users/tushar/Documents/RethinkSystem/PetStuff && docker build -t petstuff .

docker-run: ## Run Docker container locally
	cd /Users/tushar/Documents/RethinkSystem/PetStuff && docker run -p 3001:3001 --env-file backend/.env -e NODE_ENV=production petstuff

# ── Utilities ────────────────────────────────────────────────

stop: ## Stop backend (3001) then frontend (5173)
	@echo "Stopping backend (port 3001)..."
	@lsof -ti :3001 | xargs kill -9 2>/dev/null || true
	@echo "Stopping frontend (port 5173)..."
	@lsof -ti :5173 | xargs kill -9 2>/dev/null || true
	@echo "Done."

kill-port: ## Kill any process on port 3001
	@lsof -ti :3001 | xargs kill -9 2>/dev/null || true

# ── Railway Deployment ──────────────────────────────────────

deploy: deploy-up deploy-vars ## Full Railway deploy (deploy + push vars)

deploy-vars: ## Push backend/.env vars to Railway
	@echo "Pushing environment variables to Railway..."
	railway variables set $$(cat /Users/tushar/Documents/RethinkSystem/PetStuff/backend/.env | grep -v '^#' | grep -v '^$$' | tr '\n' ' ')
	railway variables set NODE_ENV=production
	@echo "Done. Verify with: railway variables"

deploy-up: ## Deploy to Railway
	@echo "Deploying to Railway..."
	railway up
	@echo "Deploy triggered. Check status with: railway status"
