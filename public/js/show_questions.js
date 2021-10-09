$(document).ready(function(){
    
/*** Exibe os enunciados das questões ***/
    let quills = [];
    let cards = $('.question-card .question-card-statement');

    // Cria os Quill Containers para os enunciados
    for (let i = 0, statement ; i < cards.length ; i++) {
        // Pega o delta que estava impresso
        statement = cards[i].innerHTML;

        // Pega o delta que estava impresso
        quills.push(
            new Quill(cards[i], {theme: 'bubble', enable: 'false', readOnly: true})
        );
        quills[i].setContents(JSON.parse(questions[i].statement)); 
        quills[i].disable();
    }
    $('#results').css({display: 'flex'}).hide().fadeIn(300);

/*** Fecha overlay dos detalhes da questão ***/
    function closeDetails(){
        $('.showing-quest').fadeOut(200);
    }    
    $('#quest-details').on('mouseleave', () => {
        $('.showing-quest').on('click', closeDetails);
    });
    $('#quest-details').on('mouseenter', () => {
        $('.showing-quest').off('click',closeDetails);
    });

/*** Exibe detalhes da questão clicada ***/
    $('.question-card').on('click', (e) => {

        let questCard; // Armazenará o card (elemento) clicado

        (!$(e.target).hasClass('question-card')) ? // Caso clique nos elementos filhos
            questCard = $(e.target).parents('.question-card')
            :
            questCard = $(e.target);

        // Pega o id da questão clicada
        let questId = questCard.attr('id');

        let question; // Armazenará a questão e seus atributos

        // Percorre a var questions (declarada inline no .html) em busca da questão clicada
        for(q in questions){
            if(questions[q].id == questId){
                question = questions[q];
                break;
            }
        }

        // Inserindo os detalhes da questão de fato 
        $('#quest-details').empty();
        $('#quest-details').append(
            '<div id="quest-details-header">'+
                '<div id="tags">'+
                    '<div class="question-tag tag-subject">'+question.subject_name+'</div>'+
                    '<div class="question-tag tag-content">'+question.content+'</div>'+
                    '<div class="question-tag tag-type">'+question.type+'</div>'+
                '</div>'+
                '<img class="x" src="/img/icons/ico_plus.svg" alt="X" title="Fechar">'+
            '</div>'+
            '<div class="simple-line"></div>'+
            '<div id="quest-details-content">'+
                '<span id="question-statement"></span>'+
            '</div>'
        );
        let statement = new Quill('#question-statement', {theme: 'bubble', enable: 'false', readOnly: 'true'});
        statement.setContents(JSON.parse(question.statement));
        statement.disable();

        $('.x').on('click', closeDetails);
        $('.showing-quest').fadeIn(200).css('display', 'flex');
    });
});