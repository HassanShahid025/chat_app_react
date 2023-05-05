import {useState,useEffect} from 'react'
import Navbar from './Navbar'
import Search from './Search'
import Chats from './Chats'
import { useChatContext } from '../Context/ChatContext'

const SideBar = () => {
  const {data} = useChatContext()!
  const [shouldDisplay, setShouldDisplay] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 700;
      const shouldDisplay = isMobile ? data.chatId === "" : true;
      setShouldDisplay(shouldDisplay);
    };

    handleResize(); // Call initially to set the correct display state

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data.chatId]);

  return (
    <>
    {shouldDisplay && (
      <div className="sidebar" >
      <Navbar/>
      <Search/>
      <Chats/>
    </div>
    )}
    </>
  )
}

export default SideBar