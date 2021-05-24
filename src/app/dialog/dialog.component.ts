import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  name = ""
  quantity = 0
  url = "https://magazzino-d0dc0-default-rtdb.firebaseio.com/"

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  addTool(){
    let tool = {name: this.name,quantity: this.quantity,last_update:(new Date()).toDateString(),last_user:""}
    this.http.put(this.url+"tools/"+this.name+".json",tool).subscribe()
  }

}
