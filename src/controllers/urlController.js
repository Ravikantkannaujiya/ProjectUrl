const urlModel = require("../models/urlModel")
//uniqueId generator
const shortId = require('shortid')
var validUrl = require('valid-url');




//validation checking function 
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}


//POST /url/shorten

const urlShortner = async function(req,res){
    try{
        const data = req.body
        if(!isValidRequestBody(data)){
            return res.status(400).send({status:false,messege:"Please Provide The Required Field"})
        }
        else{
            const longUrl = req.body.longUrl.trim()
            if(!isValid(longUrl)){
                res.status(400).send({status:false,messege:"Please Provide The LongUrl"})
            }
            if(!(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(longUrl))) {
                res.status(400).send({status: false, message: `This is not a valid Url`})
                return
            }
            if(!validUrl.isUri(longUrl)){
                res.status(400).send({status:false,messege:"The Url Is Not A Valid Url Please Provide The correct Url"})  
            }

            let generate=shortId.generate();
            let uniqueId=generate.toLowerCase()
            let baseurl = "http://localhost:3000"
            let shortLink = baseurl+`/`+uniqueId;
              
            //saving data in database
            data["urlCode"] = uniqueId;
            data["shortUrl"] = shortLink;
            let savedData = await urlModel.create(data);
            return res.status(201).send({
                status: true,
                message: "Data saved Successfully",
                data: savedData,
            });
        }
    }catch(error){
        return res.status(500).send({
            status: false,
            message: "Something went wrong",
            error: error.message
        
        })
    }
}


//GET /:urlCode

const geturl = async function(req,res){
    try{
        let param = req.params
        if(!param){
              return res.status(404).send({status:false,messege:"Please Use A Valid Link"})
        }else{
            let urlCode = req.params.urlCode
            if(!isValid(urlCode)){
               return res.status(400).send({status:false,messege:"Please Use A Valid Link"})
            }else{
            let findUrl = await urlModel.findOne({urlCode:urlCode})
            if(!findUrl){
              return  res.status(400).send({status:false,messege:"Cant Find What You Are Looking For"})
            }
            let fullUrl = findUrl.longUrl
            // return res.status(200).send({status:true,Link:fullUrl});
            res.redirect(fullUrl);
            
            }
        }

    }catch(error){
        return res.status(500).send({
            status: false,
            message: "Something went wrong",
            error: error.message
        })
    }    
}






module.exports.urlShortner = urlShortner
module.exports.geturl = geturl