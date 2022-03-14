const express= require("express");
const mongoose = require("mongoose");
const app= express();
app.use(express.json())
const connect =()=>{
    return mongoose.connect("mongodb://127.0.0.1:27017/c2u4")
}


// user schema----------------------------

const userSchema = mongoose.Schema({
    firstName :{type : String , required : true},
    middelName : {type : String , required : false},
    lastName : {type : String , required : true},
    age : {type : Number , required : true},
    email : {type : String , required : true},
    adress : {type : String , required : true},
    gender : {type : String , required : false , default : "Female"},
    type : {type:String , required: false , default : "customer"},
    branchId : {
        type : mongoose.Schema.Types.ObjectId,
        res : "Branch",
        required : true
    }
}
,
{
    versionKey : false,
    timestamps : true
})

const User = new mongoose.model("user" , userSchema);

//----------branch schema-------------------

const branchSchema = mongoose.Schema({
name : {type : String , required: true},
adress : {type :String , required : true},
IFSC: {type : String , required : true},
MICR : {type : Number, required :true}



},
{
    versionKey :false,
    timestamps:true
})

const Branch = new mongoose.model("branch" , branchSchema)

// ---------masterschema------------------

const masterSchema = mongoose.Schema({
    account_number : {type : Number , required : true , unique : true},
    balance : {type : Number , required : true},
    interestRate : {type : Number , required : true },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        res : "User",
        required : true
    },
    branchId : {
        type : mongoose.Schema.Types.ObjectId,
        res : "Branch",
        required : true,
        unique : true
    }
},
{
    versionKey : false,
    timestamps : true
})

const Master = new mongoose.model("master" , masterSchema)

// --------------- fixedschema--------


const fixedSchema = mongoose.Schema({
    account_number : {type : Number , required : true , unique : true},
    balance : {type : Number , required : true},
    interestRate : {type : Number , required : true },
    startdate : {type : Date , require : true},
    maturitydate : {type : Date , require : true},
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        res : "User",
        required : true
    },
    masterId : {
        type : mongoose.Schema.Types.ObjectId,
        res : "Master",
        required : true
    }
}

,
{
    versionKey : false,
    timestamps:true
})

const Fixed = new mongoose.model("fixed", fixedSchema)


// ---------saving schema------------

const savingSchema = mongoose.Schema({
    account_number : {type : Number , required : true , unique : true},
    balance : {type : Number , required : true},
    interestRate : {type : Number , required : true },
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        res : "User",
        required : true
    },
    masterId : {
        type : mongoose.Schema.Types.ObjectId,
        res : "Master",
        required : true
    }

},
{
    versionKey : false,
    timestamps:true
})

const Saving = new mongoose.model("saving" , savingSchema )




//-----------------------------

app.get("/masters" , async(req,res)=>{
    try{
         const master = await Master.find({}).populate("userId").populate("branchId").lean().exec()
         res.status(200).send(master);
    }
    catch(err)
    {
    res.status(500).send(err);
}}
)


app.post("/saving", async(req,res)=>{
    try{
        const saving = await Saving.create(req.body);
        res.status(200).send(saving)
    }
    catch(err)
    {
        res.status(500).send(err)
    }
})


app.post("/fixed", async(req,res)=>{
    try{
        const fixed = await Fixed.create(req.body);
        res.status(200).send(fixed)
    }
    catch(err)
    {
        res.status(500).send(err)
    }
})


app.patch("/master/:id" , async(req,res)=>{
    try{
          const master = await Master.findByIdAndUpdate(req.params.id, req.body , {new : true})
          res.status(200).send(master)
    }
    catch(err)
    {
        res.status(500).send(err)
    }
})



app.get("/master/:id" , async(req,res)=>{
    try{
         const master = await Master.findById(req.params.id).populate({path : "Saving" , select : ["account_number" , "balance"]})
         .populate({path : "Fixed" , select : ["account_number" , "balance"]})
         .populate({path : "Saving" , select : ["account_number" , "balance"]})
         .lean()
         .exec()
    }
    catch(err)
    {
        res.status(500).send(err)
    }
})














app.listen(5000,async()=>{
    try{
        await connect();
        console.log("i am connected")
    }
    catch(err)
    {
        console.log("not connected")
    }
    console.log("running on port 5000")
})