const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/AppmonRegTrial2",
{
    useNewUrlParser :true,
    useUnifiedTopology:true,
    useCreateIndex:true
}
).then(()=>{
    console.log('Mongo Db is Succefully Connected  💪  💪 ');
}).catch((err)=>{
console.log(err)
})