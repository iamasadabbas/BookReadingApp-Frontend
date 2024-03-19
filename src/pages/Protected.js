import { AnnotationEditorUIManager } from 'pdfjs-dist'
import React, { Component, useEffect, useState, } from 'react'
import { useNavigate, Outlet, Route,Routes } from 'react-router-dom'
import Book from './Book'
import Login from './Login'
import PdfView from './pdfView'

export default function Protected(props) {
    const [role, setRole] = useState('')
    const navigate = useNavigate();

    useEffect(() => {

        const role = localStorage.getItem('role')

        setRole(role)
    })
    if (!role) {
        navigate('/profile')

    } else if (role === 'admin') {

        return (
            <div><Outlet /></div>
        )
    } else if (role === 'user') {
        return (
            <div>
                <Routes>
                    <Route path="/book" element={<Book />} />
                    <Route path="/profile" element={<Login />} />
                    <Route path="/view" element={<PdfView />} />
                </Routes>
            </div>
        )
    }
    return (
        <div>only amdin can access
        </div>
    )
}



