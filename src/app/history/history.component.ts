import { formatDate } from '@angular/common';
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
  threshold = 0

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
    if (this.checkIfToolsExist()){
      const format = 'dd/MM/yyyy';
      const locale = 'en-US';
      let t: any[]=[]
      this.http.get(this.url+"tools/"+this.tool+".json").subscribe((data:any)=>{
        t.push(data.threshold)
        this.threshold = t[0]
        this.histo = {worker: this.worker,tool: this.tool,quantity: this.quantity,when:formatDate(this.today, format, locale),threshold:this.threshold}
        this.http.post(this.url+"history/"+this.today.toDateString()+".json",this.histo).subscribe()
        this.openSnackBar("Storico aggiornato!")
        this.worker = ""
        this.tool = ""
        this.quantity = 0
        this.histos.push(this.histo)
      })
    } else {
      this.openSnackBar("Attrezzo non esistente! Riprova.")
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000
    });
  }

  checkIfToolsExist(){
    return this.tools.includes(this.tool)
  }

}
