import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import PopupWithForm from './PopupWithForm';
import React from 'react';
import ImagePopup from './ImagePopup';
import { api } from "../utils/api";
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import * as auth from '../utils/auth'
import InfoTooltip from './InfoTooltip';


function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isPopupClose, setIsPopupClose] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setСurrentUser] = React.useState(null);
  const [cards, setCards] = React.useState([])
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState('');
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false)
  const [authMessage, setAuthMessage] = React.useState(false);

  const history = useHistory();

    const onRegister = (data) => {
      return auth
        .register(data)
        .then(() => {
          setIsInfoTooltipOpen(true);
          history.push('/signin');
          setAuthMessage(true);
        })
        .catch(()=>{
          setIsInfoTooltipOpen(true);
          setAuthMessage(false);
        })
    };

    const tokenCheck = () => {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        return;
      }
      return auth
      .getContent(jwt)
      .then((res) => {
        setUserInfo( res.data.email );
        setIsLoggedIn(true);
      })
      .catch((err) => console.log(err));
      };

    const onLogin = (data) => {
      return auth
        .authorize(data)
        .then((res) => {
          setIsLoggedIn(true);
          localStorage.setItem("jwt", res.token)
          setUserInfo( data.email )
          console.log(userInfo)
        })
        .catch((err) => console.log(err));
    }

    React.useEffect(() => {
      if (isLoggedIn) {
        history.push('/');
      }
    }, [isLoggedIn]);


    React.useEffect(() => {
      tokenCheck();
    }, []);

    const onLogout = () => {
      setIsLoggedIn(false);
      localStorage.removeItem('jwt');
      history.push('/signin');
    };
  

  function handleEditAvatarClick(){
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick(){
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick(){
    setIsAddPlacePopupOpen(true);
  }

 function handleCardClick(card){
    setSelectedCard(card)
  }

  function closeAllPopups(){
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipOpen(false);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    const requestType = isLiked ? 'DELETE' : 'PUT';

    api.updateLike(card._id, requestType)
    .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch(err => {
      console.log(err);
    })
  }

  function handleCardDelete(card) {
    const isOwn = card.owner._id === currentUser._id;
    
    api.deleteCard(card._id)
    .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
    })
    .catch(err => {
      console.log(err);
    })
}

  function handleUpdateUser({ name, about }){
    api.updateUserData({ name, about })
    .then((res)=>{
      setСurrentUser(res)
    })
    .then(()=>{
      closeAllPopups()
    })
    .catch(err => {
      console.log(err);
    })
  }

  function handleUpdateAvatar({ avatar }){
    api.updateAvatar({ avatar })
    .then((res)=>{
      setСurrentUser(res)
    })
    .then(()=>{
      closeAllPopups()
    })
    .catch(err => {
      console.log(err);
    })
  }

  function handleAddPlaceSubmit(card){
    api.addCard(card)
      .then((newCard)=>{
        setCards([newCard, ...cards]); 
      })
      .then(()=>{
        closeAllPopups()
      })
      .catch(err => {
        console.log(err);
      })
    }

  React.useEffect(() => {
    api.getUserData()
      .then(result => {
        setСurrentUser(result);
      })
      .catch(err => {
        console.log(err);
      })
    api.getCardsData()
      .then(result => {
        setCards(result);
      })
      .catch(err => {
        console.log(err);
      })
}, []);


  return (
    <div className="page">
    <CurrentUserContext.Provider value={currentUser}>
    <Header
      onLogout={onLogout}
      email={userInfo}
    />
    <Switch>
    <ProtectedRoute
      component={Main}
      exact path="/"
      isLoggedIn={isLoggedIn}
      onEditAvatar={handleEditAvatarClick}
      onEditProfile={handleEditProfileClick}
      onAddPlace={handleAddPlaceClick}
      onCardClick ={handleCardClick}
      cards = {cards}
      onCardLike = {handleCardLike}
      onCardDelete = {handleCardDelete}

    />
      <ProtectedRoute
      component={Footer}
      exact path="/"
      isLoggedIn={isLoggedIn}
      />

    <Route path="/signup">
      <Register 
        onRegister={onRegister} 
      />
    </Route>
    <Route path="/signin">
      <Login 
        onLogin={onLogin} 
      />
    </Route>
    <Route>
      {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/signup" />}
    </Route>
    </Switch> 

    <InfoTooltip
      isOpen={isInfoTooltipOpen}
      onClose={closeAllPopups}
      auth={authMessage}
      name = "signup"    
    />

    <EditAvatarPopup 
      isOpen={isEditAvatarPopupOpen} 
      onClose={closeAllPopups}
      onUpdateAvatar={handleUpdateAvatar} 
    />
    <EditProfilePopup 
      isOpen={isEditProfilePopupOpen} 
      onClose={closeAllPopups}
      onUpdateUser={handleUpdateUser} 
    />
    <AddPlacePopup
      isOpen={isAddPlacePopupOpen} 
      onClose={closeAllPopups}
      onAddPlace={handleAddPlaceSubmit}
    />
    <PopupWithForm
      name = "place-delete"
      title= "Вы уверены?"
      buttonText = "Да">
    </PopupWithForm>
    <ImagePopup
      name="place-image"
      card={selectedCard}
      onClose={closeAllPopups} 
      />
    </CurrentUserContext.Provider>
  </div>
  );
}

export default App;
