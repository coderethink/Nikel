const myModal = new bootstrap.Modal('#transaction-modal');
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: []
};

document.getElementById("button-logout").addEventListener("click", logout);

// ADICIONAR LANÇAMENTO
document.getElementById("transaction-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector("input[name='type-input']:checked").value;

    data.transactions.unshift({
        value: value,
        description: description,
        date: date,
        type: type
    });

    saveData(data);
    e.target.reset();
    myModal.hide();
    getTransactionsHTML();
    
    alert("Lançamento adicionado com sucesso!");
});

function checklogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }
    if (!logged) {
        window.location.href = "index.html";
        return;
    }

    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    getTransactionsHTML();
}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = "index.html";
}

function getTransactionsHTML() {
    const transactions = data.transactions;
    let transactionsHtml = ``;

    if(transactions.length) {
        transactions.forEach((item) => {
            let type = "Entrada";
            if (item.type === "2") {
                type = "Saída";
            }
            transactionsHtml += `
            <tr>
                <th scope="row">${item.date}</th>
                <td>R$ ${item.value.toFixed(2)}</td>
                <td>${type}</td>
                <td>${item.description}</td>
            </tr>
            `;
        });
    }

    document.getElementById("transactions-list").innerHTML = transactionsHtml;
}

function saveData(data) {
    if (!logged) return;
    localStorage.setItem(logged, JSON.stringify(data));
}

// Inicializar a página
checklogged();