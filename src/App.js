// src/App.js
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import User from './pages/User';
import Book from './pages/Book';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Registration from './pages/Signup';
import ForgetPassword from './pages/Forget';
import PdfView from './pages/pdfView';
import Protected from './pages/Protected';
import Role from './pages/role';
import Task from './pages/tasks';
import ManageTask from './pages/manageTask';
import RoleTaskEdit from './pages/RoleTaskEdit';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={< Home />} />
          <Route path="/view" element={<PdfView />} />
          <Route path="/role" element={<Role />}/>
          <Route path="/task" element={<Task />}/>
          <Route path="/managetask" element={<ManageTask />}/>
          <Route path="/roletaskedit" element={<RoleTaskEdit />}/>
            <Route element={<Protected />}>

              <Route path="/user" element={<User />} />
              <Route path="/book" element={<Book />} />

            </Route>
            <Route path="/profile" element={<Login />} />
            <Route path="/signup" element={<Registration />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="*" element={<div>page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
