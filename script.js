console.log('form-script loaded')
const form = document.getElementById('form')
let tipoUsuarioSelecionado = 'paciente'

function preencheCEP(response) {
  const estado = document.getElementById('estado')
  estado.value = response.uf
  const cidade = document.getElementById('cidade')
  cidade.value = response.localidade
}

function consultaCEP(cep) {
  const parsedCEP = cep.replace(/-/, '')
  const url = 'https://viacep.com.br/ws/' + parsedCEP + '/json'
  const request = new XMLHttpRequest()
  const localErro = document.getElementById('cep').nextElementSibling

  request.open('GET', url)
  request.onerror = function (e) {
    localErro.innerHTML =
      'Algum erro ocorreu. Tente novamente ou consulte suporte.'
    localErro.style.display = 'block'
    console.log('ERRO = ', e)
  }

  request.onload = () => {
    const response = JSON.parse(request.responseText)

    if (response.erro === true) {
      localErro.innerHTML = 'CEP Não Encontrado'
      localErro.style.display = 'block'
      return
    } else {
      console.log('response = ', response)
      preencheCEP(response)
      localErro.style.display = 'none'
    }
  }

  request.send()
}

function telefonesMascara() {
  const idsTelefones = ['telefone', 'telefoneRepresentante', 'telefoneMedico']
  for (tipoTelefone of idsTelefones) {
    const input = document.getElementById(tipoTelefone)
    input.addEventListener('input', (ev) => {
      const tamanho = ev.target.value.length
      let cpf = ev.target.value
      if (isNaN(Number(cpf.charAt(tamanho - 1)))) {
        cpf = cpf.substr(0, tamanho - 1)
      }
    })

    input.addEventListener('keydown', (ev) => {
      const keyCode = ev.key
      if (
        keyCode === 'Meta' ||
        keyCode === 'Delete' ||
        keyCode === 'Backspace' ||
        ev.target.value.length > ev.target.maxLength
      )
        return

      const input = ev.target.value
      const tamanho = ev.target.value.length
      if (tamanho < 3 && ev.target.value.includes('('))
        document.getElementById(ev.target.id).value = document
          .getElementById(ev.target.id)
          .value.replace('(', '')
      if (tamanho === 2 || (input.startsWith('(') && !input.includes(')'))) {
        const exp = /(\d{2})/
        const alterado = document
          .getElementById(ev.target.id)
          .value.replace(exp, '($1)')
        document.getElementById(ev.target.id).value = alterado
      }
      if (tamanho === 9) {
        const alterado = document.getElementById(ev.target.id).value + '-'
        document.getElementById(ev.target.id).value = alterado
      }
    })
  }
}

function mascaras() {
  telefonesMascara()
  const cpfInput = document.getElementById('cpf')
  cpfInput.addEventListener('input', (ev) => {
    const tamanho = ev.target.value.length
    let cpf = ev.target.value
    if (isNaN(Number(cpf.charAt(tamanho - 1)))) {
      cpf = cpf.substr(0, tamanho - 1)
    }
  })

  cpfInput.addEventListener('keydown', (ev) => {
    const keyCode = ev.key
    if (
      keyCode === 'Meta' ||
      keyCode === 'Delete' ||
      keyCode === 'Backspace' ||
      ev.target.value.length > 14
    )
      return
    const cpf = ev.target.value
    const tamanho = cpf.length
    if (tamanho === 3 || tamanho === 7)
      document.getElementById('cpf').value += '.'
    if (tamanho === 11) document.getElementById('cpf').value += '-'
  })

  const cpfRepresentanteInput = document.getElementById('cpfRepresentante')
  cpfRepresentanteInput.addEventListener('input', (ev) => {
    const tamanho = ev.target.value.length
    let cpf = ev.target.value
    if (isNaN(Number(cpf.charAt(tamanho - 1)))) {
      cpf = cpf.substr(0, tamanho - 1)
    }
  })

  cpfRepresentanteInput.addEventListener('keydown', (ev) => {
    const keyCode = ev.key
    if (
      keyCode === 'Meta' ||
      keyCode === 'Delete' ||
      keyCode === 'Backspace' ||
      ev.target.value.length > 14
    )
      return
    const cpf = ev.target.value
    const tamanho = cpf.length
    if (tamanho === 3 || tamanho === 7)
      document.getElementById('cpf').value += '.'
    if (tamanho === 11) document.getElementById('cpf').value += '-'
  })

  document.getElementById('cep').addEventListener('keyup', (ev) => {
    const keyCode = ev.key
    if (keyCode === 'Meta' || keyCode === 'Delete' || keyCode === 'Backspace')
      return
    const tamanho = ev.target.value.length
    if (tamanho === 8) {
      const alterado =
        ev.target.value.substr(0, 5) + '-' + ev.target.value.substr(5)
      document.getElementById(ev.target.id).value = alterado
    }
  })
}

