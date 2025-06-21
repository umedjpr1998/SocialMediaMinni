import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PhotoContext } from './PhotoContext';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './addphoto.css';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

function AddPhotoPage() {
  const [photoFile, setPhotoFile] = useState(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [user, setUser] = useState('');
  const { setPhotos } = useContext(PhotoContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      setUser(JSON.parse(loggedInUser).name); // Set user name
    }
  }, [navigate]);

  const addPhoto = async () => {
    if (photoFile && photoTitle) {
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('title', photoTitle);

      setLoading(true); // Start loading

      try {
        // const response = await fetch('http://localhost:5000/api/photos/upload',
        const response = await fetch('https://socialmediaminni.onrender.com/api/photos/upload',
          {
            method: 'POST',
            body: formData,
          });

        const data = await response.json();

        if (response.ok) {
          const loggedInUser = JSON.parse(localStorage.getItem('user'));
          const userPhotosKey = `photos_${loggedInUser.name}`;
          const existingPhotos = JSON.parse(localStorage.getItem(userPhotosKey)) || [];

          const newPhoto = {
            id: Date.now(),
            url: data.photo.url, // Ensure this matches your backend response
            title: photoTitle,
            likes: 0,
            date: new Date().toLocaleString(),
            username: loggedInUser.name,
          };

          const updatedPhotos = [...existingPhotos, newPhoto];
          localStorage.setItem(userPhotosKey, JSON.stringify(updatedPhotos));
          setPhotos(updatedPhotos);

          // Show success toast
          toast.success('Photo uploaded successfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setPhotoTitle('');
          setPhotoFile(null);
          navigate('/home');
        } else {
          alert('Upload failed: ' + data.message);
        }
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      alert("Please select a photo and enter a title");
    }
  };




  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data
    navigate('/login'); // Navigate to login page
  };

  return (
    <div>
      <ToastContainer /> {/* Add ToastContainer here */}

      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '55px',
          zIndex: 100,
          display: 'flex',
          fontFamily: 'cursive',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: '#6E6E6E',
          color: '#fff',
        }}
      >
        <h1 style={{ color: 'aqua' }}>Chopal</h1>
        <h1>
          <Link
            to="/home"
            style={{
              color: 'white',
              textDecoration: 'none',
              marginLeft: '700px',
              padding: '0px 20px',
              fontFamily: 'cursive',
              border: '2px solid white ',
              borderRadius: '5px',
              fontSize: '25px',
            }}
          >
            Home
          </Link>
        </h1>
        <div>
          <span style={{ marginRight: '20px', fontFamily: 'cursive', color: '#fff', marginLeft: '100px' }}>
            Welcome, <FontAwesomeIcon color='aqua' icon={faUser} /> {user}
          </span>
          <button onClick={handleLogout} style={{
            padding: '0px 10px', backgroundColor: '#e82112', color: '#fff', fontFamily: 'cursive',
            border: 'none', borderRadius: '5px', cursor: 'pointer', height: '35px', fontSize: '16px'
          }}> Logout </button>
        </div>
      </nav>
      <div style={{ marginTop: '90px' }}>
        <div
          className="addphoto border border-1 w-25 m-auto mb-4 pb-5"
          style={{ borderRadius: '5px', backgroundColor: '#c5aa6a' }}
        >
          <h1
            className="alert alert-dark text-center"
            style={{
              fontFamily: 'cursive',
              backgroundColor: '#6E6E6E',
              letterSpacing: '5px',
            }}
          >
            Add Photo
          </h1>
          <form>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="file"
                accept="image/*"
                className="form-control m-auto mb-4"
                onChange={(e) => setPhotoFile(e.target.files[0])}
                style={{
                  width: '98%',
                  height: '50px',
                  padding: '10px',
                  fontFamily: 'cursive',
                }}
              />

              <input
                type="text"
                placeholder="Enter photo title"
                className="form-control m-auto mb-4"
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                style={{ fontFamily: 'cursive', width: '98%' }}
              />
              <div className="w-50 m-auto mb-0 pb-0">
                <button
                  className="btn btn-sm btn-dark mt-5 w-50 d-flex m-auto justify-content-center"
                  onClick={(e) => {
                    e.preventDefault();
                    addPhoto();
                  }}
                  style={{ fontFamily: 'cursive' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" /> Uploading...
                    </>
                  ) : (
                    'Add Photo'
                  )}
                </button>

              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPhotoPage;