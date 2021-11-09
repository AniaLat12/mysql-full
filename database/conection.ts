import mysql from 'mysql';

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
})
con.connect((err)=>err?console.error(err):[]);

export default con;
