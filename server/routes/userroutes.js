import expresss from 'express';
import {signup} from "../controllers/userController.js"
const userRouter =expresss.Router();
userRouter.post("/signup",signup);
userRouter.post("/login",login);
userRouter.post("/update-profile",protectRoute,updateProfile);
userRouter.get("/check",protectRoute,checkAuth);
export default useRouter