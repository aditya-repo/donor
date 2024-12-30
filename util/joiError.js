const schemaError = (err, res)=>{
    const errordata = {}
    err.details.forEach((data) => {
        errordata[data.path] = data.message
    });
   return errordata
}

module.exports = schemaError