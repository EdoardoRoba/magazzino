import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { HistoryComponent } from '../history/history.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewcategoryComponent } from '../newcategory/newcategory.component';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  url = "https://magazzino-d0dc0-default-rtdb.firebaseio.com/"
  tools: any[]=[]
  displayedColumns: string[] = ['name', 'category', 'quantity', 'last_update', 'last_user', 'missing', 'delete'];
  showLoading = true
  res: any
  toUpdate: any
  categories: any[]=[]
  // categories = [{label:"Elettrico",value:"elettrico"}]
  selectedCategory = ""
  user = ""

  constructor(private http: HttpClient, public dialog: MatDialog, private _snackBar: MatSnackBar, private data: CommunicationService) { }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message => this.user = message)
    console.log("USR: ",this.user)

    this.showLoading = true
    let cats: any[]=[]
    this.http.get(this.url+"categories.json").subscribe((response: any) => {
      Object.keys(response).forEach(element => {
        cats.push(element)
      });
      this.categories = cats
    })

    let t: any[]=[]
    this.http.get(this.url+"tools.json").subscribe((response: any) => {
      Object.keys(response).forEach(element => {
        t.push(response[element])
      });
      this.showLoading = false
      this.tools = t
      if (this.selectedCategory!=="tutte le categorie"){
        this.tools = this.tools.filter((obj:any) => obj.category === this.selectedCategory);
      }
    })
    interval(2000).subscribe(x => {this.getData()})
    interval(30000).subscribe(x => {this.updateCategories()})
  }

  getData(){
    let t: any[]=[]
    this.showLoading = false
    this.http.get(this.url+"tools.json").subscribe((response: any) => {
      Object.keys(response).forEach(element => {
        t.push(response[element])
      });
      this.tools = t
      if (this.selectedCategory!=="tutte le categorie"){
        this.tools = this.tools.filter((obj:any) => obj.category === this.selectedCategory);
      }
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
        this.toUpdate = {last_update:this.res[key].when,last_user:this.res[key].worker,name:this.res[key].tool,quantity:r.quantity-this.res[key].quantity,threshold:this.res[key].threshold}
        this.http.put(this.url+"tools/"+this.res[key].tool+".json",this.toUpdate).subscribe()
      })
    })
  }

  deleteTool(name: string){
    this.http.delete(this.url+"tools/"+name+".json").subscribe(()=>{
      this.openSnackBar("Attrezzo eliminato!")
    })
  }

  addNewCategory(){
    const dialogRef = this.dialog.open(NewcategoryComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // this.retrievedData = []
      this.showLoading = true
      this.updateCategories()
    });

  }

  updateCategories(){
    let cats: any[]=[]
    this.http.get(this.url+"categories.json").subscribe((response: any) => {
      Object.keys(response).forEach(element => {
        cats.push(element)
      });
      this.categories = cats
    })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000
    });
  }

}
