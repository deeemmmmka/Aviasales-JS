const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropDownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropDownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart');

const city = ['Москва', 'Санкт-Петербург', 'Минск', 'Караганда', 'Челябинск', 'Керчь', 'Симферополь', 'Волгоград', 'Самара', 'Днепропетровск', 'Екатеринбург', 'Одесса', 'Ухань', 'Нижний Новгород', 'Калининград', 'Вроцлав', 'Ростов-на-Дону', 'Киев', 'Владивосток', 'Нью-Йорк', 'Лондон', 'Тегеран', 'Канны', 'Оттава'];

const showCity = (input, list) => {
    list.textContent = '';

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

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropDownCitiesFrom)
});
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropDownCitiesTo)
});

const targetPush = (input, list) => {
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li'){
        input.value = target.textContent;
        list.textContent = '';
    }
}

dropDownCitiesFrom.addEventListener('click', (event) => {
    targetPush(inputCitiesFrom, dropDownCitiesFrom)
});
dropDownCitiesTo.addEventListener('click', (event) => {
    targetPush(inputCitiesTo, dropDownCitiesTo)
});