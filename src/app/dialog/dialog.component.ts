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
  toolsNames: any[]=[]
  tools: any[]=[]
  toUpdate: any
  category = ""

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    let too: any[]=[]
    let t: any[]=[]
    this.http.get(this.url+"tools.json").subscribe((data:any)=>{
      Object.keys(data).forEach(k =>{
        too.push(k)
        t.push(data[k])
      })
      this.toolsNames = too
      this.tools = t
    })
  }

  addTool(){
    //(new Date()).toDateString()
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    if (!this.checkIfToolsExist()){
      let tool = {name: this.name,quantity: this.quantity,last_update:formatDate(new Date(), format, locale),last_user:"",threshold:this.threshold,category:this.category}
      this.http.put(this.url+"tools/"+this.name+".json",tool).subscribe()
    } else {
      let toU: any
      this.http.get(this.url+"tools/"+this.name+".json").subscribe((data:any)=>{
        // toU = data
        this.toUpdate = data
        this.toUpdate = {name: this.name,quantity: this.quantity+this.toUpdate.quantity,last_update:formatDate(new Date(), format, locale),last_user:"",threshold:this.threshold}
        this.http.put(this.url+"tools/"+this.name+".json",this.toUpdate).subscribe()
      })
    }
  }

  checkIfToolsExist(){
    let flag = false
    Object.keys(this.tools).forEach((k:any)=>{
      if (this.tools[k].name == this.name){
        flag = true
      }
    })
    return flag
  }

}
