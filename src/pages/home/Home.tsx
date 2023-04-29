import SideBar from '../../components/SideBar'
import Chat from '../../components/Chat'

const Home = () => {
  return (
    <div className="home">
      <div className="container">
        <SideBar/>
        <Chat/>
      </div>
    </div>
  )
}

export default Home