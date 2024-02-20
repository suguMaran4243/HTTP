import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { Products } from './model/products';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'http-request';

  allProducts:Products[]=[];
  isFetching:boolean=false;
  editMode:boolean=false;
  currentProductId:string;
  
  tableHeadName=[{
    id:'S.No',
    fid:'Fruit id',
    name:'Fruit Name',
    price:'Fruit Price',
    quantity:'Fruit Quantity'
  }]

  @ViewChild('fruitForm') form :NgForm;

  constructor(private http :HttpClient)
  {
    
  }
  ngOnInit()
  {
   this.fetchProducts(); 
  }
  onProductsFetch()
  {
    this.fetchProducts();
  }

  onFruitsCreate(products:{fId:string,fName:string,fPrice:string,fQuantity:string})
  {
    if(!this.editMode)
    {
      this.http.post<{name:string}>('https://angular-5417e-default-rtdb.firebaseio.com/fruits.json',products)
      .subscribe((res)=>
      {
        console.log(res);
        
      })
  
    }
    
  }
  private fetchProducts()
  {
    this.isFetching=true;
    this.http.get('https://angular-5417e-default-rtdb.firebaseio.com/fruits.json')
    .pipe(map((res:{[key :string]:Products})=>
    {
      const products=[]
       for(const key in res)
       {
        if(res.hasOwnProperty(key))
        {
          products.push({...res[key],id:key})
        }
         
       }
       return products
    }))
    .subscribe((response )=>
      {
        console.log(response);
        this.allProducts=response;
        this.isFetching=false;
        
      })
  }


  onDeleteProduct(id:string)
  {
   this.http.delete('https://angular-5417e-default-rtdb.firebaseio.com/fruits/'+id+'.json').subscribe();
  }
  onClearProducts()
  {
    this.http.delete("https://angular-5417e-default-rtdb.firebaseio.com/fruits.json").subscribe(  )
  }



  onEditProduct(id:string)
  {
    this.currentProductId=id;
    //Get the product from the form using id

    let currentProduct= this.allProducts.find((p)=>{ return p.id === id });
    //  console.log(currentProduct);

    //populate the form with the product details

        this.form.setValue({
          fId:currentProduct.fId,
          fName:currentProduct.fName,
          fPrice:currentProduct.fPrice,
          fQuantity:currentProduct.fQuantity
        });

    //change the button value to update
    this.editMode=true;
  }


updateProduct(id:string,value:Products)
{
  this.http.put('https://angular-5417e-default-rtdb.firebaseio.com/fruits/'+id+'.json',value).subscribe()
}
 
}
