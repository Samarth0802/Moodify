import FaceExpression from './features/Expression/pages/FaceExpression'
import AllRoutes from './AllRoutes'
import AuthContext from './features/Auth/authContext'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      {/* <FaceExpression/> */}
      <AuthContext>
        <AllRoutes/>
      </AuthContext>  
    </>
  )
}

export default App
