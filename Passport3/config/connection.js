var express=require('express')
var mysql=require('mysql2')

const db=mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'vishnu@123',
        database:'test'
    }
);

module.exports=db; 