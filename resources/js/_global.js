export default class Global {
    initialize() {
        this.moveConsultantUser();
    }

    moveConsultantUser() {
        const selectedUsersTbody = document.getElementById('selected-users-tbody');
        let btns = document.getElementsByClassName('btn-move');

        // Agregar fila de aviso de que no hay usuarios seleccionados
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
                            console.log('No hay consultores disponibles');
                            let tr = document.createElement('tr');
                            tr.innerHTML = `
                                    <td id="avalaible-empty-row">No hay consultores disponibles</td>
                                `;
                            avaliableUsersTbody.appendChild(tr);
                        }
                    }

                    // remover el usuario de la tabla de consultores disponibles
                    const trAvaliable = document.getElementById(co_usuario);
                    if (trAvaliable != null) {
                        trAvaliable.remove();
                    }

                    // obtener datos del usuario seleccionado 
                    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                    fetch(`/consultant-users/${co_usuario}`, {
                        method: 'GET',
                        headers: {
                            'X-CSRF-TOKEN': token,
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        const idUser = data.data.co_usuario;
                        const nameUser = data.data.no_usuario;

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
                    fetch(`/consultant-users/${co_usuario}`, {
                        method: 'GET',
                        headers: {
                            'X-CSRF-TOKEN': token,
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        const idUser = btn.parentNode.parentNode.id;
                        const nameUser = data.data.no_usuario;

                        // remover el usuario de la tabla de usuarios seleccionados
                        const trSelected = document.getElementById(idUser);
                        if (trSelected != null) {
                            trSelected.remove();
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

}