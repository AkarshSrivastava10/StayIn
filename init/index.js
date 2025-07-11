const mongoose = require('mongoose');
const initData = require("../init/data");
const Listing = require("../models/listing");

const MONGO_URL='mongodb://127.0.0.1:27017/stayin'
main()
.then(()=>{
    console.log("connected to database successfully!");
})
.catch((err)=>{
    console.log("error connecting to database" + err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

let initDb=async()=>{
await Listing.deleteMany({})
initData.data = initData.data.map((obj) => ({...obj , owner : '683c334d72c193d18a596c95'}))
await Listing.insertMany(initData.data);
console.log("Data is initialized!");
}

initDb();
