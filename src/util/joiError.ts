import { ValidationErrorItem } from "joi";

interface ErrorData {
    [key: string]: string
}

const schemaError = (err: {details: ValidationErrorItem[]})=>{
    const errordata: ErrorData = {}
    err.details.forEach((data) => {
        errordata[data.path.join()] = data.message
    });
   return errordata
}

export default schemaError