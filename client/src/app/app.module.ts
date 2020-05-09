import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app.component";
import { CanvasComponent } from "./components/canvas/canvas.component";
import { StreamService } from "./services/stream.service";
import { ChatComponent } from "./components/chat/chat.component";

@NgModule({
  declarations: [AppComponent, CanvasComponent, ChatComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [StreamService],
  bootstrap: [AppComponent],
})
export class AppModule {}
