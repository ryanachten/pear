resource "fly_app" "echo" {
  name = "echo-video"
  org  = "personal"
}

resource "fly_ip" "echoIp" {
  app  = fly_app.echo.name
  type = "v4"
  depends_on = [
    fly_app.echo
  ]
}

resource "fly_ip" "echoIpV6" {
  app  = fly_app.echo.name
  type = "v6"
  depends_on = [
    fly_app.echo
  ]
}
