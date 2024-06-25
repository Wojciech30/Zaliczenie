document.addEventListener('DOMContentLoaded', () => {
    const accordionContainer = document.getElementById('accordion-container');
    const form = document.getElementById('new-item-form');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');

    function getItemsFromLocalStorage() {
        const items = localStorage.getItem('accordionItems');
        return items ? JSON.parse(items) : [];
    }

    function saveItemsToLocalStorage(items) {
        localStorage.setItem('accordionItems', JSON.stringify(items));
    }

    function addItem(title, description, isExpanded = false) {
        const itemContainer = document.createElement('div');
        const item = document.createElement('div');
        const content = document.createElement('div');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        content.textContent = description;
        content.style.display = isExpanded ? 'block' : 'none';

        item.textContent = title;
        item.style.cursor = 'pointer';
        item.style.margin = '10px 0';
        item.addEventListener('click', () => {
            const items = getItemsFromLocalStorage();
            const index = items.findIndex(el => el.title === title && el.description === description);
            items[index].isExpanded = content.style.display === 'none';
            saveItemsToLocalStorage(items);
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });

        editButton.textContent = 'Edytuj';
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const newTitle = prompt('Nowy tytuł:', title);
            const newDescription = prompt('Nowy opis:', description);
            if (newTitle && newDescription) {
                item.textContent = newTitle;
                content.textContent = newDescription;
                const items = getItemsFromLocalStorage();
                const index = items.findIndex(el => el.title === title && el.description === description);
                items[index].title = newTitle;
                items[index].description = newDescription;
                saveItemsToLocalStorage(items);
                title = newTitle;
                description = newDescription;
            }
        });

        deleteButton.textContent = 'Usuń';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const items = getItemsFromLocalStorage();
            const index = items.findIndex(el => el.title === title && el.description === description);
            if (index !== -1) {
                items.splice(index, 1);
                saveItemsToLocalStorage(items);
                accordionContainer.removeChild(itemContainer);
            }
        });

        itemContainer.appendChild(item);
        itemContainer.appendChild(editButton);
        itemContainer.appendChild(deleteButton);
        itemContainer.appendChild(content);
        accordionContainer.appendChild(itemContainer);
    }

    // Przywróć elementy z localStorage
    const storedItems = getItemsFromLocalStorage();
    if (storedItems.length > 0) {
        storedItems.forEach(item => {
            addItem(item.title, item.description, item.isExpanded);
        });
    } else {
        // Dodaj początkowe elementy i zapisz je do localStorage
        const initialItems = [];
        for (let i = 1; i <= 5; i++) {
            const title = `Element ${i}`;
            const description = `Zawartość elementu ${i}`;
            addItem(title, description);
            initialItems.push({ title, description, isExpanded: false });
        }
        saveItemsToLocalStorage(initialItems);
    }

    // Dodaj nowy element z formularza
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        if (title && description) {
            addItem(title, description);
            const items = getItemsFromLocalStorage();
            items.push({ title, description, isExpanded: false });
            saveItemsToLocalStorage(items);
            titleInput.value = '';
            descriptionInput.value = '';
        }
    });
});
