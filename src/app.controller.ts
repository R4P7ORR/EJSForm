/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { RegistrationDTO } from './registration.dto';
import { User } from './user';
import { Response } from 'express';
import { ProductDTO } from './productAdd.dto';
import { Product } from './products';

const users: User[] = [new User("admin@example.com", "asdf1234", 23)]
const products: Product[] = [new Product("EX1234", "perfect", "Example Product")]

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Welcome to the homepage' };
  }

  @Get("register")
  @Render("registerForm")
  registerForm(){
    return {};
  }
  @Post("register")
  @HttpCode(200)
  @Render("registerForm")
  register(@Body() registration: RegistrationDTO, @Res() res: Response){
    const errors : string[] = [];
    if (!registration.email.includes('@')){
      errors.push("The formatting of the email address is not correct!");
    }
    if (registration.password.length < 8){
      errors.push("The password MUST consist of at least 8 characters.");
    }
    if (registration.password !== registration.passwordAgain){
      errors.push("The passwords do not match!");
    }
    const age = parseInt(registration.age);
    if (age < 18 || isNaN(age)){
      errors.push("Age must be over 18!");
    }
    if (errors.length > 0){
      return {errors,};
    } else{
      users.push(new User(registration.email, registration.password, age));
      console.log(users);
      res.redirect('/');
    }
  }

  @Get("product")
  @Render("productForm")
  productForm(){
    return{errors:[],
    serialNum:"",
    prodName:"",};
  }

  @Post("product")
  @Render("productForm")
  productinfo(@Body() productDetails: ProductDTO, @Res() res: Response){
    const errors : string[] = [];
    let serialNum: string = productDetails.serialNumber;
    let prodName: string = productDetails.prodName;
    if (!/^[A-Za-z]{2}[0-9]{4}$/gm.test(productDetails.serialNumber)){
      errors.push("Incorrect formatting of Serial Number!");
      serialNum = "";
    }
    if (productDetails.prodName.length < 3){
      errors.push("Product name MUST be at least 3 characters long!");
      prodName = "";
    }
    if (errors.length > 0){
      return {errors,serialNum,prodName};
    } else{
      products.push(new Product(productDetails.serialNumber, productDetails.condition, productDetails.prodName));
      console.log(products);
      res.redirect('/product');
      return {prodName:"", serialNum:""}
    }
  }
}
