.PHONY: dev-down dev-build dev-up open

dev: dev-down dev-build dev-up 
testnet: testnet-down testnet-build testnet-up

# /***** SIMNET *****/
# Bring down the dev server.
dev-down:
	@echo "[Bringing down the dev sever....]"
	@docker-compose -f ./docker/docker-compose-simnet.yaml down --remove-orphans

# Build the dev server if any changes have occurred.
dev-build:
	@echo "[Building the dev server...]"
	@docker-compose -f ./docker/docker-compose-simnet.yaml build

# Run the dev server.
dev-up:
	@echo "[Running dev server...]"
	@docker-compose -f ./docker/docker-compose-simnet.yaml up -d

# /***** TESTNET *****/
# Bring down the testnet server.
testnet-down:
	@echo "[Bringing down the testnet sever....]"
	@docker-compose -f ./docker/docker-compose-testnet.yaml down --remove-orphans

# Build the testnet server if any changes have occurred.
testnet-build:
	@echo "[Building the testnet server...]"
	@docker-compose -f ./docker/docker-compose-testnet.yaml build

# Run the testnet server.
testnet-up:
	@echo "[Running testnet server...]"
	@docker-compose -f ./docker/docker-compose-testnet.yaml up -d

# Attach to the simnet container
attach-simnet:
	@docker exec -ti simnet /bin/bash
