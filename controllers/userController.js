class UserController{
    constructor(fromId, fromUpdateId, tableId){
        this.formEl = document.getElementById(fromId);
        this.formUpdateEl = document.getElementById(fromUpdateId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit(this.formEl);
        this.onEdit();
    }

    onSubmit(form){
        form.addEventListener('submit', event=>{
            event.preventDefault();
            let btn  = form.querySelector('[type = submit]');
            btn.disabled = true; 
            let values = this.getValues(form);
            this.getPhoto().then((content)=>{    
                values.photo = content;
                form.reset();
                btn.disabled = false; 
                this.addLine(values);
            }, e=>{
                console.error(e);
            })
        })
    }
    
    onEdit(){
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e=>{
            switchForm('box-user-update',false);
        })
    }

    getPhoto(){
        return new Promise((resolve, reject)=>{
            let fileReader = new FileReader();
            let element = [...this.formEl.elements].filter(item=>{
                if(item.name === 'photo') return item
            });
            fileReader.onload = ()=>{
                resolve(fileReader.result)
            };
            fileReader.onerror = e=>{
                reject(e)
            }
            let file = element[0].files[0]
            if(file)fileReader.readAsDataURL(file)
            else resolve('dist/img/boxed-bg.jpg')
            
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


    updateCount(){
        let user = document.getElementById("user-count");
        let adm = document.getElementById("admin-count");
        user.innerHTML = ''
        adm.innerHTML = ''
    }

    updateLine(user,element){
        element.innerHTML = `
            <td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            ${user.admin ? '<td>Sim</td>': '<td>Não</td>'}
            <td>${user.register.toLocaleDateString()}</td>
            <td>
              <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
              <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>`;
        return element
    }

    addLine(user){
        let append = true;
        let tr = document.createElement('tr');
        tr = this.updateLine(user,tr);
        tr.querySelector('.btn-edit').addEventListener('click', e=>{
            switchForm('form-user-create',true);
            switchForm('box-user-update',false);
            let form = document.getElementById('form-user-update');
            for(let [key,value] of Object.entries(user)){
                key = key.replace('_','');
                if(key == 'register') continue
                else if(form[key].type == 'file'){}
                else if(form[key].type == 'radio' || form[key].type == 'checkbox') form[key].checked = true
                else form[key].value = value;
            };
        });
        this.formUpdateEl.addEventListener('submit', event=>{
            event.preventDefault();
            console.log('ok')
            tr = this.updateLine(this.getValues(this.formUpdateEl), tr);
            this.tableEl.appendChild(tr);
        });
                
        this.tableEl.appendChild(tr);
    }
};

function switchForm(tableId, manualUpdate){
    form = document.getElementById(tableId);
    form.hidden = !form.hidden;
    if(manualUpdate){
        let btn = document.getElementById('switch');
        btn.checked = !btn.checked;
    } 
}