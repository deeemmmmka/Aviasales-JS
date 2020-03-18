// собираем все необходимые инпуты и списки
const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropDownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropDownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart');

// создаем массив городов
const city = ['Москва', 'Санкт-Петербург', 'Минск', 'Караганда', 'Челябинск', 'Керчь', 'Симферополь', 'Волгоград', 'Самара', 'Днепропетровск', 'Екатеринбург', 'Одесса', 'Ухань', 'Нижний Новгород', 'Калининград', 'Вроцлав', 'Ростов-на-Дону', 'Киев', 'Владивосток', 'Нью-Йорк', 'Лондон', 'Тегеран', 'Канны', 'Оттава'];

//помещаем в переменную функцию для выбора города
const showCity = (input, list) => {
    list.textContent = ''; // очищаем выпадающее меню

    if(input.value !== ''){

        const  filterCity = city.filter((item) => {
            const fixItem = item.toLowerCase();
            return fixItem.includes(input.value.toLowerCase());
        });

        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
            list.append(li);
        });
    }
};

// при наборе чего либо в инпуте города вылета вызываем функцию, помогающую выбрать город вылета
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropDownCitiesFrom)
});
// при наборе чего либо в инпуте города прилета вызываем функцию, помогающую выбрать город прилета
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropDownCitiesTo)
});

// помещаем в переменную функцию выбора города в выпадающем списке
const targetPush = (input, list) => {
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li'){
        input.value = target.textContent;
        list.textContent = '';
    }
}

// вешаем событие выбора нужного города вылета при клике на элемент выпадающего списка
dropDownCitiesFrom.addEventListener('click', (event) => {
    targetPush(inputCitiesFrom, dropDownCitiesFrom)
});

// вешаем событие выбора нужного города прилета при клике на элемент выпадающего списка
dropDownCitiesTo.addEventListener('click', (event) => {
    targetPush(inputCitiesTo, dropDownCitiesTo)
});