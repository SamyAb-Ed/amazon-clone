import React, {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context/DataProvider';
import { AuthContext } from '../../Context/AuthProvider';

const ProtectedRoute = ({children, msg, redirect}) => {
    
    
    const navigate = useNavigate();
    const [{ user }, dispatch] = useContext(DataContext);

    useEffect(() => {
        if (!user) {
            navigate("/auth", { state: { msg, redirect } });
        }
    },[user]);




  return (
    <div>
      
    </div>
  )
}

export default ProtectedRoute
