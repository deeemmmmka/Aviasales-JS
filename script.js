// собираем все необходимые инпуты и списки
const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropDownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropDownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart');

// данные

const citiesApi ='http://api.travelpayouts.com/data/ru/cities.json',
    proxy ='https://cors-anywhere.herokuapp.com/',
    API_KEY = '866693554fd1ab7d73b276d46105eba8',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload',
    queryBilets = '?&depart_date=2020-05-25&origin=SVX&destination=KGD&one_way=true&token';


let city = [];

// функции

const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if ( request.readyState !== 4 ) return;

        if ( request.status === 200 ) {
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });

    request.send();
};


const showCity = (input, list) => {
    list.textContent = ''; // очищаем выпадающее меню

    if(input.value !== ''){
        const  filterCity = city.filter((item) => {
            const fixItem = item.name.toLowerCase();
            return fixItem.includes(input.value.toLowerCase());
        });


        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    }
};

// помещаем в переменную функцию выбора города в выпадающем списке
const targetPush = (event, input, list) => {
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li'){
        input.value = target.textContent;
        list.textContent = '';
    }
};

const renderCheapDay = (cheapTicket) => {
    console.log(cheapTicket);
};
const renderCheapYear = (cheapTickets) => {
    console.log(cheapTickets);
};

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    const cheapTicketDay = cheapTicketYear.filter((item) => {
         return item.depart_date === date;
    })
    // сортировка по датам
    const cheapTicketYearSort = cheapTicketYear.sort((a,b) => {
        var dateA = new Date(a.depart_date);
        var dateB = new Date(b.depart_date);
        return dateA - dateB;
    });

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYearSort);
};

// обработчики событий
// при наборе чего либо в инпуте города вылета вызываем функцию, помогающую выбрать город вылета
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropDownCitiesFrom)
});
// при наборе чего либо в инпуте города прилета вызываем функцию, помогающую выбрать город прилета
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropDownCitiesTo)
});

// вешаем событие выбора нужного города вылета при клике на элемент выпадающего списка
dropDownCitiesFrom.addEventListener('click', (event) => {
    targetPush(event, inputCitiesFrom, dropDownCitiesFrom)
});

// вешаем событие выбора нужного города прилета при клике на элемент выпадающего списка
dropDownCitiesTo.addEventListener('click', (event) => {
    targetPush(event, inputCitiesTo, dropDownCitiesTo)
});

// события при нажатии кнопки "найти билеты"
formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
    const cityTo = city.find((item) => inputCitiesTo.value === item.name);

    const formData = {
        from: cityFrom.code,
        to: cityTo.code,
        when: inputDateDepart.value,
    }

    const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true`;

    getData(calendar + requestData, (response) => {
        renderCheap(response, formData.when);
    });
});


// вызовы функций
getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
});

//// отсортировать вывод городов в поиске инпута по первой букве