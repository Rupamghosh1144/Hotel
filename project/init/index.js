 const mongoose=require("mongoose");
const initData=require("./data");
const model=require("../models/listing");
const Listing = require("../models/listing");




main().then(()=>{
    console.log("Connected to the databases");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airanb");
}

const initDB =async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
}

initDB();