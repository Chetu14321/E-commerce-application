import { useContext } from "react";

import {AuthContext} from "../Context/AuthContex"

function useAuth(){
    return useContext(AuthContext);  // returns the context object
}
export default useAuth;