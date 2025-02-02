import { useEffect } from "react";
import { API_URL } from "../../../config";
import { logOut } from "../../../redux/userRedux";
import { useDispatch } from "react-redux";

const Logout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const option = {
            method: 'DELETE'
        };
        fetch(`${API_URL}auth/logout`, option)
        .then(() => {
            dispatch(logOut());
        });
    }, [dispatch]);

    
    return null
};

export default Logout;