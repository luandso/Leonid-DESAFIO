/*
Autor: Luan Oliveira
Data: 21/05
Objetivo: Usar get, delete, post e edit com o back disponibilizado pelo professor Leonid.
*/

document.addEventListener('DOMContentLoaded', function () {
    const contactContainer = document.getElementById('contatos-list');
    const contactForm = document.getElementById('contato-form');
    const contactIdInput = document.getElementById('contato-id');
    const addBtn = document.getElementById('adicionar-btn');
    const updateBtn = document.getElementById('salvar-btn');

    // Função para buscar todos os contatos
    function getAllContacts() {
        fetch('https://bakcend-fecaf-render.onrender.com/contatos')
            .then(response => response.json())
            .then(contacts => {
                contactContainer.innerHTML = '';
                contacts.forEach(contact => {
                    const contactItem = document.createElement('div');
                    contactItem.className = 'contact-item';
                    contactItem.innerHTML = `
                        <img src="${contact.foto}" alt="Foto de ${contact.nome}" class="contact-photo">
                        <div class="contact-details">
                            <div class="contact-name">${contact.nome}</div>
                            <div class="contact-info">Email: ${contact.email}</div>
                            <div class="contact-info">Telefone: ${contact.telefone || 'N/A'}</div>
                            <div class="contact-info">Endereço: ${contact.endereco || 'N/A'}</div>
                        </div>
                        <div class="contact-actions">
                            <button class="edit-button" data-id="${contact.id}">Editar</button>
                            <button class="delete-button" data-id="${contact.id}">Excluir</button>
                        </div>
                    `;
                    contactContainer.appendChild(contactItem);
                });

                document.querySelectorAll('.edit-button').forEach(button => {
                    button.addEventListener('click', () => loadContact(button.getAttribute('data-id')));
                });

                document.querySelectorAll('.delete-button').forEach(button => {
                    button.addEventListener('click', () => deleteContact(button.getAttribute('data-id')));
                });
            })
            .catch(error => console.error('Erro ao buscar contatos:', error));
    }
    getAllContacts();

    // Clique para enviar as informações do contato
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const newContact = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            foto: document.getElementById('foto').value,
            telefone: document.getElementById('telefone').value,
            endereco: document.getElementById('endereco').value
        };

        insertContact(newContact);
    });

    // Inserir um novo contato
    function insertContact(contact) {
        fetch('https://bakcend-fecaf-render.onrender.com/contatos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao inserir contato.');
            return response.json();
        })
        .then(() => {
            getAllContacts();
            contactForm.reset();
        })
        .catch(error => console.error('Erro ao inserir contato:', error));
    }

    // Carregar o contato para edição
    function loadContact(id) {
        fetch(`https://bakcend-fecaf-render.onrender.com/contatos/${id}`)
            .then(response => response.json())
            .then(contact => {
                document.getElementById('nome').value = contact.nome;
                document.getElementById('email').value = contact.email;
                document.getElementById('foto').value = contact.foto;
                document.getElementById('telefone').value = contact.telefone;
                document.getElementById('endereco').value = contact.endereco;
                contactIdInput.value = contact.id;
                addBtn.style.display = 'none';
                updateBtn.style.display = 'inline-block';
            })
            .catch(error => console.error('Erro ao carregar contato:', error));
    }

    // Clique com a função de salvar alterações no contato
    updateBtn.addEventListener('click', function () {
        const id = contactIdInput.value;
        const updatedContact = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            foto: document.getElementById('foto').value,
            telefone: document.getElementById('telefone').value,
            endereco: document.getElementById('endereco').value
        };

        updateContact(id, updatedContact);
    });

    // Atualizar o contato existente
    function updateContact(id, contact) {
        fetch(`https://bakcend-fecaf-render.onrender.com/contatos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao atualizar contato.');
            return response.json();
        })
        .then(() => {
            getAllContacts();
            contactForm.reset();
            contactIdInput.value = '';

            addBtn.style.display = 'inline-block';
            updateBtn.style.display = 'none';
        })
        .catch(error => console.error('Erro ao atualizar contato:', error));
    }

    // Excluir o contato existente
    function deleteContact(id) {
        if (confirm("Você tem certeza que deseja excluir este contato?")) {
            fetch(`https://bakcend-fecaf-render.onrender.com/contatos/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw new Error(`Erro ao excluir contato com ID ${id}: ${errorMessage}`);
                    });
                }
                console.log(`Contato com ID ${id} excluído com sucesso.`);
                getAllContacts();
            })
            .catch(error => console.error(error));
        }
    }
});
