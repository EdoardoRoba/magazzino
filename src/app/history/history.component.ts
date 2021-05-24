import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  url = "https://magazzino-d0dc0-default-rtdb.firebaseio.com/"
  tool = ""
  worker = ""
  quantity = 0
  today = new Date()
  histo: any
  histos: any[] = []
  tools: any[]=[]

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    let t: any[]=[]
    this.http.get(this.url+"tools.json").subscribe((data:any)=>{
      Object.keys(data).forEach(k =>{
        t.push(k)
      })
      this.tools = t
    })
  }

  addHistory(){
    this.histo = {worker: this.worker,tool: this.tool,quantity: this.quantity,when:this.today.toDateString()}
    this.http.post(this.url+"history/"+this.today.toDateString()+".json",this.histo).subscribe()
    this.openSnackBar("Storico aggiornato!")
    this.worker = ""
    this.tool = ""
    this.quantity = 0
    this.histos.push(this.histo)
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000
    });
  }

}
