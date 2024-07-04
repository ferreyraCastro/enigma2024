// inicializamos un array de arrays con la preguntas del juego.
var questions = [
    [
        "Nacido de una diosa marina y un rey mortal, fue sumergido en un río sagrado, quedando invulnerable salvo por un talón vulnerable.",
        "Perseo",
        "Semidios",
        "Dios",
        "Aquiles",
        1
    ],
    [
        "En la guerra de Troya, un héroe sin igual, con fuerza y valentía, su nombre es inmortal. Tres hazañas realizó, su fama se extendió, y en la historia, su legado perduró.",
        "3",
        "1",
        "5",
        "2",
        3
    ],
];

// Array de imágenes de fondo para cada pregunta
var backgroundImages = [
    'url(./img/imagen1.jpg)',
    'url(./img/imagen2.jpg)',
];

// Aquí utilizamos UnderscoreJS para generar un template de pregunta.
var questionTemplate = _.template(" \
    <div class='card question'><span class='question'><%= question %></span> \
      <ul class='options'> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='0' id='q<%= index %>o1'> \
          <label for='q<%= index %>o1'><%= a %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='1' id='q<%= index %>o2'> \
          <label for='q<%= index %>o2'><%= b %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='2' id='q<%= index %>o3'> \
          <label for='q<%= index %>o3'><%= c %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='3' id='q<%= index %>o4'> \
          <label for='q<%= index %>o4'><%= d %></label> \
        </li> \
      </ul> \
    </div> \
    ");

// Definimos las variables de estado del juego y los valores iniciales.
var currentQuestion,
    questionTimer,
    timeForQuestion = 25, // segundos
    timeLeftForQuestion;

// Manipulacion de elementos con JQuery.
$(function() {

    // Uso de jQuery para escuchar el evento click del botón de Comenzar y Volver a jugar.
    $('button.start').click(start);
    $('.play_again button').click(restart);

    // La función restart inicializa los valores de las variables de estado del juego.
    function restart() {
        currentQuestion = 0;
        timeLeftForQuestion = timeForQuestion;

        $('.finish.card').hide();
        $('div.start').show();
        $('.incorrect_message').hide();

        generateCards();
        updateTime();
    }

    // La función start se ejecuta cuando el jugador hace click en comenzar.
    function start() {
        $('div.start').fadeOut(200, function() {
            moveToNextQuestion();
        });
    }

    // Esta es una de las funciones clave del juego, encargada de generar las preguntas.
    function generateCards() {
        $('.questions').html('');
        for (var i = 0; i < questions.length; i++) {
            var q = questions[i];
            var html = questionTemplate({
                question: q[0],
                index: i,
                a: q[1],
                b: q[2],
                c: q[3],
                d: q[4]
            });
            $('.questions').append(html);
        };

        // Indicamos que nos interesa el evento change de los inputs dentro de los elementos con clase question y card (cada una de las preguntas).
        $('.question.card input').change(optionSelected);
    }

    // Esta función cambia el estado del juego para pasar de una pregunta a la siguiente.
    function moveToNextQuestion() {
        currentQuestion += 1;
        if (currentQuestion > 1) {
            $('.question.card:nth-child(' + (currentQuestion-1) + ')').hide();
        }

        // Se muestra la siguiente pregunta.
        showQuestionCardAtIndex(currentQuestion);
        setupQuestionTimer();
    }

    // Esta función inicializa el temporizador para responder una pregunta.
    function setupQuestionTimer() {
        if (currentQuestion > 1) {
            clearTimeout(questionTimer);
        }
        timeLeftForQuestion = timeForQuestion;

        // Cada 1 segundo, nuestro temporizador llamará a la función countdownTick().
        questionTimer = setTimeout(countdownTick, 1000);
    }

    // Mostramos la tarjeta de pregunta correspondiente al índice que la función recibe por parámetro.
    function showQuestionCardAtIndex(index) { // starting at 1
        var $card = $('.question.card:nth-child(' + index + ')').show();
        
        // Cambiar el fondo del <main> con la imagen correspondiente
        $('body').css('background-image', backgroundImages[index - 1]);
    }

    // La función countdownTick() se ejecuta cada un segundo, y actualiza el tiempo restante para responder en la pantalla del jugador.
    function countdownTick() {
        timeLeftForQuestion -= 1;
        updateTime();
        if (timeLeftForQuestion == 0) { 
            return showIncorrectMessage();
        }
        questionTimer = setTimeout(countdownTick, 1000);
    }

    // Actualiza el tiempo restante en pantalla, utilizando la función html().
    function updateTime() {
        $('.countdown .time_left').html(timeLeftForQuestion + 's');
    }

    // Esta función se ejecuta cuando el jugador escoge una respuesta.
    function optionSelected() {
        var selected = parseInt(this.value);
        var correct = questions[currentQuestion-1][5];

        if (selected == correct) {
            if (currentQuestion == questions.length) {
                clearTimeout(questionTimer);
                return finish();
            }
            moveToNextQuestion();
        } else {
            showIncorrectMessage();
        }
    }

    // Muestra un mensaje de incorrecto y recarga la página.
    function showIncorrectMessage() {
        alert('Respuesta incorrecta. La página se recargará.');
        location.reload();
    }

    // Cuando el juego termina, esta función es ejecutada.
    function finish() {
        $('.question.card:visible').hide();
        $('.finish.card').show();
    }

    // Iniciar el juego al cargar la página
    restart();

});
