function switchForm(tableId){
    form = document.getElementById(tableId)
    form.hidden = !form.hidden;
}

let userController = new UserController('form-user-create', 'userList')


