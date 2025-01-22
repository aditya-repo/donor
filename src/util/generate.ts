const generateOtp = (digit: number) : number =>{
    const number = 10 ** digit 
    const smallnumber = 10 ** (digit -1)
    return Math.floor(((number - smallnumber) * Math.random() ) + smallnumber)
}

export {generateOtp}
