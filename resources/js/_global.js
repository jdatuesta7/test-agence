export default class Global {
    initialize() {
        this.getConsultantUser();
    }

    getConsultantUser() {
        const selectedUsersTbody = document.getElementById('selected-users-tbody');
        const btnsAdd = document.getElementsByClassName('btn-add-user');

        if (selectedUsersTbody == null) {
            return;
        } else {
            const selectedUsersLength = selectedUsersTbody.children.length;
            if (selectedUsersLength == 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                        <td id="selected-empty-row">No ha seleccionado consultores</td>
                    `;
                selectedUsersTbody.appendChild(tr);
            }
        }

        if (btnsAdd == null) {
            return;
        }

        [].forEach.call(btnsAdd, function (btn) {
            btn.addEventListener('click', () => {
                const tr = document.getElementById('selected-empty-row');
                if(tr != null){
                    tr.remove();
                }

                let avaliableUsersTbody = document.getElementById('available-users-tbody');

                if (avaliableUsersTbody == null) {
                    return;
                }else{
                    let avaliableUsersLength = avaliableUsersTbody.children.length;
                    console.log(avaliableUsersLength);
                    if (avaliableUsersLength == 1) {
                        console.log('No hay consultores disponibles');
                        let tr = document.createElement('tr');
                        tr.innerHTML = `
                                <td id="avalaible-empty-row">No hay consultores disponibles</td>
                            `;
                        avaliableUsersTbody.appendChild(tr);
                    }
                }

                // const trAvalaibleEmpty = document.getElementById('avalaible-empty-row');
                // if(avaliableUsersLength == 1 && trAvalaibleEmpty != null){
                //     trAvalaibleEmpty.remove();
                // }

                const co_usuario = btn.parentNode.parentNode.id;
    
                const trAvaliable = document.getElementById(co_usuario);
                if(trAvaliable != null){
                    trAvaliable.remove();
                }
                
                const co_usuario_split = co_usuario.split('-');
                const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                fetch(`/consultant-users/${co_usuario_split[1]}`, {
                    method: 'GET',
                    headers: {
                        'X-CSRF-TOKEN': token,
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.data);

                        if (selectedUsersTbody == null) {
                            return;
                        }

                        const tr = document.createElement('tr');
                        tr.id = data.data.co_usuario;
                        tr.innerHTML = `
                        <td style="vertical-align:middle;">${data.data.no_usuario}</td>
                        <td align="center"><button class="btn btn-danger"> <i class='bx bxs-user-minus bx-sm' ></i></button></td>
                        `;
                        selectedUsersTbody.appendChild(tr);

                        

                    });
            });
        });

    }


}