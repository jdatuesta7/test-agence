import Chart from 'chart.js/auto';

export default class Global {
    initialize() {
        this.moveConsultantUser();
        this.generateReport();
        this.showGraph();
        this.showPizzaGraph();
    }

    moveConsultantUser() {
        const selectedUsersTbody = document.getElementById('selected-users-tbody');
        let btns = document.getElementsByClassName('btn-move');

        if (selectedUsersTbody == null || btns == null) {
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
                        } else {
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

                            if (avaliableUsersLength > 1) {
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
        const reportBtn = document.getElementById('report-btn');
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const form = document.getElementById('form');
        const selectedUserTbody = document.getElementById('selected-users-tbody');

        if (reportBtn == null || startDateInput == null || endDateInput == null || form == null || selectedUserTbody == null) {
            return;
        }

        reportBtn.addEventListener('click', (e) => {
            e.preventDefault();

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

            if (startDateInput.value == '' || endDateInput.value == '') {
                form.submit();
            } else {
                form.setAttribute('action', `/activity-report/?startDate=${startDateInput.value}&endDate=${endDateInput.value}`);
                form.submit();
            }


        });
    }

    showGraph() {
        const getDataBtn = document.getElementById('graph-btn');
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const selectedUserTbody = document.getElementById('selected-users-tbody');
        const modalBtn = document.getElementById('modal-btn');

        if (modalBtn == null || startDateInput == null || endDateInput == null || selectedUserTbody == null || getDataBtn == null) {
            return;
        }


        getDataBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const selectedUsersRows = selectedUserTbody.children;
            const emptyRow = document.getElementById('selected-empty-row');

            if (emptyRow != null) {
                alert('No hay consultores seleccionados');
                return;
            }

            const selectedIdUsers = [];
            for (let i = 0; i < selectedUsersRows.length; i++) {
                selectedIdUsers.push(selectedUsersRows[i].id);
            }

            if (startDateInput.value == '' || endDateInput.value == '') {
                alert('No ha seleccionado un rango de fecha');
                return;
            }

            const _data = {
                startDate: startDateInput.value,
                endDate: endDateInput.value,
                idUsers: selectedIdUsers
            };

            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            fetch('/data-graph', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': token, "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify(_data)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code != 200) {
                        alert(data.data);
                        return;
                    }

                    modalBtn.click();

                    const labels = [];
                    const avgFixedCost = [];
                    for (let i = 0; i < data.months.length; i++) {
                        labels.push(data.months[i]);
                        avgFixedCost.push(data.avgFixedCost);
                    }

                    const datasets = [];
                    datasets.push({
                        type: 'line',
                        label: 'Costo fijo promedio',
                        backgroundColor: '#F44336',
                        borderColor: '#D32F2F',
                        pointBackgroundColor: '#FFFFFF',
                        fill: false,
                        data: avgFixedCost
                    });

                    for (let i = 0; i < data.dataGraph.length; i++) {

                        let netIncomeData = [];
                        for (let y = 0; y < data.months.length; y++) {
                            if (data.dataGraph[i].user.co_usuario == data.users[i].co_usuario) {
                                if (data.dataGraph[i].netIncome[y].month == data.months[y]) {
                                    netIncomeData.push(data.dataGraph[i].netIncome[y].value);
                                }
                            }
                        }

                        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                        datasets.push({
                            type: 'bar',
                            label: data.users[i].no_usuario,
                            backgroundColor: color,
                            data: netIncomeData,
                        });
                    }

                    const dataGraph = {
                        labels: labels,
                        datasets: datasets
                    };

                    const startDate = new Date(startDateInput.value);
                    const endDate = new Date(endDateInput.value);
                    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

                    const config = {
                        type: 'line',
                        data: dataGraph,
                        options: {
                            plugins: {
                                title: {
                                    text: `Rendimiento de consultores del ${startDate.toLocaleDateString("es-ES", dateOptions)} a ${endDate.toLocaleDateString("es-ES", dateOptions)}`,
                                    display: true
                                }
                            },
                            scales: {
                                x: {
                                    suggestedMin: 0,
                                    suggestedMax: labels.length,
                                },
                            },
                        },
                    };

                    window.Chart = Chart;
                    const timeComboChart = new Chart(
                        document.getElementById('data-graph'),
                        config
                    );

                    modalBtn.click();
                });
        });
    }

    showPizzaGraph() {
        const getDataBtn = document.getElementById('pizza-btn');
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const selectedUserTbody = document.getElementById('selected-users-tbody');
        const modalBtn = document.getElementById('modal-pizza-btn');

        if (modalBtn == null || selectedUserTbody == null || getDataBtn == null) {
            return;
        }

        let PieChart;

        getDataBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const selectedUsersRows = selectedUserTbody.children;
            const emptyRow = document.getElementById('selected-empty-row');

            if (emptyRow != null) {
                alert('No hay consultores seleccionados');
                return;
            }

            const selectedIdUsers = [];
            for (let i = 0; i < selectedUsersRows.length; i++) {
                selectedIdUsers.push(selectedUsersRows[i].id);
            }

            const _data = {
                startDate: startDateInput.value == '' ? false : startDateInput.value,
                endDate: endDateInput.value == '' ? false : endDateInput.value,
                idUsers: selectedIdUsers
            };

            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            fetch('/data-pizza', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': token, "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify(_data)

            })
                .then(response => response.json())
                .then(data => {
                    if (data.code != 200) {
                        alert(data.data);
                        return;
                    }

                    //obtener total ingresos netos
                    let totalNetIncome = 0;
                    for (let i = 0; i < data.data.length; i++) {
                        totalNetIncome += data.data[i].netIncome;
                    }

                    //obtener cada porcentaje de los ingresos netos de cada usuario
                    let pctNetIncome = [];
                    for (let i = 0; i < data.data.length; i++) {
                        let pctByUser = {
                            porcentage: ((data.data[i].netIncome/totalNetIncome)*100).toFixed(1),
                            user: data.data[i].user
                        }
                        pctNetIncome.push(pctByUser);
                    }

                    let labels = [];
                    let percentages = [];
                    let datasets = [];
                    let colors = [];
                    for (let i = 0; i < pctNetIncome.length; i++) {
                        labels.push(pctNetIncome[i].user.no_usuario);
                        percentages.push(pctNetIncome[i].porcentage);
                        colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
                    }

                    datasets.push({
                        label: labels,
                        data: percentages,
                        backgroundColor: colors,
                    });
                    
                    const dataPizza = {
                        labels: labels,
                        datasets: datasets
                    };

                    const config = {
                        type: 'pie',
                        data: dataPizza,
                        options: {
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            title: {
                              display: true,
                              text: 'Participacion en ingresos netos'
                            },
                            tooltips: {
                                callbacks: {
                                    label: function(tooltipItem, data) {
                                        var dataset = data.datasets[tooltipItem.datasetIndex];
                                        var currentValue = dataset.data[tooltipItem.index];
                                        return currentValue+'%';
                                    }
                                }
                            }
                          }
                        },
                      };

                    if (PieChart) {
                        PieChart.destroy();
                    }

                    window.Chart = Chart;
                    PieChart = new Chart(
                        document.getElementById('data-pizza'),
                        config
                    );

                    modalBtn.click();
                });
        });
    }

}