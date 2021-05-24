import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  name = ""
  quantity = 0
  url = "https://magazzino-d0dc0-default-rtdb.firebaseio.com/"
  threshold = 0

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  addTool(){
    //(new Date()).toDateString()
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    let tool = {name: this.name,quantity: this.quantity,last_update:formatDate(new Date(), format, locale),last_user:"",threshold:this.threshold}
    this.http.put(this.url+"tools/"+this.name+".json",tool).subscribe()
  }

}
