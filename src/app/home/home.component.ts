import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  url = "https://magazzino-d0dc0-default-rtdb.firebaseio.com/"
  tools: any[]=[]
  displayedColumns: string[] = ['name', 'quantity'];
  showLoading = true

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.showLoading = true
    let t: any[]=[]
    this.http.get(this.url+"tools.json").subscribe((response: any) => {
      Object.keys(response).forEach(element => {
        t.push({name:response[element].name,quantity:response[element].quantity})
      });
      this.showLoading = false
      this.tools = t
    })
    interval(5000).subscribe(x => {this.getData()})
  }

  openWindow(){
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // this.retrievedData = []
      this.showLoading = true

    });
  }

  getData(){
    let t: any[]=[]
    this.showLoading = false
    this.http.get(this.url+"tools.json").subscribe((response: any) => {
      Object.keys(response).forEach(element => {
        t.push({name:response[element].name,quantity:response[element].quantity})
      });
      this.tools = t
    })
  }

}
