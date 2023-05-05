import React from 'react'
import Navbar from './Navbar'
import Search from './Search'
import Chats from './Chats'
import { useChatContext } from '../Context/ChatContext'

const SideBar = () => {
  const {data} = useChatContext()!

  return (
    <div className="sidebar" style={{display: data.chatId !== "" ? "none" : "block"}}>
      <Navbar/>
      <Search/>
      <Chats/>
    </div>
  )
}

export default SideBar