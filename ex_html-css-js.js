const Validator = [
    {
        "id": "name",
        "callback": function(value) {
            return value.length > 0;
        }
    },
    {
        "id": "email",
        "callback": function(value) {
            return value.includes("@");
        }
    },
    {
        "id": "address",
        "callback": function(value) {
            return value.length >= 18
        }
    },
    {
        "id": "phone",
        "callback": function(value) {
            return value.length == 9;
        }
    },
]

const form = document.querySelector("form");
const sendOrderBtn = document.getElementById("sendOrder");

const ValidateInputs = function() {
    let valid = true;
    Validator.forEach((data) => {
        const element = document.getElementById(data.id);
        if(!data.callback(element.value)) {
            valid = false;
        }
    });
    sendOrderBtn.disabled = !valid;
    return valid;
}

form.onsubmit = (event) => {
    if(!ValidateInputs()) {
        alert("Algunos campos son incorrectos o están incompletos");
        event.preventDefault();
        return;
    }

    const confirmed = prompt("¿Seguro que quieres confirmar y enviar tu pedido ahora (Si/No)?");
    if(!confirmed || confirmed.toLocaleLowerCase() == "no")
        return event.preventDefault();

    const name = document.getElementById(Validator[0].id).value;
    alert(`¡Gracias por tu pedido, ${name}!`)
}

setInterval(() => {
    ValidateInputs();
}, 1000);

/*
    CALCULO PRECIOS
*/
const PriceInputs = [
    {
        "id": "fish-type",
        "callback": function(value) {
            switch(value) {
                case "calamares":
                    return { add: 6, multiply: 1 };
                case "adobo":
                    return { add: 7, multiply: 1 };
                case "boquerones":
                    return { add: 8, multiply: 1 };
            }
        }
    },
    {
        "id": "amount",
        "callback": function(value) {
            return { add: 0, multiply: parseInt(value) };
        }
    },
    {
        "id": [ "patatas", "ensaladilla", "bottle" ],
        "callback": function(value) {
            return { add: value.checked ? 4 : 0, multiply: 1 };
        }
    }
]

const CalculatePrice = () => {
    let price = 0;
    PriceInputs.forEach((data) => {
        const CalculaSinglePrice = (id) => {
            const element = document.getElementById(id);
            let arg = element.value;
            if(element.getAttribute("type") == "checkbox")
                arg = element;
            const { add, multiply } = data.callback(arg);
            price += add;
            price *= multiply;
        }

        if (typeof data.id === "object") {
            for(let i = 0; i < data.id.length; i++) {
                CalculaSinglePrice(data.id[i]);
            }
        } else {
            CalculaSinglePrice(data.id);
        }
    });
    return price;
}

const allInputs = document.querySelectorAll("input, select");
allInputs.forEach((element) => {
    element.onchange = function() {
        const priceElement = document.getElementById("finalPrice");
        priceElement.textContent = CalculatePrice() + "€";
    }
});

const instructionArea = document.getElementById("instructionsArea");
instructionArea.oninput = function() {
    const countElement = document.getElementById("instructionsCount");
    countElement.textContent = `${instructionArea.value.length}/150 carácteres`;
}

const darkModeBtn = document.getElementById("darkmode");
let darkModeActive = false;
darkModeBtn.onclick = function() {
    darkModeActive = !darkModeActive;
    if(!darkModeActive)
        document.body.classList.remove("darkmode");
    else
        document.body.classList.add("darkmode");
    
    darkModeBtn.textContent = !darkModeActive ? 'Modo Oscuro' : 'Modo Claro';
}