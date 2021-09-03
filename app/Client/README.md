# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup HTTPS for local development

WebRTC requires HTTPS to work, therefore we need to setup SSL for local development.

Setting up on MacOS:

- brew install mkcert
- brew install nss
- mkcert -install

Inside client directory:

- mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem "localhost"

## Running Docker locally

- Build the image: `docker build -t ryanachten/echo-client .`
- Run the image: `docker run -p 8080:80 ryanachten/echo-client`
