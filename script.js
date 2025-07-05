const nameField = document.getElementById("name");
const surnameField = document.getElementById("surname");
const emailField = document.getElementById("email");
const dateField = document.getElementById("date");
const cpfField = document.getElementById("cpf");
const cepField = document.getElementById("cep");
const countryField = document.getElementById("country-select");
const checkboxTerms = document.getElementById("terms");
const checkboxConf = document.getElementById("confidential");
const loveField = document.getElementById("love");

const mensagensDelayInput = [
  "Você está rápido demais, qual é a pressa?",
  "Falei para esperar um pouco, não foi?",
  "Agora você vai ter que esperar!",
];

function cpfValidation(cpf) {
  const cpfInit = cpf.slice(0, cpf.length - 2);
  const verifyDigits = cpf.slice(cpf.length - 2);
  const multiplyArray = [...Array(9).keys()].map((i) => i + 2).reverse();
  const multiplyArray2 = [...Array(10).keys()].map((i) => i + 2).reverse();

  const firstDigitSum =
    11 -
    (cpfInit.split("").reduce((acc, value, index) => {
      return acc + Number(value) * multiplyArray[index];
    }, 0) %
      11);

  const firstDigit = firstDigitSum >= 10 ? 0 : firstDigitSum;

  const secondDigitSum =
    11 -
    ((cpfInit + firstDigit).split("").reduce((acc, value, index) => {
      return acc + Number(value) * multiplyArray2[index];
    }, 0) %
      11);
  const secondDigit = secondDigitSum >= 10 ? 0 : secondDigitSum;

  return `${firstDigit}${secondDigit}` === verifyDigits;
}

function forcarDelayInput(input, delay = 2000) {
  let ultimaEntrada = 0;
  let bloqueado = false;
  let count = 0;

  input.addEventListener("beforeinput", (e) => {
    console.log(count);
    const agora = Date.now();
    if (agora - ultimaEntrada < delay || bloqueado) {
      e.preventDefault();

      input.blur(); // irrita ainda mais
      if (count != 0) input.value = "";
      if (count >= 2) {
        let message = document.createElement("p");
        input.insertAdjacentElement("afterend", message);
        let tempoRestante = 5 + 2 * (count - 2);

        disableInputField(input, tempoRestante * 1000);
      }

      alert(mensagensDelayInput[count > 2 ? 2 : count]);
      count++;
    } else {
      ultimaEntrada = agora;
      bloqueado = true;
      setTimeout(() => (bloqueado = false), delay);
    }
  });
}

function disableInputField(inputField, delay = 5000) {
  inputField.disabled = true;

  let message = document.createElement("p");
  inputField.insertAdjacentElement("afterend", message);

  let tempoRestante = delay / 1000;

  const intervalo = setInterval(() => {
    tempoRestante--;
    message.textContent = `Aguarde ${tempoRestante} segundos...`;

    console.log(`Aguardando ${tempoRestante} segundos...`);

    if (tempoRestante <= 0) {
      inputField.disabled = false;
      message.remove(); // <--- aqui remove o parágrafo
      clearInterval(intervalo);
    }
  }, 1000);
}

forcarDelayInput(document.getElementById("cpf"), 1000);
forcarDelayInput(document.getElementById("cep"), 1000);

// Ordem dos campos embaralha a cada 10 segundos
const formSection = document.querySelector(".corpo");
setInterval(() => {
  const formSection = document.querySelector(".corpo");

  // Todos os campos que podem ser embaralhados
  const allFields = Array.from(
    formSection.querySelectorAll(".input-div, .select-div, .checkbox, .send")
  );

  // Pegue os últimos 3 (fixos)
  const fixedFields = allFields.slice(-3);

  // Embaralhe os demais
  const shuffleable = allFields.slice(0, -3);
  shuffleable.sort(() => Math.random() - 0.5);

  // Reconstrua a ordem no DOM
  [...shuffleable, ...fixedFields].forEach((field) =>
    formSection.appendChild(field)
  );
}, 10000);

// Mensagem de erro sempre que tenta enviar
const sendButton = document.querySelector(".send");
sendButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (checkboxConf.checked) {
    alert(
      "Como você não aceitou os termos, iremos te enviar para a página inicial"
    );
    window.location.href = "/";
  }
  if (checkboxTerms.checked) {
    alert(
      "Como você recusou o uso dos dados, não podemos enviar o formulário. Iremos te direcionar para a página inicial."
    );
    window.location.href = "/";
  }

  if (countryField.value !== "BR") {
    alert(`Acho que você não é do Brasil, não podemos aceitar seu cadastro.`);
    window.location.href = "/";
  }

  if (
    !nameField.value ||
    !surnameField.value ||
    !emailField.value ||
    !dateField.value ||
    !cpfField.value ||
    !cepField.value ||
    !countryField.value ||
    !loveField.value
  ) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  // Validar nome e sobrenome
  if (nameField.value.length < 3 || surnameField.value.length < 3) {
    alert("Nome e sobrenome devem ter pelo menos 3 caracteres.");
    return;
  }

  if (!/^\d{11}$/.test(cpfField.value)) {
    alert("CPF deve ter exatamente 11 dígitos.");
    return;
  }

  if (!/^\d{5}-\d{3}$/.test(cepField.value)) {
    alert("CEP deve estar no formato XXXXX-XXX.");
    return;
  }

  if (!emailField.value.includes("@")) {
    alert("Por favor, insira um email válido.");
    return;
  }

  if (!cpfValidation(cpfField.value)) {
    alert("CPF inválido. Por favor, verifique o número.");
    return;
  }

  window.location.href = "https://titanci.com.br";
});
