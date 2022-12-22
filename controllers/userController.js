class UserController{
    constructor(fromId, tableId){
        this.formEl = document.getElementById(fromId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
    }

    onSubmit(){
        this.formEl.addEventListener('submit', event=>{
            event.preventDefault();
            let values = this.getValues();
            this.getPhoto(content => {
                values.photo = content;
                this.addLine(values);
            })
        })
    }
    
    getPhoto(callback){
        let fileReader = new FileReader();
        let element = [...this.formEl.elements].filter(item=>{
            if(item.name === 'photo') return item
        });
        fileReader.onload = ()=>{
            callback(fileReader.result)
        };
        fileReader.readAsDataURL(element[0].files[0])
    }
    
    
    getValues(){   
        let newUser = {};
        [...this.formEl.elements].forEach((field)=>{
            if(field.name === 'gender' && !field.checked){}
            else{
                if(field.name === 'admin'){
                    if(field.checked) field.value = 'Sim'
                    else field.value = 'Não' 
                }
                newUser[field.name] = field.value;
            }
        });
        return new User(newUser)
    }

    addLine(user){
        this.tableEl.innerHTML +=`
          <tr>
            <td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.admin}</td>
            <td>${user.birth}</td>
            <td>
              <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
              <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
          </tr>`;
    }
}