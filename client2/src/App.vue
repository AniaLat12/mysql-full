<template>
<div id="root">
  <div class="main" v-if="res!==''">
    <nav class="grid hide"> 
        <div class="menu">
          <svg class="account-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg> 
          <span @click="hamburger()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </span>
        </div>
        <ul> 
        <span>Databases: </span> <br><br>
            <li v-for="db in databases" :key="db.Database" @click="useDb(db.Database)"> 
              <div class="nav-el"> 
                  <a>
                    <span>{{db.Database}}</span>
                  </a>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <hr>
                </div>
            </li>
        </ul>
        <span class="add-db">
          <input type="text" v-model="newDbName">
          <button @click="mekeDatabase()">MakeDatabase</button>
        </span>
    </nav>
      <main class="right"> 
        <header> 
          <button type="submit" @click="showStructure()">Structure</button>
          <button type="submit" @click="showInsert()">Insert</button>
          <button type="submit" @click="showConsole()">Console</button>
          <button type="submit" @click="showTableCreator()">Create table</button>
          <button type="submit" @click="showRelationCreator()">Create relation</button>
          <!-- <button type="submit" @click="showConsole()"></button> -->
          <span style="color: wheat">Tables: </span>
          <span v-for="table in tables" :key="table" id="table-list" @click="descTable(table['Tables_in_'+db]), showStructure()">
            {{ table[`Tables_in_${db}`] }} |
          </span>
          <br>
        </header> 

        <section class="consol" v-if="isShowConsole">
            <form @submit.prevent="sendQuery()" method="post" id="console-form">
              <textarea name="query" cols="30" rows="10"></textarea>
              <button type="submit" id="console-button">
                  Execute
              </button>
          </form>
        </section>

        <section v-if="isShowStructure">
            <div class="table-title">{{ table.toUpperCase() }}</div>
          <table>
            <tr>
              <th>NAME</th>
              <th>TYPE</th>
              <th>NULL</th>
              <th>KEY</th>
              <th>DEFAULT</th>
              <th>EXTRA</th>
            </tr>
            <tr v-for="src in structure" :key="src.Field">
              <td> {{src.Field}} </td>
              <td> {{src.Type}} </td>
              <td> {{src.Null}} </td>
              <td> {{src.Key}} </td>
              <td> {{src.Default}} </td>
              <td> {{src.Extra}} </td>

            </tr>
          </table>
        </section>

        <article v-if="isShowConsole"> 
          <table v-if="dataFromQuery!==''">
            <tr>
              <th v-for="item in keys" :key="item"> {{ item }} </th>
            </tr>
            <tr v-for="row in dataFromQuery" :key="row">
              <td v-for="key in keys" :key="key">
                {{ row[key] }}
              </td>
            </tr>
          </table>
        </article>

        <section v-if="isShowInsert">
          <span v-if="table==''">
            You dont choose a table
          </span>
          <div v-else>
            <span style="font-size:1.5rem; padding: 2rem;">Insert date into {{ table }}</span>
            <form method="POST">
              <table>
                <tr>
                  <td v-for="key in structure" :key="key">
                    {{key.Field}}
                  </td>
                </tr>
                <tr>
                    <td v-for="key in structure" :key="key" class="id">
                      <input id="insert-input" type="text" :name="key.Field" :ref="key.Field">
                    </td>
                </tr>
              </table>
            </form>
            <button type="submit" @click="insert">Insert</button>
          </div>
        </section>

        <!-- TODO: MAKE TABLE CREATOR -->
        <section v-if="isShowTableCreator">
         <form>
           <label> Table name: </label>
           <input type="text" name="table_name">
           <label> Rows: </label>
           <input type="number" min="1" max="32" v-model="rows">

           <!-- ROWS -->
          <table>
            <tr>
              <th v-for="row in rowNames" :key="row">
                <tr>
                  {{row}}
                </tr>
              </th>
            </tr>
            <tr v-for="row in rows" :key="row">
              <td><input id="insert-input" type="text"></td>
              <td>
                <select name="type" id="insert-input">
                  <option v-for="type in types" :key="type" :value="type"> {{ type }} </option>
                </select>
              </td>
              <td>
                <select name="defaultSettings" id="insert-input">
                  <option v-for="defSett in defaultSettings" :key="defSett" :value="settings"> {{ defSett}} </option>
                </select>
              </td>
              <td>
                <select name="index" id="insert-input">
                  <option value="none">Empty</option>
                  <option value="primary">Primary</option>
                </select>
              </td>
            </tr>
          </table>

           <!-- END -->
         </form>
        </section>

        <section v-if="isShowRelationCreator" id='relation-contener'>
          <form v-if="db!==''" @submit.prevent="makeRelation()">
            <!-- PRIMARY KEY -->
            <label>Database: </label>
            <select name="primarydb" v-model="primaryDb" @change="getPrimaryTables(), getForeignTables()">
              <option v-for="db in databases" :key="db.Database" :value="db.Database">
                {{ db.Database }}
              </option>
            </select><br>
            
            <label>Table: </label>
            <select name="primarytable" @change="getPrimaryRows()" v-model="primaryTable">
              <option>--Table--</option>
              <option v-for="table in primaryTables" :key="table" :value="table[`Tables_in_${primaryDb}`]">
                {{ table[`Tables_in_${primaryDb}`] }}
              </option>
            </select><br>

            <label>Row:</label>
            <select name="primaryrow" v-model="primaryRow">
              <option v-for="row in primaryRows" :key="row" :value="row.Field"> {{ row.Field }} </option>
            </select><br>

            <!-- FOREIGN KEY -->
            <p>With:</p>

            <label>Table: </label>
            <select name="foreigntable" @change="getForeignRows()" v-model="foreignTable">
              <option v-for="table in primaryTables" :key="table" :value="table[`Tables_in_${primaryDb}`]">
                {{ table[`Tables_in_${primaryDb}`] }}
              </option>
            </select><br>

            <label>Row:</label>
            <select name="foreignRow" v-model="foreignRow">
              <option v-for="row in foreignRows" :key="row" :value="row.Field">
                {{ row.Field }}
              </option>
            </select><br>

            <br>
            <button type="submit" id="relation-button">Add relation</button>
          </form>
        </section>

      </main>
  </div>
  <div class="error" v-else-if="res === ''">
    <div class="box">
      <span class="error-text">
        You have error with MySQL connection.
      </span>
      <p>
        Check your connection and try again. 
        If error is returned, you should contact 
         with server administrator.
      </p>
      <button type="submit"><a href="/">Restart page.</a></button>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios";

