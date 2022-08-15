
const { Console } = require("console");
const { response } = require("express");
const express = require("express");
const app   = express();
const PORT = 3000;

const https = require("https");

app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.get("/", (req, res)=>{
    
    res.sendFile(__dirname + "/index.html");
});


app.post("/", (req, res)=>{

    var cityname = req.body.cityname;
    
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=bc88586c307a98c15018638b61752b04&units=metric";

    https.get(url, (resp)=>{
        if (resp != null){
            
            console.log(resp.statusCode);
            if (resp.statusCode===200){
                resp.on("data", (data)=>{
                    var response_json = (JSON.parse(data));
                    var temp = response_json.main.temp;
                    var feelsLike =  response_json.main.feels_like;
                    var desc = response_json.weather[0].description;
                    var minTemp = response_json.main.temp_min;
                    var maxTemp = response_json.main.temp_max;
                    var icon =  response_json.weather[0].icon;
                    var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    
                    res.write("<h1>" + cityname + "</h1>");
                    res.write("<h3>Current temparature is " + temp + "degree C</h3>");
                    res.write("<p>Today's minimum is " + minTemp + " degree C and maximum is " + maxTemp + " degree C</p>");
                    res.write("<img src='"+ iconURL + "'>");
                    res.write("<p> Todays overall condition is " + desc + "</p>");
                    res.write("<form action='/' method='get'> <button type='submit'>Home</button></form>");
                    res.send();
                });

            }
            else{
                res.write("<p>Error is fetching weather information. Error code :" + resp.statusCode + "</p>");
                res.write("<form action='/' method='get'> <button type='submit'>Home</button></form>");
                res.send();

            }
            
        }
        else {
            res.write("<p>Error is fetching weather information. Error code :" + resp.statusCode + "</p>");
            res.write("<form action='/' method='get'> <button type='submit'>Home</button></form>");
            res.send();
        }
    });
});

app.listen(PORT, ()=>{
    console.log("Server started at [" + PORT + "]");
});


