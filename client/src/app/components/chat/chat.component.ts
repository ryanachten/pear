import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { RtcService } from "src/app/services/rtc.service";
import { User } from "src/app/models";
import { Subscription } from "rxjs";
import { StreamService } from "src/app/services/stream.service";
import { IStreamSubscriber, ISubscription } from "@microsoft/signalr";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit {
  @Output() userSelected = new EventEmitter<User>();

  public subscriptions = new Subscription();
  public currentUser: string;
  public dataString: string;
  public users: User[];

  constructor(private rtc: RtcService, private stream: StreamService) {}

  ngOnInit() {
    this.rtc.users.subscribe((users) => {
      this.users = users;
    });

    // Subscribe to all of the signal observables
    this.subscriptions.add(
      this.stream.newPeer$.subscribe({
        next: (user: User) => {
          this.rtc.newUser(user);
          this.stream.sayHello(this.currentUser, user.connectionId);
        },
        error: () => {},
        complete: () => {},
      })
    );
  }

  saveUsername() {}

  sendMessage() {}

  userClicked(user: User) {
    this.userSelected.emit(user);
  }
}
