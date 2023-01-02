
up:
	docker compose up -d

dev.start:
	docker compose up redis -d

server:
	cd ./server
	go run main.go

web:
	cd ./web
	npm run dev