// собираем все необходимые инпуты и списки
const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropDownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropDownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');

// данные

const citiesApi ='http://api.travelpayouts.com/data/ru/cities.json',
    proxy ='https://cors-anywhere.herokuapp.com/',
    API_KEY = '866693554fd1ab7d73b276d46105eba8',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload',
    queryBilets = '?&depart_date=2020-05-25&origin=SVX&destination=KGD&one_way=true&token',
    MAX_COUNT = 10;


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
            return fixItem.startsWith(input.value.toLowerCase());
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

const getNameCity = (code) => {
    const objCity = city.find((item) => item.code === code);
    return objCity.name;
}

const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getChanges = (num) => {
    if (num){
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    } else{
        return 'Без пересадок';
    }
};

const getLilnkAviaSales = (data) => {
    let link = 'https://www.aviasales.ru/search/';

    link += data.origin;

    const date = new Date(data.depart_date);

    const day = date.getDate();
    const month = date.getMonth() + 1;

    link += day < 10 ? '0' + day : day;
    link += month < 10 ? '0' + month : month;
    link += data.destination;
    link += '1';


    return link;
}

const createCard = (data) => {
    const ticket = document. createElement('article');
    ticket.classList.add('ticket'); // добавление класса

    let deep = '';
    if(data){
        deep = `
            <h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
                <div class="left-side">
                    <a href="${getLilnkAviaSales(data)}" class="button button__buy">Купить
                        за ${data.value}₽</a>
                </div>
                <div class="right-side">
                    <div class="block-left">
                        <div class="city__from">Вылет из города
                            <span class="city__name">${getNameCity(data.origin)}</span>
                        </div>
                        <div class="date">${getDate(data.depart_date)}</div>
                    </div>

                    <div class="block-right">
                        <div class="changes">${getChanges(data.number_of_changes)}</div>
                        <div class="city__to">Город назначения:
                            <span class="city__name">${getNameCity(data.destination)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        deep = '<h3>К сожалению на текущую дату билетов не нашлось!</h3>'
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;

};

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';

    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
};
const renderCheapYear = (cheapTickets) => {

    // сортировка билетов по стоимости
    // первый вариант

    // cheapTickets.sort((a,b) => {
    //     if(a.depart_date > b.depart_date){
    //         return 1;
    //     }
    //     if(a.depart_date < b.depart_date){
    //         return -1;
    //     }
    //     return 0;
    // });

    // второй вариант
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
    const sortItems = cheapTickets.sort((a, b) => a.value - b.value);

    for(let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.append(ticket);
    }
};

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    const cheapTicketDay = cheapTicketYear.filter((item) => {
         return item.depart_date === date;
    })
    // сортировка по датам
    // const cheapTicketYearSort = cheapTicketYear.sort((a,b) => {
    //     var dateA = new Date(a.depart_date);
    //     var dateB = new Date(b.depart_date);
    //     return dateA - dateB;
    // });

    renderCheapDay(cheapTicketDay);
    // renderCheapYear(cheapTicketYearSort);
    renderCheapDay(cheapTicketYear);
};

// своё предупреждение
const myAlert = (message) => {
  delAlert();
  let messageDiv = `<section id="alert" style="text-align: center;">${message}</section>`;

  formSearch.insertAdjacentHTML('afterbegin', messageDiv);
}
const delAlert = () => {
  alert = document.getElementById('alert');
  cheapestTicket.textContent = '';
  otherCheapTickets.textContent = '';
  if (alert) alert.remove();
}

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
    delAlert();

    const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
    const cityTo = city.find((item) => inputCitiesTo.value === item.name);

    const formData = {
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value,
    }

    if(formData.from && formData.to){

        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`;

        getData(calendar + requestData, (response) => {
            renderCheap(response, formData.when);
        }, (error) => {
            myAlert('В этом направлении нет рейсов');
            console.error('Ошибка', error);
        });
    } else{
        myAlert('Введите правильное название города');
    }
});


// вызовы функций
getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);

    city.sort((a,b) => {
        if(a.name > b.name){
            return 1;
        }
        if(a.name < b.name){
            return -1;
        }
        return 0;
    });
});

//// отсортировать вывод городов в поиске инпута по первой букве