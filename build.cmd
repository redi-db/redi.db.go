SET GOOS=windows
SET GOARCH=amd64
go build -ldflags="-s -w" -o bin/RediPast-64.exe main.go

SET GOOS=windows
SET GOARCH=386
go build -o bin/RediPast-32.exe main.go

SET GOOS=linux
SET GOARCH=amd64
go build -ldflags="-s -w" -o bin/RediPast-64 main.go

SET GOOS=linux
SET GOARCH=386
go build -ldflags="-s -w" -o bin/RediPast-32 main.go