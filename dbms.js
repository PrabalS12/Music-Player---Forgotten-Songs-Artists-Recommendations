var mysql =require("mysql");
var creds=require("./creds.json")
module.exports={
    addArtist:function(){
        var con=mysql.createConnection(creds);
        con.connect((err)=>{
            if(err) throw err;
            console.log("Connected!!")
            con.query("use musicDatabase",(err,result)=>{
                if(err) throw err;
                console.log(result);
            })
        })
    },
    addSong:function(){
        
    }
}