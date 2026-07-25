ROOT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
BACKEND_DIR := $(ROOT_DIR)/backend

.PHONY: help dev dev-frontend dev-backend install install-frontend install-backend \
       build build-frontend build-backend \
       db-generate db-migrate db-migrate-create db-migrate-status db-push db-studio db-reset \
       docker-build docker-run stop kill-port lint lint-frontend lint-backend \
       typecheck typecheck-frontend typecheck-backend \
       deploy deploy-ensure deploy-vars deploy-up

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'

# ── Install ──────────────────────────────────────────────────

install: install-frontend install-backend ## Install all dependencies

install-frontend: ## Install frontend dependencies
	cd $(ROOT_DIR) && npm install

install-backend: ## Install backend dependencies
	cd $(BACKEND_DIR) && npm install

# ── Development ──────────────────────────────────────────────

dev: stop ## Start backend then frontend (both in background)
	@echo "Starting backend (port 3001)..."
	@cd $(BACKEND_DIR) && npm run dev &
	@sleep 2
	@echo "Starting frontend (port 5173)..."
	@cd $(ROOT_DIR) && npm run dev &
	@sleep 2
	@echo ""
	@echo "✓ Backend:  http://localhost:3001"
	@echo "✓ Frontend: http://localhost:5173"
	@echo ""
	@echo "Run 'make stop' to stop both."
	@wait

dev-frontend: ## Start frontend dev server (port 5173)
	cd $(ROOT_DIR) && npm run dev

dev-backend: kill-port ## Start backend dev server (port 3001)
	cd $(BACKEND_DIR) && npm run dev

# ── Build ────────────────────────────────────────────────────

build: build-frontend build-backend ## Build both frontend and backend

build-frontend: ## Build frontend for production
	cd $(ROOT_DIR) && npm run build

build-backend: ## Build backend TypeScript
	cd $(BACKEND_DIR) && npm run build

# ── Database ─────────────────────────────────────────────────

db-generate: ## Generate Prisma client
	cd $(BACKEND_DIR) && npx prisma generate

db-migrate: ## Create and apply migration (optional NAME=xxx)
	cd $(BACKEND_DIR) && npx prisma migrate dev $(if $(NAME),--name $(NAME),)

db-migrate-create: ## Create migration without applying (requires NAME=xxx)
	cd $(BACKEND_DIR) && npx prisma migrate dev --create-only --name $(NAME)

db-migrate-status: ## Check migration status (pending/applied)
	cd $(BACKEND_DIR) && npx prisma migrate status

db-push: ## Push schema to DB without migration file
	cd $(BACKEND_DIR) && npx prisma db push

db-studio: ## Open Prisma Studio
	cd $(BACKEND_DIR) && npx prisma studio

db-reset: ## Reset database (WARNING: destroys all data)
	cd $(BACKEND_DIR) && npx prisma migrate reset

# ── Type Checking ────────────────────────────────────────────

typecheck: typecheck-frontend typecheck-backend ## Type-check both

typecheck-frontend: ## Type-check frontend
	cd $(ROOT_DIR) && npx tsc --noEmit --project tsconfig.app.json

typecheck-backend: ## Type-check backend
	cd $(BACKEND_DIR) && npx tsc --noEmit

# ── Lint ─────────────────────────────────────────────────────

lint: lint-frontend ## Lint all

lint-frontend: ## Lint frontend
	cd $(ROOT_DIR) && npm run lint

# ── Docker ───────────────────────────────────────────────────

docker-build: ## Build Docker image
	cd $(ROOT_DIR) && docker build -t petos .

docker-run: ## Run Docker container locally
	cd $(ROOT_DIR) && docker run -p 3001:3001 --env-file backend/.env -e NODE_ENV=production petos

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

deploy: deploy-ensure deploy-vars deploy-up ## Full Railway deploy (ensure service + push vars + deploy)

deploy-ensure: ## Ensure Railway project and service exist (idempotent)
	@if ! railway status >/dev/null 2>&1; then \
		echo "No Railway project linked. Creating..."; \
		railway init; \
	fi
	@if railway service list 2>&1 | grep -q "No services"; then \
		echo "No service found. Creating..."; \
		railway add --name PetOS; \
		railway service link PetOS; \
	else \
		echo "Railway service already exists."; \
	fi

deploy-vars: ## Push backend/.env vars to Railway
	@echo "Pushing environment variables to Railway..."
	railway variables set $$(cat $(BACKEND_DIR)/.env | grep -v '^#' | grep -v '^$$' | tr '\n' ' ')
	railway variables set NODE_ENV=production
	@echo "Done. Verify with: railway variables"

deploy-up: ## Deploy to Railway
	@echo "Deploying to Railway..."
	railway up
	@echo "Deploy triggered. Check status with: railway status"
