FROM mcr.microsoft.com/dotnet/sdk:5.0 AS builder
WORKDIR /sources

COPY *.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish --output /app/ --configuration Release

FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=builder /app .

CMD ["dotnet", "Echo.dll"]