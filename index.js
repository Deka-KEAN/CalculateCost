const express=require("express");

const bodyParser=require("body-parser");
const cors=require("cors");
const zod=require("zod");
const app=express();
app.use(cors());
app.use(bodyParser.json());

const port=process.env.PORT || 3000;

const C1=new Map([
    ["A",3],
    ["B",2],
    ["C",8]
]);
const C2=new Map([
    ["D",12],
    ["E",25],
    ["F",15]
]);
const C3=new Map([
    ["G",0.5],
    ["H",1],
    ["I",2]
]);

app.get("/calculate",(req,res)=>{
    res.status(200).sendFile('index.html',{root: __dirname })
});

function costForWeight(w){
    if(w==0)
        return 0;
    let x=w,costPerUnit=10;
    while(x>5){
        x=x-5;
        costPerUnit+=8;
    }
    return costPerUnit;
}

function calculate(w1,w2,w3){
    console.log(costForWeight(w1)+"  "+costForWeight(w2)+"   "+costForWeight(w3));
    let ans=0;
    if(w1!==0)
        ans+=3*costForWeight(w1);
    if(w2!=0){
        if(ans==0){
            ans+=2.5*costForWeight(w2);
        }else{
            ans+=25;
            ans+=2.5*costForWeight(w2);
            console
        }
    }
    if(w3!=0){
        if(ans==0){
            ans+=2*costForWeight(w3);
        }else{
            ans+=20;
            ans+=2*costForWeight(w3);
        }
    }
    return ans;
}

app.post("/calculate", async (req,res)=>{
    const data=req.body;
    // console.log(data.A);
    // console.log(C1[data.A]);
    try{
        var check=0;
        var weight1=0,weight2=0,weight3=0;
        Object.entries(data).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
            if(C1.get(key)===undefined && C2.get(key)===undefined && C3.get(key)===undefined){
                
                check++;                
            }
            if(C1.get(key)!=undefined){
                console.log(C1.get(key));
                weight1+=value*C1.get(key);
            }
            else if(C2.get(key)!=undefined){
                console.log(C2.get(key));
                weight2+=value*C2.get(key);
            }
            else if(C3.get(key)!=undefined){
                console.log(C3.get(key));
                weight3+=value*C3.get(key);
            }
        });
        
    }catch(err){
        console.log(err);
        return res.json({
            message:"Unexpected error occured!"
        });
    }
    if(check==1){
        res.json({
            message:"Incorrect Inputs !!",
            check
        });
    }
    else{
        var ans=await calculate(weight1,weight2,weight3);
        res.json({
            message: "Total Cost is => "+ans
        });
    }
});

app.listen(port,()=>console.log(`Port listening at ${port}`));


// Export the Express API
module.exports = app;