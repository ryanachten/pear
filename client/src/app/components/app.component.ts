import { Component } from "@angular/core";
import { SignalService } from "../services/signal.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(private signal: SignalService) {}
}
