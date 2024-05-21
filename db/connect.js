const mongoose= require("mongoose")
const initData = require("../init/data")
const Listing= require("../model/listing-model")
const batchSize = 100; 

const URL = "mongodb+srv://clownlaugh100:thapa@cluster0.pbwu43f.mongodb.net/duplicate?retryWrites=true&w=majority&appName=Cluster0"

const connectdb = async()=> {
  try {
    await mongoose.connect(URL , {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,})
    console.log("sucessful db connection")
  } catch (error) {
    console.error("db connection fail")
  }
}

// const initDB = async () => {
//   try {
//     const ownerId = "661df81b1aa7ba0edefbec6a"; // Your owner ID

//     const modifiedData = initdata.data.map((obj) => ({ ...obj, owner: ownerId }));
//     await Listing.insertMany(modifiedData, { timeout: 60000 }); // 30-second timeout

//     console.log("Data was initialized");
//   } catch (error) {
//     console.error("Failed to initialize data:", error);
//   }
// };

const initDB = async()=> {
  await Listing.deleteMany({})
  initData.data= initData.data.map((obj)=>({...obj,owner:"661df81b1aa7ba0edefbec6a"}))
  await Listing.insertMany(initData.data)
  console.log("data was inittialized")

}

// const initDB = async () => {
//   try {
//     for (let i = 0; i < initdata.data.length; i += batchSize) {
//       const batch = initdata.data.slice(i, i + batchSize);
//       await Listing.insertMany(batch);
//       console.log(`Inserted batch ${i / batchSize + 1}/${Math.ceil(initdata.data.length / batchSize)}`);
//     }
//     console.log("Data was initialized");
//   } catch (error) {
//     console.error("Failed to initialize data:", error);
//   }
// };

initDB()

module.exports= connectdb