export default {
  data(){
    return {
      res: '',
      databases: '',
      query: 'ddd',
      tables: JSON.parse(localStorage.getItem('tables')),
      db: localStorage.getItem("db"),
      table: '',
      structure: '',
      dataFromQuery: '',
      keys: '',
      test: '',
      rows: 4,
      newDbName: '',
      rowNames: ["Name", "Type", "Default settings","Index"],
      types: ["Int", "Varchar", "Text", "Date", "Tinyint", "Smallint", 
              "Mediumint", "Float", "Bollean", "Double", "Decimal"],
      defaultSettings: ["Empty", "Null"],
      // components
      isShowConsole: true,
      isShowStructure: false,
      isShowInsert: false,
      isShowTableCreator: false,
      isShowRelationCreator: false,
      // relation
      primaryDb: '',
      primaryTable: '',
      primaryRow: '',
      foreignDb: '',
      foreignTable: '',
      foreignRow: '',
      // relation select tag
      primaryTables: '',
      primaryRows: '',
      foreignTables: '',
      foreignRows: '',
    }
  },
  methods: {
    async get(){
      await axios.get("http://localhost:3000/").then(res=> {
        this.res = res
        this.databases = res.data.dbs
        this.query = res.data.query
        console.log(res);
      })
    },
    async useDb(v){
      await axios
        .get(`http://localhost:3000/db/${v}`)
        .then(res=>{
          this.tables = res.data.tables; this.db = res.data.db
          // [ { "Tables_in_demeter": "category" }, { "Tables_in_demeter": "products" }, { "Tables_in_demeter": "users" } ] 
          const { db, tables } = res.data;
          localStorage.setItem("tables", JSON.stringify(tables));
          localStorage.setItem("db", db);
        })
    },
    async descTable(v){
      this.table = v;
      await axios
        .get(`http://localhost:3000/desc/${this.db}/${v}`)
        .then(res=>{this.structure = res.data.strucute})
    },
    async sendQuery(){
      const value = document.querySelector("textarea").value;
      await axios.post(`http://localhost:3000/query/${this.db}`, { data: value })
      .then(res => {
        this.dataFromQuery = res.data.data
        this.keys = Object.keys(this.dataFromQuery[0])

      });
    },
    async insert(){
      let reqBody = {
        alias: [],
        vals: []
      };

      await this.structure.forEach(e=>{
        reqBody.alias.push(e.Field);
        reqBody.vals.push(this.$refs[`${e.Field}`].value);
      });

      console.log(reqBody);

      await axios.post(`http://localhost:3000/insert/${this.db}/${this.table}`, {reqBody})
    },
    // relation
    async getPrimaryTables(){
      axios.get(`http://localhost:3000/rel/${this.primaryDb}`)
      .then(res =>{
        this.primaryTables = res.data.tables
      })
    },
    async getPrimaryRows(){
      await axios.get(`http://localhost:3000/rel/${this.primaryDb}/${this.primaryTable}`)
      .then(res =>{
        this.primaryRows = res.data.rows;
      })
    },

    async getForeignTables(){
      axios.get(`http://localhost:3000/rel/${this.primaryDb}`)
      .then(res =>{
        this.foreignTables = res.data.tables
      })
    },

    async getForeignRows(){
      axios.get(`http://localhost:3000/rel/${this.primaryDb}/${this.foreignTable}`)
      .then(res =>{
        this.foreignRows = res.data.rows;
      })
    },
    async makeRelation(){
      axios.post(`http://localhost:3000/makerel/${this.primaryDb}`, {
        query: `ALTER TABLE \`${this.primaryTable}\` ADD FOREIGN KEY (\`${this.primaryRow}\`) REFERENCES \`${this.foreignTable}\`(\`${this.foreignRow}\`) ON DELETE RESTRICT ON UPDATE RESTRICT;
      `});
    },
    mekeDatabase(){
      axios.post(`http://localhost:3000/makedb`, {name: this.newDbName})
    },
    // displaing
    showConsole(){
      this.isShowInsert = false;
      this.isShowStructure = false;
      this.isShowConsole = true; 
      this.isShowTableCreator = false; 
      this.isShowRelationCreator = false;
    },
    showStructure() {
      this.isShowInsert = false;
      this.isShowStructure = true;
      this.isShowConsole = false; 
      this.isShowTableCreator = false; 
      this.isShowRelationCreator = false;
    },
    showInsert(v = null){
      this.isShowInsert = true;
      this.isShowStructure = false;
      this.isShowConsole = false; 
      this.isShowTableCreator = false; 
      this.isShowRelationCreator = false;
    },
    showTableCreator(){
      this.isShowInsert = false;
      this.isShowStructure = false;
      this.isShowConsole = false; 
      this.isShowTableCreator = true; 
      this.isShowRelationCreator = false; 
    },
    showRelationCreator(){
      this.isShowInsert = false;
      this.isShowStructure = false;
      this.isShowConsole = false; 
      this.isShowTableCreator = false; 
      this.isShowRelationCreator = true; 
    },
    hamburger(){
      const tag = (tag) => document.querySelector(tag);
      const menu = tag("nav");
      const main = tag("main");
      if(menu.classList.contains("grid")){
        menu.classList.add("hidden");
        main.classList.add("left");
        menu.classList.remove("grid");
        main.classList.remove("right");
      } 
      else {
        menu.classList.add("grid");
        main.classList.add("right");
        menu.classList.remove("left");
        main.classList.remove("hidden");
      }
    },
  },
  mounted(){
    this.get()
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@100&display=swap');

/* SCROLL BAR STYLES */
::-webkit-scrollbar{
  width: 10px;
  background-color: white;
}

::-webkit-scrollbar-thumb{
  background:black;
}

html, body{
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
    background: #272525;
    color: white;
}

nav{
    position: fixed;
    background: #1E1D1D;
    height: 100%;
    width: 15%;
    font-size: 18px;
    font-family: 'Rubik', sans-serif;
    font-style: normal;
    font-weight: normal;
    grid-template-rows: 10% 90%;
    grid-template-columns: 1fr;
}

ul{
    list-style: none;
    width: 100%;
    height: 80%;
    padding: 0;
    overflow-y:  scroll;
}

.add-db{
  position: absolute;
  bottom: 0;
  height:10%;
  width: auto;
  padding: 1rem;
}

.add-db svg{
  font-size: 2rem !important;
  /* height: 2rem; */
}

.add-db input[type="text"]{
  height: 1.5rem;
  width: 9rem;
  outline: none;
  border: none;
  border-radius: .5rem;
  font-size: 1.2rem;
}

/* s */

.add-db button{
  background-color: #fff;
  border-radius: 0.5rem;
  font-size: .99rem;
  margin: 10px;
  outline: none;
  border: none;
  padding: 5px;
}

ul a{
  color: white;
}

.table-title{
  color:wheat;
  font-size: 1.5rem;
  padding: 1rem;
}

.nav-el{
    width: 100%;
    height: 10%;
    float: left;
    margin-top: 10px;
}

#table-list, header button, nav li{
  cursor: pointer;
}

main{
    height: 100%;
    width: 85%;
}

.right{ float: right; }
.left{ float: left; }
.hidden{ display: none; }
.grid{ display: grid; }

.menu{
    font-size: 3rem;
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    position: relative;
}

.menu svg{
    height: 3rem;
}


nav ul svg{
    height: 24px;
    float: right;
}

header{
    width: 100%;
    height: 10%;
    padding: 0;
    margin: 0;
}

.consol{
    position: relative;
    left: 50%;
    top: .5rem;
    transform: translate(-50%);
    height: 30%;
    width: 85%;
    background: #1E1D1D;
}

#console-form{
    background: inherit;
    width: 100%;
    height: 100%;
}