function menorDeDezoito(dataNascimento) {
  const dateNascimento = new Date(dataNascimento)
  const diff = Date.now() - dateNascimento.getTime()
  const ageDate = new Date(diff)
  const age = Math.abs(ageDate.getUTCFullYear() - 1970)
  return age < 18
}

function mostraErro(input, mensagem) {
  const tagErro = input.nextElementSibling
  tagErro.innerHTML = mensagem
  tagErro.style.display = 'block'
}

function escolheArquivo(ev) {
  const input = ev.target
  const extensoes = input.accept.split(',')
  const extensao = input.value.slice(ev.target.value.lastIndexOf('.'))
  if ('files' in input) {
    if (input.files[0].size > 2000000) {
      input.value = ''
      mostraErro(input, 'Arquivo maior que 2Mb')
      return
    }
  }

  if (!extensoes.includes(extensao)) {
    input.value = ''
    mostraErro(input, 'Extensão não válida. Arquivo deve ser pdf, jpg, ou png')
    return
  }
  input.nextElementSibling.style.display = 'none'
}

function toggleSenha(ev) {
  ev.target.classList.toggle('dashicons-hidden')
  ev.target.classList.toggle('dashicons-visibility')
}

function setPaciente() {
  tipoUsuarioSelecionado = 'paciente'
  document
    .querySelectorAll("[data-user='paciente']")
    .forEach((paciente) => (paciente.style.display = 'block'))
  document
    .querySelectorAll("[data-user='representante']")
    .forEach((representante) => (representante.style.display = 'none'))
}

function setRepresentante() {
  tipoUsuarioSelecionado = 'representante'
  document
    .querySelectorAll("[data-user='representante']")
    .forEach((representante) => (representante.style.display = 'block'))
  document
    .querySelectorAll("[data-user='paciente']")
    .forEach((paciente) => (paciente.style.display = 'none'))
}

function setRepresentanteInputs(requerido) {
  const dataRepresentante = document
    .querySelector("[data-user='representante']")
    .getElementsByTagName('input')
  for (input of dataRepresentante) {
    input.required = requerido
  }
}

function confereForm(step) {
  if (step === 2 && tipoUsuarioSelecionado === 'paciente')
    setRepresentanteInputs(false)
  let conferido = true
  const div = document.querySelector("[data-step='" + step + "']")
  const inputs = div.getElementsByTagName('input')
  for (const input of inputs) {
    if (input.value === '' && input.hasAttribute('required')) {
      input.nextElementSibling.style.display = 'block'
      conferido = false
    }
  }

  return conferido
}

function limpaAviso(step) {
  const div = document.querySelector("[data-step='" + step + "']")
  const inputs = div.querySelectorAll('input[required]')
  for (const input of inputs) {
    input.nextElementSibling.style.display = 'none'
  }
}

function confirmaCampos() {
  const senha = document.getElementById('reg_password').value
  const confirmaSenha = document.getElementById('conf_reg_password').value

  if (senha !== confirmaSenha) {
    const mensagemErro = document.getElementById('confirma_senha')
    mensagemErro.innerHTML = 'As senhas não correspondem'
    mensagemErro.style.display = 'block'
  }

  // const email = document.getElementById('reg_email').value
  // const confirmaEmail = document.getElementById('conf_reg_email').value
  // if (email && confirmaEmail && email !== confirmaEmail) {
  // const mensagemErro = document.getElementById('confirma_email')
  // mensagemErro.innerHTML = 'Os emails não correspondem'
  // mensagemErro.style.display = 'block'
  // }
}

