import { Component, OnInit } from "@angular/core";
import { ServiceService } from "./service.service";
import { HttpErrorResponse } from "@angular/common/http";
import { StreamChat, Message, User } from "stream-chat";

// require("dotenv").config();

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  data: any;
  token: any;
  userName: string = "";
  API_KEY: any = "wf946y4ahq5j";
  message: string = "";
  newmessage: Message[] = [];
  channel: any;
  state: any;
  chat: any;
  loggedinUser: User;

  constructor(private httpService: ServiceService) {
    this.chat = new StreamChat(this.API_KEY);
  }
  title = "livesupport";

  ngOnInit() {
    if (localStorage.getItem("userToken") !== null) {
      this.token = JSON.parse(localStorage.getItem("userToken"));
    }
  }

  openForm() {
    if (localStorage.getItem("userToken") === null) {
      document.getElementById("myForm").style.display = "none";
      document.getElementById("signinForm").style.display = "block";
    } else {
      document.getElementById("myForm").style.display = "block";
      document.getElementById("signinForm").style.display = "none";
    }
  }

  closeForm() {
    document.getElementById("myForm").style.display = "none";
  }

  signUp() {
    this.data = { username: this.userName };
    this.httpService.userAuthentication(this.data).subscribe((data: any) => {
      if (data) {
        localStorage.setItem("userToken", JSON.stringify(data.token));
        this.chatSupport(this.API_KEY);
        this.openForm();
      }
    });
  }

  async chatSupport(key) {
    this.chat = new StreamChat(key);
    this.loggedinUser = await this.chat.setUser(
      {
        id: this.userName,
        name: this.userName
      },
      this.token
    );
    this.channel = this.chat.channel("messaging", "Support", {
      name: "Support",
      members: ["Admin", "Client"]
    });

    this.state = await this.channel.watch();
    this.newmessage = this.state.messages;
    console.log(this.newmessage);
    console.log(this.loggedinUser.me.id);

    this.channel.on("message.new", event => {
      this.newmessage = [...this.newmessage, event.message.text];
      console.log(this.newmessage);
    });
  }


  async sendingMessage() {
    const test = this.message;
    if ((this.message = "")) {
      return;
    }
    try {
      this.channel.sendMessage({
        text: test
      });
      console.log(test);

      this.message = "";
    } catch (error) {
      console.error(error);
    }
  }
}
