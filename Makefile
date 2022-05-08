
dev.start:
	docker compose up -d

server:
	cd ./server
	go run main.go

web:
	cd ./web
	npm run dev