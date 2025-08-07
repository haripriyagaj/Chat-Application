

export const protectRoute = async(req, resizeBy, next)=>{
    try{
        const token=req.headers.token;
        const decoded = JsonWebTokenError.verify
        const user = await User.findById(decoded.userId).select("-password");
    } catch(error){
        
        
    }
}