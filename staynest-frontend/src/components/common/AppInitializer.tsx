import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "../../store/slices/authSlice";
import type { AppDispatch } from "../../store";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const initialized = useRef(false); 

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(getMe());
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;