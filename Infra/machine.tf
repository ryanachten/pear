resource "fly_machine" "echoMachine" {
  app    = fly_app.echo.name
  name   = fly_app.echo.name
  region = "sea" # Seattle region
  image  = "ryanachten/echo:latest"
  services = [
    {
      ports = [
        {
          port     = 443
          handlers = ["tls", "http"]
        },
        {
          port     = 80
          handlers = ["http"]
        }
      ]
      "protocol" : "tcp",
      "internal_port" : 80
    },
  ]
  cpus       = 1
  memorymb   = 256
  depends_on = [fly_app.echo]
}
