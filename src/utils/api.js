export class Api{
    constructor(token){
        this._token = token;
        this._headers = {
            'Content-Type': 'application/json',
            authorization: this._token
        }
    }

    _checkResponse(res){
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка ${res.status}`);
        }

    getUserData(){
        return fetch('https://nomoreparties.co/v1/cohort-43/users/me',{
            headers: this._headers,
            method: 'GET'
        })
        .then(this._checkResponse) 
    }



    updateUserData(user){
        const body = {
            name: user.name,
            about: user.about
        };
        return fetch('https://mesto.nomoreparties.co/v1/cohort-43/users/me',{
            headers: this._headers,
            method: 'PATCH',
            body: JSON.stringify(body),
        })
        .then(this._checkResponse) 
    }

    getCardsData(){
        return fetch('https://mesto.nomoreparties.co/v1/cohort-43/cards',{
            headers: this._headers,
        })
        .then(this._checkResponse) 
      
    }

    addCard(card){
        const body = {
            name: card.name,
            link: card.link
        };
        return fetch('https://mesto.nomoreparties.co/v1/cohort-43/cards',{
            headers: this._headers,
            method: 'POST',
            body: JSON.stringify(body),
        })
        .then(this._checkResponse) 
    }

    deleteCard(cardId){
        return fetch('https://mesto.nomoreparties.co/v1/cohort-43/cards/'+ cardId,{
            headers: this._headers,
            method: 'DELETE'
        })
        .then(this._checkResponse) 
    }

    updateLike(cardId, method){
        return fetch(`https://mesto.nomoreparties.co/v1/cohort-43/cards/${cardId}/likes`,{
            headers: this._headers,
            method,
        })
        .then(this._checkResponse) 
    }

    updateAvatar(user){
        const body = {
            avatar: user.avatar
        };
        return fetch('https://mesto.nomoreparties.co/v1/cohort-43/users/me/avatar' ,{
            headers: this._headers,
            method: 'PATCH',
            body: JSON.stringify(body),
        })
        .then(this._checkResponse) 
    }


}

export const api = new Api('8e904e2d-1e9e-4822-a1dc-ac070e02dd13');