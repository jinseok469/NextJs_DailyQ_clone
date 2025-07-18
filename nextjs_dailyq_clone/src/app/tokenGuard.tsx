"use client";
import { useEffect } from "react";
import { useRouter,usePathname } from "next/navigation";
const TokenGuard = ({ children }: { children : React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(pathname !== "/login"){

    if (!token) {
      router.push("/login");
    }
}

  }, [router,pathname]);
  return <div>{children}</div>;
};

export default TokenGuard;