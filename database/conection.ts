import mysql from 'mysql';

const con = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
})

// try{
//     con.connect((err)=>console.log(err));
// } catch(err: any){
//     console.log(err);
// }

export default con;
