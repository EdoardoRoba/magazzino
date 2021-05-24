import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { HistoryComponent } from '../history/history.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  url = "https://magazzino-d0dc0-default-rtdb.firebaseio.com/"
  tools: any[]=[]
  displayedColumns: string[] = ['name', 'quantity', 'last_update', 'last_user'];
  showLoading = true
  res: any
  toUpdate: any

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.showLoading = true
    let t: any[]=[]
    this.http.get(this.url+"tools.json").subscribe((response: any) => {
      Object.keys(response).forEach(element => {
        t.push(response[element])
      });
      this.showLoading = false
      this.tools = t
    })
    interval(5000).subscribe(x => {this.getData()})
  }

  getData(){
    let t: any[]=[]
    this.showLoading = false
    this.http.get(this.url+"tools.json").subscribe((response: any) => {
      Object.keys(response).forEach(element => {
        t.push(response[element])
      });
      this.tools = t
    })
  }

  openWindowAddTool(){
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // this.retrievedData = []
      this.showLoading = true

    });
  }

  openWindowAddHistory(){
    const dialogRefH = this.dialog.open(HistoryComponent);
    let r: any[]=[]

    dialogRefH.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      Object.keys(result).forEach((key:any)=>{
        r.push(result[key])
      })
      this.res = r
      this.updateTools()
      // this.retrievedData = []
    });
  }

  updateTools(){
    Object.keys(this.res).forEach((key:any)=>{
      this.http.get(this.url+"tools/"+this.res[key].tool+".json").subscribe((r:any)=>{
        this.toUpdate = {last_update:this.res[key].when,last_user:this.res[key].worker,name:this.res[key].tool,quantity:r.quantity-this.res[key].quantity}
        this.http.put(this.url+"tools/"+this.res[key].tool+".json",this.toUpdate).subscribe()
      })
    })
  }

}
