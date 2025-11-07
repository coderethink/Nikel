const myModal = new bootstrap.Modal('#transaction-modal');
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: []
};

document.getElementById("button-logout").addEventListener("click", logout);
document.getElementById("transactions-button").addEventListener("click", function() {
    window.location.href = "transactions.html";
});

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
    getCashIn();
    getCashOut();
    getTotal();
    alert("Lançamento adicionado com sucesso!");
});

checklogged();

// carregar lançamentos ao abrir a página
// (checklogged já chama getCashIn/getCashOut quando estiver logado)

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
    getCashIn();
    getCashOut();
    geTotal();
}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = "index.html";
}

function getCashIn() {
    const transactions = data.transactions || [];
    const cashIn = transactions.filter((item) => item.type === "1");
    let cashInHtml = "";
    const limit = Math.min(cashIn.length, 5);

    for (let i = 0; i < limit; i++) {
        cashInHtml += `
            <div class="row mb-4">
                <div class="col-12">
                    <h3 class="fs-2">R$ ${cashIn[i].value.toFixed(2)}</h3>
                    <div class="container p-0">
                        <div class="row">
                            <div class="col-12 col-md-8">
                                <p>${cashIn[i].description}</p>
                            </div>
                            <div class="col-12 col-md-3 d-flex justify-content-md-end">
                                ${cashIn[i].date}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    document.getElementById("cash-in-list").innerHTML = cashInHtml;
}

function getCashOut() {
    const transactions = data.transactions || [];
    const cashOut = transactions.filter((item) => item.type === "2");
    let cashOutHtml = "";
    const limit = Math.min(cashOut.length, 5);

    for (let i = 0; i < limit; i++) {
        cashOutHtml += `
            <div class="row mb-4">
                <div class="col-12">
                    <h3 class="fs-2">R$ ${cashOut[i].value.toFixed(2)}</h3>
                    <div class="container p-0">
                        <div class="row">
                            <div class="col-12 col-md-8">
                                <p>${cashOut[i].description}</p>
                            </div>
                            <div class="col-12 col-md-3 d-flex justify-content-md-end">
                                ${cashOut[i].date}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    document.getElementById("cash-out-list").innerHTML = cashOutHtml;
}

function geTotal() {
    const transactions = data.transactions || [];
    let total = 0;
    transactions.forEach((item) => {
        if (item.type === "1") {
            total += item.value;
        } else {
            total -= item.value;
        }


    });
    document.getElementById("total").innerHTML = `R$ ${total.toFixed(2)}`;
}

function saveData(data) {
    // salvar usando a chave do usuário atualmente logado (mais confiável que data.login)
    if (!logged) return;
    localStorage.setItem(logged, JSON.stringify(data));
}
