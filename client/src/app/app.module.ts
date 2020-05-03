import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app.component";
import { CanvasComponent } from "./components/canvas/canvas.component";
import { StreamService } from "./services/stream.service";

@NgModule({
  declarations: [AppComponent, CanvasComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [StreamService],
  bootstrap: [AppComponent],
})
export class AppModule {}
