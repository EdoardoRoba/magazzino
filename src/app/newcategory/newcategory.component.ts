import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-newcategory',
  templateUrl: './newcategory.component.html',
  styleUrls: ['./newcategory.component.css']
})
export class NewcategoryComponent implements OnInit {

  url = "https://magazzino-d0dc0-default-rtdb.firebaseio.com/"
  newCategory = ""

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  addNewCategory(){
    this.http.put(this.url+"categories/"+this.newCategory+".json",{label:this.newCategory}).subscribe(()=>{
      this.openSnackBar("Categoria aggiunta!")
    })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000
    });
  }

}
