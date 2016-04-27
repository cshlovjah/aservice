"use strict";

var startdatetime, enddatetime;

var resources = getDataJson('connector.php?get=resources', 'json'); //получаем данные по боксам и постам
var types = getDataJson('connector.php?get=repairTypes', 'json'); //получаем типы работ
var users = getDataJson('connector.php?get=humanResources', 'json'); //получаем данные по пользователям, пользователю
var state = getDataJson('connector.php?get=getAllStatus', 'json'); //Получение всех статусов события

function watchDog() {

    getDataJson('connector.php?get=watch', 'json');

}

function initChangeBox(selBoxValue) {
    console.log("initChangeBox" + selBoxValue);
    fillSelector('select#repair_post_id', resources, 'title', selBoxValue);//Ремонтные посты
    var type = getDataJson('connector.php?get=repairType', 'boxid=' + selBoxValue);
    fillSelector('select#repair_type_id', type, 'name', 'more');
}

$(document).ready(function () {
    console.log("ready!");
    watchDog();
    setInterval('watchDog()', 10000);

    // user_target_name
    var $selectBox = $('#repair_box_id');

    startdatetime = $('#startdatetime').datetimepicker({format: 'YYYY-MM-DD HH:mm', locale: 'ru'});
    enddatetime = $('#enddatetime').datetimepicker({format: 'YYYY-MM-DD HH:mm', locale: 'ru'});

    $selectBox.off('change').on('change', function (e) {
        e.preventDefault();
        console.log("change");
        initChangeBox($selectBox.val());
    });

    init();
    resizeWorkspace();

    function init() {
        console.log("Инциализация, загрузка init вывод имя, группа");
        var initData = getDataJson('connector.php?get=init', 'json');
        $("a#username").html("Ты вошёл как: " + initData.userInfo.name);
        $("a#role").html("Твоя группа: " + initData.userInfo.nameRole);
    }

    var searchElements = {
        url: 'connector.php?get=search',
        elements: [
            'input#customer_name',
            'input#customer_phone',
            'input#customer_car_vin',
            'input#customer_car_gv_number',
            'input#customer_car_name'
        ]
    };

    function searchAutocomplete(options) {
        options.elements.forEach(function (elem) {
            search(elem, options.url);
        })
    }


  //  $('#edit_event_button').click
    function editEvent() {

        //Заполняем селекторы с боксами
        fillSelector('select#repair_box_id', resources, 'title', 'more'); // ремонтные боксы
        var selBoxVal = $('select#repair_box_id').val(); //Берем текущее значение бокса
        fillSelector('select#repair_post_id', resources, 'title', selBoxVal);//Ремонтные посты
        var type = getDataJson('connector.php?get=repairType', 'boxid=' + selBoxVal);   //Загружаем типы работ
        fillSelector('select#repair_type_id', type, 'name', 'more'); //заполняем Типы работ
        fillSelector('select#user_target_name', users, 'name', 'more'); //Заполняем механиков
        searchAutocomplete(searchElements);
        fillSelector('select#state', state, 'name', 'more');//Заполняем статус события
        $('#editEvent').modal('show');
    };

    $('#edit_event_button').click(function () {
        //Заполняем селекторы с боксами
        fillSelector('select#repair_box_id', resources, 'title', 'more'); // ремонтные боксы
        var selBoxVal = $('select#repair_box_id').val(); //Берем текущее значение бокса
        fillSelector('select#repair_post_id', resources, 'title', selBoxVal);//Ремонтные посты
        var type = getDataJson('connector.php?get=repairType', 'boxid=' + selBoxVal);   //Загружаем типы работ
        fillSelector('select#repair_type_id', type, 'name', 'more'); //заполняем Типы работ
        fillSelector('select#user_target_name', users, 'name', 'more'); //Заполняем механиков
        searchAutocomplete(searchElements);
        fillSelector('select#state', state, 'name', 'more');//Заполняем статус события
        $('#editEvent').modal('show');
    });


    $('#add_event_button').click(function () {
        //Заполняем селекторы с боксами
        fillSelector('select#repair_box_id', resources, 'title', 'more'); // ремонтные боксы
        var selBoxVal = $('select#repair_box_id').val(); //Берем текущее значение бокса
        fillSelector('select#repair_post_id', resources, 'title', selBoxVal);//Ремонтные посты
        var type = getDataJson('connector.php?get=repairType', 'boxid=' + selBoxVal);   //Загружаем типы работ
        fillSelector('select#repair_type_id', type, 'name', 'more'); //заполняем Типы работ
        fillSelector('select#user_target_name', users, 'name', 'more'); //Заполняем механиков
        searchAutocomplete(searchElements);
        fillSelector('select#state', state, 'name', 'more');//Заполняем статус события
        $('#createEvent').modal('show');
    });

    $('#reload').off('click').on('click', function () {
        console.log('Обновление');
        $('#calendar').fullCalendar('refetchEvents');
    });

    console.log('Обновление');
    $('#calendar').fullCalendar('refetchEvents');

    $('#sendCreateBtn').off('click').on('click', function (e) {

        e.preventDefault();

        var formData = $('#createEventForm').serializeArray();

        // check form
        var result = {};
        formData.forEach(function (v) {
            result[v.name] = v.value;
        });

        var formAnswer = getDataJson('connector.php?get=addEvent', result);

        jQuery.each(formAnswer, function (i, val) {

            if (val == false) {
                $('.' + i).removeClass('has-success');
                $('.' + i).addClass('has-error');
                console.log(i + " " + val);

            } else {
                $('.' + i).removeClass('has-error');
                $('.' + i).addClass('has-success');
                console.log(i + " " + val);
            }

            if (i == 'error_datetime' && val == 'end_times_longer') {
                alert('Начальное время больше или равно конечному!');
            }
            if (i == 'error_datetime' && val == 'internal_error_wrong_format') {
                alert('Внутренняя ошибка, формат времени!');
            }

        });
        console.log('Првиет');
        $('#calendar').fullCalendar('refetchEvents');
    });


    $(function () { // document ready

        $('#calendar').fullCalendar({
            schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
            now: new Date(),
            height: 700,
            editable: true, // enable draggable events
            aspectRatio: 1.8,
            scrollTime: '00:00', // undo default 6am scrollTime
            header: {
                left: 'today prev,next',
                center: 'title',
                right: 'timelineDay,timelineThreeDays,agendaWeek,month'
            },
            timeFormat: 'H:mm',
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            monthNamesShort: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сент.', 'Окт.', 'Ноя.', 'Дек.'],
            dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
            dayNamesShort: ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
            buttonText: {
                prev: "Назад",
                next: "Вперед",
                prevYear: "Предыдущий год",
                nextYear: "Следующий год",
                today: "Сегодня",
                month: "Месяц",
                week: "Неделя",
                day: "День"
            },
            defaultView: 'timelineDay',
            views: {
                timelineThreeDays: {
                    type: 'timeline',
                    duration: {days: 3}
                },
            },

            resourceLabelText: 'Боксы и посты',

            resources: { // you can also specify a plain string like 'json/resources.json'
                url: 'connector.php?get=resources',
                //url: 'json/resources.json',
                error: function () {
                    $('#script-warning').show();
                }
            },

            events: { // you can also specify a plain string like 'json/events.json'
                url: 'connector.php?get=events',
                //url: 'json/events.json',
                error: function () {
                    $('#script-warning').show();
                }
            },

            eventMouseover: function (event, jsEvent) {
                var tstart = new Date(event.start);
                var start = tstart.toLocaleTimeString();

                var tend = new Date(event.end);
                var end = tend.toLocaleTimeString();

                var tooltip = '<div class="tooltipevent panel panel-primary" style="position:absolute;z-index:10001;">' +
                    '<div class="panel-body">Событие #' + event.id + ' ' + event.event_name + '' +
                    '</div><div class="panel-footer">' +
                    '<a>Время: </a>' + start + ' до ' + end + '<br>' +
                    '<a>Заказчик: </a>' + event.customer_name + '<br>' +
                    '<a>Исполнитель: </a>' + event.mechanic + '<br>' +
                    '<a>Название авто: </a>' + event.customer_car_name + '<br>' +
                    '<a>Гос номер: </a>' + event.customer_car_gv_number + '<br>' +
                    '<a>VIN: </a>' + event.customer_car_vin + '<br>' +
                    '<a>Километраж: </a>' + event.customer_car_mileage + '<br>' +

                    '</div></div></div>';

                $("body").append(tooltip);
                $(this).mouseover(function (e) {
                    $(this).css('z-index', 10000);
                    $('.tooltipevent').fadeIn('500');
                    $('.tooltipevent').fadeTo('10', 1.9);
                }).mousemove(function (e) {
                    $('.tooltipevent').css('top', e.pageY + 10);
                    $('.tooltipevent').css('left', e.pageX + 20);
                });
            },

            eventMouseout: function (event, jsEvent) {
                $(this).css('z-index', 8);
                $('.tooltipevent').remove();
            },

            eventClick: function (event) {
                console.log(event.id);
                editEvent();
            }
        });

    });


});
