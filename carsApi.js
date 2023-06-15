let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
    res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});
let port=process.env.PORT || 2410
app.listen(port, () => console.log(`Node app listening on port ${port}!`));


let {cars,carMaster}=require("carsData");

app.get("/cars",function(req,res){
    let minPrice= +req.query.minPrice;
    let maxPrice= +req.query.maxPrice;
    let fuel = req.query.fuel;
    let type = req.query.type;
    let sort = req.query.sort;

    let model=carMaster.filter((cr)=>cr.fuel===fuel)
    let com=carMaster.filter((cr)=>cr.type===type)
    console.log(model);

    let car=cars;
    if(minPrice){
        car=car.filter((cr)=>cr.price>=minPrice);
        console.log("minPrice",car);
    } 
    if(maxPrice){
        car=car.filter((cr)=>cr.price<=maxPrice);
        console.log("maxprice",car);
    }
    if(fuel){
        car=car.filter((cr)=>model.find(c=>c.model===cr.model));
    }
    if(type){
        car=car.filter((cr)=>com.find(c=>c.model===cr.model));
    }
    if(sort==="kms"){
        car=car.sort((km1,km2)=>km1.kms-km2.kms)
    }
    if(sort==="price"){
        car=car.sort((pr1,pr2)=>pr1.price-pr2.price)
    }
    if(sort==="year"){
        car=car.sort((yr1,yr2)=>yr1.year-yr2.year)
    }
    res.send(car)
})
app.get("/cars/:id",function(req,res){
    let id= req.params.id;
    let car=cars.find(cr=>cr.id===id)
    res.send(car)
})
app.get("/car",function(req,res){
    
    res.send(carMaster)
})
app.post("/car",function(req,res){
    let body=req.body;
    cars.push(body)
    res.send(body)
})
app.put("/car/:id",function(req,res){
    let id=req.params.id;
    let body=req.body;
    let index=cars.findIndex(cr=>cr.id===id)
    console.log(index);
    if(index>=0){
        let updatedCar={id:id,...body};
        cars[index]=updatedCar;
        res.send(updatedCar)
    }
    else{
        res.status(404).send("No Car Found")
    }

})
app.delete("/car/:id/delete",function(req,res){
    let id =req.params.id;
    let index=cars.findIndex(cr=>cr.id===id)
    if(index>=0){
        let deleted=cars.splice(index,1);
        res.send(deleted)
    }
    else{
        res.status(404).send("No Car Found")
    }
})