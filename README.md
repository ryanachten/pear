# Echo

# Requirements

- .NET CLI v5.0

## Running .NET and React locally

- Run while watching for client and API changes: `dotnet run watch`

## Running Docker container locally

- Build Docker container: `docker build -t ryanachten/echo-app .`
- Run Docker container: `docker run -p 8080:80 ryanachten/echo-app`
- App should then be accessible on http://localhost:8080
