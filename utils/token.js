const jwt=require('jsonwebtoken');

const genarateToken= async (id)=>{
    return await jwt.sign({id},process.env.JWT_SECRET,
        {expiresIn:'1d'})
}
module.exports = genarateToken