import React,{useEffect,useState } from 'react'
import axiosInstance from './axiosInstance';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
let config = {
    headers: { 'Content-Type': 'application/json' },
}


const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';


export default function PdfView() {
    const [pageNumber, setPageNumber] = useState(1);
    const [url, setUrl] = useState('');
    const [bookId, setBookId] = useState('');
    const [userId, setUserId] = useState('');
    const [bookmarkedPage, setBookmarkedPage] = useState(2);

    useEffect(() => {
        const urlFromStorage = localStorage.getItem('url');
        const bookIdFromStorage = localStorage.getItem('bookId');
        const userIdFromStorage = localStorage.getItem('userId');
        const bookmarkedPageFromStorage = localStorage.getItem('bookmarkedPage');

        if (urlFromStorage && bookIdFromStorage && userIdFromStorage) {
            setUrl(urlFromStorage);
            setBookId(bookIdFromStorage);
            setUserId(userIdFromStorage);
            setBookmarkedPage(parseInt(bookmarkedPageFromStorage, 10));
            // setBookmarkedPage(3)
            // console.log(bookmarkedPage);
            // setBookmarkedPage(bookmakedPageFromStorage);
        }else{
            console.log('not found');
        }
    }, []);

    const addBookmark = async () => {
        const formData = new FormData();

        formData.append('userId', userId);
        formData.append('bookId', bookId);
        formData.append('pageNumber', pageNumber);

        const response = await axiosInstance.post(`${BASE_URL}/bookmark/postbookmark`, formData, config);
        if(response){

            alert('Bookmark added successfully!');
        }
    };

    const handlePageChange = (page) => {
        setPageNumber(page + 1);
    };

    return (
        <div>
            <div style={{ position: 'relative' }}>
                {!url == '' ? (
                    <div style={{ height: '720px' }}>
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <Viewer
                                // key={bookmarkedPage}
                                fileUrl={url}
                                initialPage={bookmarkedPage-1}
                                // startPage={2}
                                // defaultPage={1}
                                // currentPage={2}
                                onPageChange={(event) => {
                                    handlePageChange(event.currentPage);
                                }
                            }
                            />
                        </Worker>
                        {/* Floating Page number */}
                        <div style={{ position: 'absolute', top: '2%', left: '5%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
                            <p>Page: {pageNumber}</p>
                        </div>
                        {/* Floating Add Bookmark button */}
                        <div style={{ position: 'absolute', top: '1%', right: '4%', zIndex: 9999 }}>
                            <button onClick={addBookmark}>Add Bookmark</button>
                        </div>
                        {/* <p>{bookmarkedPage}</p> */}
                    </div>
                ) : (<p>no viewer</p>)}
            </div>
        </div>
    );
}
