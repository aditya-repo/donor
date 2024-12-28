const generateOtp = (digit)=>{
    const number = 10 ** digit 
    const smallnumber = 10 ** (digit -1)
    return Math.floor(((number - smallnumber) * Math.random() ) + smallnumber)
}

module.exports = {generateOtp}