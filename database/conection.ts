import mysql from 'mysql';

const con = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
})

try{
    con.connect();
} catch(e){
    e ? console.log(e) : null;
    // process.exit(1);
}
export default con;
