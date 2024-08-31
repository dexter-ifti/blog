import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import {Signup, Signin, Blog, Blogs} from './pages'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup/>} ></Route>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/signin' element = {<Signin/>} />
          <Route path='/blog/:id' element = {<Blog/>} />
          <Route path='/blogs' element = {<Blogs/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
