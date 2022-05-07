export default class Global {
    initialize() {
        this.moveConsultantUser();
        this.generateReport();
    }

    moveConsultantUser() {
        const selectedUsersTbody = document.getElementById('selected-users-tbody');
        let btns = document.getElementsByClassName('btn-move');

        if (selectedUsersTbody == null) {
            return;
        }

        if (btns == null) {
            return;
        }

        [].forEach.call(btns, function (btn) {
            //Mover usuarios consultantes
            btn.addEventListener('click', () => {
                let tableParent = btn.parentNode.parentNode.parentNode.id;

                if (tableParent == null) {
                    return;
                }

                const co_usuario = btn.parentNode.parentNode.id;
                const avaliableUsersTbody = document.getElementById('available-users-tbody');

                // Mover usuario a la tabla de consultores seleccionados
                if (tableParent == 'available-users-tbody') {

                    // Remover fila vacia si aun existe 
                    const tr = document.getElementById('selected-empty-row');
                    if (tr != null) {
                        tr.remove();
                    }


                    // verificar si no existen usuarios seleccionados
                    if (avaliableUsersTbody == null) {
                        return;
                    } else {
                        let avaliableUsersLength = avaliableUsersTbody.children.length;
                        if (avaliableUsersLength == 1) {
                            let tr = document.createElement('tr');
                            tr.setAttribute('id', 'avalaible-empty-row');
                            tr.innerHTML = `
                                    <td>No hay consultores disponibles</td>
                                `;
                            avaliableUsersTbody.appendChild(tr);
                        }else{
                            const trEmpty = document.getElementById('avalaible-empty-row');
                            if (trEmpty != null) {
                                trEmpty.remove();
                            }
                        }
                    }

                    // remover el usuario de la tabla de consultores disponibles
                    const trAvaliable = document.getElementById(co_usuario);
                    if (trAvaliable != null) {
                        trAvaliable.remove();
                    }

                    // obtener datos del usuario seleccionado 
                    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                    fetch(`/consultant-user/${co_usuario}`, {
                        method: 'GET',
                        headers: {
                            'X-CSRF-TOKEN': token,
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        const idUser = data.data.co_usuario;
                        const nameUser = data.data.no_usuario;
                        // añadir campo oculto con la id del usuario
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = 'selected_users[]';
                        input.value = idUser;
                        input.id = idUser;

                        const form = document.getElementById('form');
                        form.appendChild(input);
                        
                        // añadir usuario a la tabla de usuarios seleccionados
                        const tr = document.createElement('tr');
                        tr.setAttribute('id', idUser);
                        tr.id = idUser;
                        tr.innerHTML = `
                            <td style="vertical-align:middle;">${nameUser}</td>
                        `;

                        const tdBtn = document.createElement('td');
                        tdBtn.setAttribute('align', 'center');

                        if (btn.hasChildNodes() && btn.firstChild) {
                            btn.removeChild(btn.firstChild);
                        }

                        btn.setAttribute('class', 'btn-move btn btn-danger');
                        btn.setAttribute('type', 'button');
                        btn.innerHTML = '<i class="bx bx-chevron-left bx-sm"></i>';
                        tdBtn.appendChild(btn);
                        tr.appendChild(tdBtn);
                        selectedUsersTbody.appendChild(tr);

                        // ordenar tabla de consultores seleccionados por nombre
                        const trs = selectedUsersTbody.children;
                        const trsArray = [];

                        for (let i = 0; i < trs.length; i++) {
                            trsArray.push(trs[i]);
                        }

                        trsArray.sort(function (a, b) {
                            const textA = a.innerText.toUpperCase();
                            const textB = b.innerText.toUpperCase();
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        });

                        for (let i = 0; i < trsArray.length; i++) {
                            selectedUsersTbody.appendChild(trsArray[i]);
                        }
                    });

                    // Mover usuario a la tabla de consultores disponibles
                } else if (tableParent == 'selected-users-tbody') {

                    // obtener datos del usuario seleccionado 
                    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                    fetch(`/consultant-user/${co_usuario}`, {
                        method: 'GET',
                        headers: {
                            'X-CSRF-TOKEN': token,
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        const idUser = btn.parentNode.parentNode.id;
                        const nameUser = data.data.no_usuario;
                        
                        // remover el campo oculto con la id del usuario
                        const input = document.getElementById(idUser);
                        if (input != null) {
                            input.remove();
                        }

                        // remover el usuario de la tabla de usuarios seleccionados
                        const trSelected = document.getElementById(idUser);
                        if (trSelected != null) {
                            trSelected.remove();
                        }

                        // Agregar fila de aviso de que no hay usuarios seleccionados despues de remover todos
                        const selectedUsersLength = selectedUsersTbody.children.length;
                        if (selectedUsersLength == 0) {
                            const tr = document.createElement('tr');
                            tr.setAttribute('id', 'selected-empty-row');
                            tr.innerHTML = `
                                    <td>No ha seleccionado consultores</td>
                                `;
                            selectedUsersTbody.appendChild(tr);
                        }

                        // devolver usuario a la tabla de consultores disponibles
                        const tr = document.createElement('tr');
                        tr.setAttribute('id', idUser);
                        tr.id = idUser;
                        tr.innerHTML = `
                            <td style="vertical-align:middle;">${nameUser}</td>
                        `;

                        const tdBtn = document.createElement('td');
                        tdBtn.setAttribute('align', 'center');

                        if (btn.hasChildNodes() && btn.firstChild) {
                            btn.removeChild(btn.firstChild);
                        }

                        btn.setAttribute('class', 'btn-move btn btn-primary');
                        btn.innerHTML = '<i class="bx bx-chevron-right bx-sm"></i>';
                        tdBtn.appendChild(btn);
                        tr.appendChild(tdBtn);
                        avaliableUsersTbody.appendChild(tr);

                        // remover fila de aviso de que no hay usuarios despues de devolver al menos un usuario
                        let avaliableUsersLength = avaliableUsersTbody.children.length;

                        if(avaliableUsersLength > 1){
                            const trEmpty = document.getElementById('avalaible-empty-row');
                            if (trEmpty != null) {
                                trEmpty.remove();
                            }
                        }
                        
                        // ordenar tabla de consultores disponibles por nombre
                        const trs = avaliableUsersTbody.children;
                        const trsArray = [];

                        for (let i = 0; i < trs.length; i++) {
                            trsArray.push(trs[i]);
                        }

                        trsArray.sort(function (a, b) {
                            const textA = a.innerText.toUpperCase();
                            const textB = b.innerText.toUpperCase();
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        });

                        for (let i = 0; i < trsArray.length; i++) {
                            avaliableUsersTbody.appendChild(trsArray[i]);
                        }

                    });
                }
            });
        });
    }

    generateReport() {
        const btn = document.getElementById('report-btn');
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const selectedUserTbody = document.getElementById('selected-users-tbody');

            if (selectedUserTbody == null) {
                return;
            }

            const selectedUsersRows = selectedUserTbody.children;

            if (selectedUsersRows.length == 0) {
                alert('No hay consultores seleccionados');
                return;
            }


            const selectedIdUsers = [];

            for (let i = 0; i < selectedUsersRows.length; i++) {
                selectedIdUsers.push(selectedUsersRows[i].id);
            }

            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const form = document.getElementById('form');
            form.submit();

        });
    }
}