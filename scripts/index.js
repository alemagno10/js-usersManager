function switchForm(tableId){
    form = document.getElementById(tableId);
    form.hidden = !form.hidden;
    document.getElementById('box-user-update').hidden = true;
}

let userController = new UserController('form-user-create', 'form-user-update', 'userList')