#insert-input{
  text-align: center;
  height: 100%;
  width: 95%;
  padding: .2rem;
  background: inherit;
  border: none;
  outline: none;
  color: white;
  font-size: 1.5rem;
}

textarea{
    padding: 1rem;
    color: white;
    font-size: 1.2rem;
    resize: none;
    height: 100%;
    width: 100%;
    text-decoration: none !important;
    background: #1E1D1D;
    border: none;
    position: relative;
    display: inline-block;
    outline:none;
    text-decoration-style: solid;
    text-decoration-line: none;
}

td{ padding:0;} 
#console-button{
    position: absolute;
    float: right;
    border: none;
    height: 1.5rem;
    border-radius:.5rem;
    background: white;
    bottom: 1rem;
    right: 1rem;
}

a{
    text-decoration: none;
    color:#1E1D1D
}

textarea:focus{
    outline: none;
}

article{
    height: 60%;
    width: 100%;
}

/* RELATION */
#relation-contener{
  position: relative;
  top: 30%;
  padding: 2rem;
  width: 50%;
  height: 50vh; 
  font-size: 1.5rem;
}

#relation-contener button{
  height: 2rem;
  font-size: 18px;
  padding: 5px;
  background: #fff;
  border: none;
  outline: none;
  border-radius: .5rem;
  cursor: pointer;
}

#relation-contener button:hover{
  background: rgb(197, 196, 196);
  transition: all 0.2s linear;
  transition-delay: 0;
  transition-duration: 0.1s;
}

#relation-contener select{
  height: 2rem;
  width: 8rem;
}

#relation-contener p {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

#relation-contener label{
  margin-left: 1rem;
}

#relation-contener select{
  font-size: 1.2rem;
  padding: 1px;
}

/* NAVIGATION BUTTON IN HEADER */
header button{
    background: white;
    border: none;
    font-size: 1rem;
    border-radius: 0.5rem;
    height: 2rem;
    min-width: 5rem;
    width: auto;
    margin: 1rem;
}

/* TABLE  */
table{
    width: 100%;
    /* height: 90%; */
    text-align: center;
    border-spacing: .5rem;
}

th{
    background: #1A1818;
}

tr{
    background: #1F1E1E;
    width: 4rem;
    /* height: 23px; */
    line-height: 42px; 
}

table a, table a:visited{
    float: right;
    padding-right: 5px;
    color: white;
}

table a:hover{
    float: right;
    padding-right: 5px;
    color: rgb(206, 200, 200);
}

table svg{
    height: 2rem;
    margin: 0;
}

/* CONNECTION ERROR */
.error{
  width: 100%;
}

.error .box {
  padding: 20px;
  background: #1A1818;
  height: 25vh;
  width: 20%;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%);
  border-radius: 1rem;
}

.error-text{
  color: rgb(216, 74, 74);
}

.error button{
  background:#fff;
  border-radius: .5rem;
  border: none;
  padding: 2px;
  font-size: 15px;
  position: relative;
  left: 60%;
  bottom: 0;
  cursor: pointer;
}
</style>
