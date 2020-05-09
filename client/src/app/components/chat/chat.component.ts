import { Component, OnInit } from "@angular/core";
import { RtcService } from "src/app/services/rtc.service";
import { User } from "src/app/models";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit {
  public currentUser: string;
  public dataString: string;
  public users: User[];

  constructor(private rtc: RtcService) {}

  ngOnInit() {
    this.rtc.users.subscribe((users) => {
      this.users = users;
    });
  }

  saveUsername() {}

  sendMessage() {}
}
