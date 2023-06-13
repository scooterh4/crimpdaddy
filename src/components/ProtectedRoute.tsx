import React from 'react'
import { Navigate } from "react-router-dom";
import { toast } from 'react-toastify';

export type ProtectedRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
  outlet: JSX.Element;
};

function ProtectedRoute({isAuthenticated, authenticationPath, outlet}: ProtectedRouteProps) {
  if(isAuthenticated) {
    return outlet;
  } else {
    toast.error('Nice try! Please login first', 
      { toastId:'niceTry' }
    )

    return <Navigate to={{ pathname: authenticationPath }} />
  }
};

export default ProtectedRoute;
