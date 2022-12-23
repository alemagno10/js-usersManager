class User{
    constructor(data){
        this._name = data.name
        this._gender = data.gender
        this._country = data.country
        this._email = data.email
        this._password = data.password
        this._photo = data.photo
        this._admin = data.admin
        this._birth = data.birth
        this._register = new Date();
    }
    
    get name(){return this._name}
    set name(value){this._name = value}

    get gender(){return this._gender}
    set gender(value){this._gender = value}

    get register(){return this._register}
    set register(value){this._register = value}

    get country(){return this._country}
    set country(value){this._country = value}

    get email(){return this._email}
    set email(value){this._email = value}

    get password(){return this._password}
    set password(value){this._password = value}

    get photo(){return this._photo}
    set photo(value){this._photo = value}

    get admin(){return this._admin}
    set admin(value){this._admin = value}

    get birth(){return this._birth}
    set birth(value){this._birth = value}
}
