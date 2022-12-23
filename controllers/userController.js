class UserController{
    constructor(fromId, fromUpdateId, tableId){
        this.formEl = document.getElementById(fromId);
        this.formUpdateEl = document.getElementById(fromUpdateId);
        this.tableEl = document.getElementById(tableId);
        this.defaultImage = 'dist/img/boxed-bg.jpg';
        this.startStorage();
        this.showUsers();
        this.onSubmit(this.formEl);
        this.onEdit();
    };

    closeCreate(boolean){
        this.formEl.hidden = boolean;
        document.getElementById('switch').checked = !boolean
    }

    closeUpdate(boolean){
        document.getElementById('box-user-update').hidden = boolean;
    }
    
    startStorage(){
        if(!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify({}));
        if(!window.id) window.id = 0;
    }

    showUsers(){
        let users = JSON.parse(localStorage.getItem('users'))

        users.forEach(user=>{
            user = user.value;
            let element = this.createLine(value,'tr',true);
            this.addTableListener(value,element);
            this.tableEl.appendChild(element); 

        })
    }

    onSubmit(form){
        form.addEventListener('submit', event=>{
            event.preventDefault();
            let btn  = form.querySelector('[type = submit]');
            btn.disabled = true; 
            let user = this.getValues(form);
            this.getPhoto(this.formEl, this.defaultImage).then((content)=>{    
                user.photo = content;
                form.reset();
                btn.disabled = false; 
                let tr = this.createLine(user,'tr');
                this.addTableListener(user,tr);
                user.save();
                this.showUsers();
            }, e=>{
                console.error(e);
            })
        })
    };
    
    onEdit(){
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e=>{
            switchForm('box-user-update',false);
        });
        this.formUpdateEl.addEventListener('submit', event=>{
            event.preventDefault();
            let user = this.getValues(this.formUpdateEl);
            let oldUser = JSON.parse(this.formUpdateEl.dataset.oldUser);
            this.getPhoto(this.formUpdateEl, oldUser._photo).then((content)=>{
                let tr = this.tableEl.rows[this.formUpdateEl.dataset.trIndex];
                user.photo = content;
                this.formUpdateEl.reset();
                tr.innerHTML = this.addTableHtml(user,false);
                this.addTableListener(user,tr);
                this.closeUpdate(true);
            }, e=>{
                console.error(e);
            })
        });
    };

    getPhoto(form, defaultImg){
        return new Promise((resolve, reject)=>{
            let fileReader = new FileReader();
            let element = [...form.elements].filter(item=>{
                if(item.name === 'photo') return item
            });
            fileReader.onload = ()=>{
                resolve(fileReader.result)
            };
            fileReader.onerror = e=>{
                reject(e)
            }
            let file = element[0].files[0];
            if(file)fileReader.readAsDataURL(file);
            else resolve(defaultImg);
        })
    }
    
    getValues(form){
        let isValid = true;   
        let newUser = {};
        [...form.elements].forEach((field)=>{
            if(['name', 'email', 'password'].includes(field.name) && !field.value){
                field.parentElement.classList.add('has-error');
                isValid = false;    
            } else if (field.name === 'gender' && !field.checked){}
            else{
                if(field.name === 'admin'){
                    if(field.checked) field.value = true
                    else field.value = ''
                }
                newUser[field.name] = field.value;
            }
            if(!isValid) return false
        });
        return new User(newUser)
    }

    static updateCount(){
        let user = document.getElementById("user-count");
        let adm = document.getElementById("admin-count");
        user.innerHTML = ''
        adm.innerHTML = ''
    }

    addTableHtml(user,storage){
        let btns = 
            `<td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>`;

        if(storage){
            return `<td><img src="${user._photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${user._name}</td>
            <td>${user._email}</td>
            ${user._admin ? '<td>Sim</td>': '<td>Não</td>'}
            <td>${new Date(user._register).toLocaleDateString()}</td>` + btns 
        } else {
            return `<td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            ${user.admin ? '<td>Sim</td>': '<td>Não</td>'}
            <td>${user.register.toLocaleDateString()}</td>` + btns;
        }
    }

    createLine(user,element,storage){
        element = document.createElement(element);
        element.innerHTML =  this.addTableHtml(user,storage) 
        return element
    }

    addTableListener(user,element){
        element.querySelector('.btn-delete').addEventListener('click', e=>{
            if(confirm('Deseja realmente excluir?')){
                element.remove();
                //this.updateCount();
            }
        });
        element.querySelector('.btn-edit').addEventListener('click', e=>{
            this.closeCreate(true);
            this.closeUpdate(false);
            let form = document.getElementById('form-user-update');
            form.dataset.trIndex = element.sectionRowIndex;
            form.dataset.oldUser = JSON.stringify(user);
            for(let [key,value] of Object.entries(user)){
                key = key.replace('_','');
                if(key == 'register') continue
                else if(form[key].type == 'file'){}
                else if(form[key].type == 'radio' || (form[key].type == 'checkbox' && form[key].checked)) form[key].checked = true
                else form[key].value = value;
            };
        });     
    }
};
;
