FROM golang:1.19

WORKDIR /app

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY go.mod go.sum ./
RUN go mod download && go mod verify
RUN go install github.com/rubenv/sql-migrate/...@latest
COPY . .
RUN go build -o ../bin/app ./cmd
EXPOSE 8080
CMD ["../bin/app"]