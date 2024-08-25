import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Book.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';

let config = {
    headers: { 'Content-Type': 'application/json' },
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export default function Book() {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    const [heading, setHeading] = useState('Add books');
    const [logintext, setLoginText] = useState('');
    const [bookId, setBookId] = useState([]);
    const [bookmarkedPage, setBookmarkedPage] = useState(0);

    const checkBookmark = async (id) => {
        const updatedBookIds = [];
        const userId = localStorage.getItem('userId');
        axiosInstance.get(`${BASE_URL}/bookmark/getbookmark/${userId}`, config).then((response) => {
            for (let index = 0; index < response.data.length; index++) {
                const element = response.data[index];
                updatedBookIds.push(element.bookId);

                if (element?.bookId === id) {
                    setBookmarkedPage(element?.pageNumber);
                } else {
                    console.log('No bookmarked page');
                }
            }
            setBookId(updatedBookIds);
        });
    }

    const handleUpdate = async () => {
        const updatedBook = { title: inputValue, coverImage: selectedImage };
        try {
            await axios.put(`${BASE_URL}/book/updatebook/${editingBook._id}`, updatedBook);
            const response = await axios.get(`${BASE_URL}/book/getallbook`);
            setBooks(response.data);
            setInputValue('');
            setEditingBook(null);
            alert('Book updated successfully');
        } catch (error) {
            console.error('Error updating book:', error);
            alert('Failed to update book');
        }
    }

    const readBook = async (book) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/book/getbookbybookfile/${book.bookFile}`, { responseType: 'arraybuffer' }, config);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            let url = URL.createObjectURL(blob);

            localStorage.setItem('url', url);
            localStorage.setItem('bookId', book._id);
            navigate('/view');
        } catch (error) {
            console.error(error);
        }
    }

    const deleteEntry = (id) => {
        axios.delete(`${BASE_URL}/book/deletebook/${id}`).then(() => {
            axios.get(`${BASE_URL}/book/getallbook`).then((response) => {
                setBooks(response.data);
            });
        }).catch((error) => {
            console.error('Error deleting book:', error);
            alert('Failed to delete book');
        });
    }

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    }

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('title', inputValue);
        formData.append('coverImage', selectedImage);
        formData.append('bookFile', selectedFile);

        try {
            const response = await axios.post(`${BASE_URL}/book/postbook`, formData);
            if (response.status === 200) {
                alert('Data added successfully');
                setInputValue('');
                setSelectedImage(null);
                setSelectedFile(null);
                setHeading('Add books');
            } else {
                console.error("Error while saving data");
            }
        } catch (error) {
            console.error("Error while saving data:", error);
            alert('Failed to add book');
        }
    }

    useEffect(() => {
        axiosInstance.get(`${BASE_URL}/book/getallbook`, config).then((response) => {
            if (response?.data?.message === "Not authorized") {
                setBooks([]);
                setLoginText('login first to see all books');
            } else {
                setBooks(response.data);
            }
        }).catch((error) => {
            console.error('Error fetching books:', error);
        });

        checkBookmark();
    }, []);

    useEffect(() => {
        localStorage.setItem('bookmarkedPage', bookmarkedPage);
    }, [bookmarkedPage]);

    return (
        <div className='body'>
            <div>
                {books.length > 0 && (
                    <>
                        <h2 className='heading'>Books data</h2>
                        <div className='container'>
                            {books?.map((book) => (
                                <div className="card" key={book._id}>
                                    <img src={`${BASE_URL}/uploads/bookCoverImage/${book.coverImage}`} alt="Book Cover" />
                                    <div className="container-book">
                                        <h2 className='book-title'>{book.title}</h2>
                                        <button className='button' onClick={() => readBook(book)}>Read</button>
                                        {bookId.includes(book._id) && (
                                            <button className='button' onClick={() => { checkBookmark(book._id); readBook(book); }}>
                                                Continue Reading
                                            </button>
                                        )}
                                        {role === "admin" && (
                                            <button className='button' onClick={() => deleteEntry(book._id)}>Delete</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {role === "admin" && (
                    <div>
                        <h1 className='heading'>{heading}</h1>
                        <div className='container'>
                            <form onSubmit={editingBook ? handleUpdate : handleSubmit} className='large-form'>
                                <label className='label'>Title</label>
                                <input className='input' required type='text' value={inputValue} onChange={handleChange} placeholder='Enter title here' />
                                <br />
                                <label className='label'>Cover Image</label>
                                <input className='input' required type='file' onChange={handleImageChange} />
                                <label className='label'>File</label>
                                <input className='input' required type='file' onChange={handleFileChange} />
                                <button className='button' type='submit'>{editingBook ? 'Update' : 'Submit'}</button>
                            </form>
                        </div>
                    </div>
                )}

                {books.length === 0 && role !== "admin" && (
                    <div>
                        <h2 className='heading'>{logintext || 'No books available'}</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
