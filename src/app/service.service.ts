import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Injectable({
  providedIn: "root"
})
export class ServiceService {
  constructor(private http: HttpClient) {}

  readonly baseUrl = "https://stream-token-genetor.herokuapp.com/get-token";

  userAuthentication(username) {
    const httpheader = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this.http.post(this.baseUrl, username, { headers: httpheader });
  }
}
