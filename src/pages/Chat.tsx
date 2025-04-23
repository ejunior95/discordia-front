import { ChatBody } from "@/custom-components/ChatBody"
import { Navbar } from "@/custom-components/Navbar"
import { useAuth } from "@/hooks/useAuth";
import { getUserInfo } from "@/services/auth.service";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Chat () {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
          const user = await getUserInfo();
          if (user) {
            setUser(user);
          } else {
            navigate('/login');
          }
        };
        fetchUser();
      }, []);
      

    return(
        <>
            <Navbar />
            <section className='w-full flex-col justify-items-center'>
                <ChatBody />
            </section>
        </>
    )
}