function formControl() {
  document.querySelectorAll('[data-set-step]').forEach((element) => {
    const step = element.dataset.setStep
    element.onclick = (event) => {
      event.preventDefault()

      if (element.innerText === 'Continuar') {
        limpaAviso(step - 1)
        const formValido = confereForm(step - 1)
        confirmaCampos()
        if (!formValido) return
      } else limpaAviso(step)

      const current = document
        .getElementsByClassName('step-content current')
        .item(0)
      current.classList.remove('current')
      document
        .querySelector("[data-step='" + element.dataset.setStep + "']")
        .classList.add('current')

      document
        .getElementsByClassName('step current')
        .item(0)
        .classList.remove('current')
      document
        .querySelector("[data-step-control='" + element.dataset.setStep + "']")
        .classList.add('current')
    }
  })
  document.getElementsByName('tipoUsuario').forEach((tipoUsuario) => {
    tipoUsuario.addEventListener('click', (e) => {
      switch (e.target.id) {
        case 'userPaciente':
          setPaciente()
          setPrimeiro()
          break
        case 'userRepresentante':
          setRepresentante()
          setPrimeiro()
          break
        default:
          break
      }
    })
  })

  function senhaPequena(senha) {
    return senha.length < 8 ? true : false
  }

  function contemLetraMaiuscula(senha) {
    return senha.search('[A-Z]') > -1 ? true : false
  }

  function contemNumero(senha) {
    return senha.search('[0-9]') > -1 ? true : false
  }

  document.getElementById('reg_password').addEventListener('focusout', (ev) => {
    const senha = ev.target
    if (senhaPequena(senha.value)) {
      mostraErro(senha, 'Mínimo 8 caracteres')
      return
    }

    if (!contemLetraMaiuscula(senha.value)) {
      mostraErro(senha, 'Precisa conter ao menos uma letra maiúscula')
      return
    }

    if (!contemNumero(senha.value)) {
      mostraErro(senha, 'Precisa conter ao menos um número')
      return
    }

    senha.nextElementSibling.style.display = 'none'
  })

  document.getElementById('reg_email').addEventListener('focusout', (ev) => {
    const email = ev.target
    const regexEmail =
      "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
    if (!email.value.match(regexEmail)) {
      mostraErro(email, 'Email não válido')
      return
    }

    email.nextElementSibling.style.display = 'none'
  })

  document.getElementById('adicionarReceita').addEventListener('click', () => {
    const upload = document.getElementById('receitaMedica')
    const receita = upload.value
    const nomeReceita = receita.split('\\').pop()
    const tiposReceita = document.getElementsByName('receita')
    const tipoReceita = Array.from(tiposReceita).filter((receita) => {
      return receita.checked
    })
    if (!tipoReceita.length) {
      mostraErro(upload, 'É preciso escolher o tipo de receita acima')
      return
    }
    upload.nextElementSibling.style.display = 'none'
    upload.value = ''

    const bodyTabela = document
      .getElementById('tabelaReceitas')
      .getElementsByTagName('tbody')[0]
    const novaLinha = bodyTabela.insertRow()
    const celulaArquivo = novaLinha.insertCell()
    const nodoReceita = document.createTextNode(nomeReceita)
    celulaArquivo.append(nodoReceita)
    const celulaTipoReceita = novaLinha.insertCell()
    const nodoTipoReceita = document.createTextNode(tipoReceita[0].value)
    celulaTipoReceita.append(nodoTipoReceita)
  })

  document
    .getElementById('dataNascimento')
    .addEventListener('focusout', (ev) => {
      const nascimento = ev.target
      if (menorDeDezoito(nascimento.value)) {
        mostraErro(ev.target, 'Menor de 18 anos')
        nascimento.setCustomValidity('Menor de 18 anos!')
        return
      }
      nascimento.nextElementSibling.style.display = 'none'
      nascimento.setCustomValidity('')
    })
}

function setPrimeiro() {
  document.querySelector("[data-step-control='1']").classList.add('current')
  document.querySelector("[data-step='1']").classList.add('current')
}

window.onload = function () {
  formControl()
  mascaras()
  // confereForm()
}
