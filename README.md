# Echo

TODO: write proper readme...

## Running Docker compose locally

- Build Docker container: `docker build --build-arg REACT_APP_PROTOCOL="http" --build-arg REACT_APP_ORIGIN="localhost" --build-arg REACT_APP_PORT="8080" -t ryanachten/echo-app .`

- Run Docker container: `docker run -p 8080:80 ryanachten/echo-app`
