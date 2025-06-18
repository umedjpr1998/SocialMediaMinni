import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PhotoContext } from './PhotoContext';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function HomePage() {
  const { photos, setPhotos } = useContext(PhotoContext);
  const [user, setUser] = useState('');
  const [showDetails, setShowDetails] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      navigate('/login');
    } else {
      setUser(loggedInUser.name);
      const userPhotosKey = `photos_${loggedInUser.name}`;
      const userPhotos = JSON.parse(localStorage.getItem(userPhotosKey)) || [];
      setPhotos(userPhotos);
    }
  }, [navigate, setPhotos]);


  const handleLike = (index) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo, i) =>
        i === index ? { ...photo, likes: photo.likes + 1 } : photo
      )
    );
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const handleRemove = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleEdit = (photo, index) => {
    setEditingPhoto({ photo, index });
    setNewTitle(photo.title);
    setNewUrl(photo.url);
  };

  const handleSaveEdit = () => {
    if (editingPhoto) {
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo, i) =>
          i === editingPhoto.index
            ? { ...photo, title: newTitle, url: newUrl }
            : photo
        )
      );
      setEditingPhoto(null);
      setNewTitle('');
      setNewUrl('');
    }
  };

  return (
    <div>
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '55px', zIndex: 100, display: 'flex', fontFamily: 'cursive',
        justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#6E6E6E', color: '#fff',
      }}>
        <h1 style={{ color: 'aqua' }}>Chopal</h1>
        <div style={{ display: 'flex', alignItems: 'center', }}>

          <Link to="/add-photo" style={{
            marginRight: '10px', padding: '0px 20px', fontFamily: 'cursive',
            color: '#fff', textDecoration: 'none', height: '37px', fontSize: '23px', border: '2px solid white ', borderRadius: '5px'
          }}>
            Add Photo
          </Link>
          <span style={{ marginRight: '20px', fontFamily: 'cursive', color: '#fff', marginLeft: '100px' }}>
            Welcome, <FontAwesomeIcon color='aqua' icon={faUser} /> {user}
          </span>

          <button onClick={handleLogout} style={{
            padding: '0px 10px', backgroundColor: '#e82112', color: '#fff', fontFamily: 'cursive',
            border: 'none', borderRadius: '5px', cursor: 'pointer', height: '35px', fontSize: '16px'
          }}> Logout </button>
        </div>
      </nav>
      <div style={{ padding: '80px 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', }}>
          {photos.map((photo, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc', borderRadius: '10px', padding: '10px',
                textAlign: 'center', backgroundColor: '#f9f9f9', position: 'relative',
              }}>
              <img
                src={photo.url}
                alt={photo.title}
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '10px', }} />
              <h3 style={{ fontFamily: 'cursive', marginTop: '10px' }}>{photo.title}</h3>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => handleLike(index)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: 'red', }}>
                    ❤️
                  </button>
                  <span
                    style={{ marginLeft: '5px', fontSize: '16px', color: '#555', }}>
                    {photo.likes}
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() =>
                      setDropdownVisible((prev) => prev === index ? null : index)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', }}> ⋮ </button>
                  {dropdownVisible === index && (
                    <div
                      style={{
                        position: 'absolute', top: '30px', right: '0', backgroundColor: '#fff',
                        border: '1px solid #ccc', borderRadius: '5px', zIndex: 100, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                      }}>
                      <button
                        onClick={() => {
                          setShowDetails(photo);
                          setDropdownVisible(null);
                        }}
                        style={{
                          display: 'block', width: '100%', padding: '10px', textAlign: 'left',
                          background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #ccc',
                        }}>
                        Details
                      </button>
                      <button
                        onClick={() => {
                          handleEdit(photo, index);
                          setDropdownVisible(null);
                        }}
                        style={{
                          display: 'block', width: '100%', padding: '10px',
                          textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #ccc',
                        }}>
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleRemove(index);
                          setDropdownVisible(null);
                        }}
                        style={{
                          display: 'block', width: '100%', padding: '10px',
                          textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                        }}>
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showDetails && (
          <div
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff',
              border: '1px solid #ccc', padding: '20px', borderRadius: '10px', zIndex: 200, width: '400px',
            }}>
            <h2>Photo Details</h2>
            <p><strong>Title:</strong> {showDetails.title}</p>
            <p>
              <strong>URL:</strong>
              <span style={{ display: 'block', wordWrap: 'break-word', color: '#007BFF', }}>
                {showDetails.url}
              </span>
            </p>
            <p><strong>name:</strong> {user}</p>
            <p><strong>Date:</strong> {showDetails.date}</p>
            <button
              onClick={() => setShowDetails(null)}
              style={{
                marginTop: '10px', padding: '5px 10px',
                backgroundColor: '#FF0000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer',
              }}>
              Close
            </button>
          </div>
        )}

        {editingPhoto && (
          <div
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff',
              border: '1px solid #ccc', padding: '20px', borderRadius: '10px', zIndex: 200, width: '400px',
            }}>
            <h2>Edit Photo</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Edit Title"
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', }} />
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Edit URL"
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', }} />
            <button
              onClick={handleSaveEdit}
              style={{
                marginRight: '10px', padding: '5px 10px', backgroundColor: '#28a745',
                color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer',
              }}> Save </button>
            <button
              onClick={() => setEditingPhoto(null)}
              style={{
                padding: '5px 10px', backgroundColor: '#FF0000',
                color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer',
              }}> Cancel </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;

