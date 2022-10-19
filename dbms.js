var mysql =require("mysql");
var creds=require("./creds.json")
module.exports={
    addArtist:function(Artistname,id,popularity,genre){
        var con=mysql.createConnection(creds.sql);
        con.connect((err)=>{
            if(err) throw err;
            con.query("use musicDatabase",(err,result)=>{
                if(err) throw err;
            })
            con.query(`CALL insertArtist("${Artistname}","${id}","${popularity}","${genre}")`,(err,result)=>{
                if(err) throw err;
            })
        })
    },
    addSong:function(){
        
    }
}