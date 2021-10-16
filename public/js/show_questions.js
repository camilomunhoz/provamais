$(document).ready(function(){

    // Coloca as questões por ordem de disciplina
    if (questions[0] != 'empty') {    
        questions.sort((a,b) => (a.subject_id > b.subject_id) ? 1 : ((b.subject_id > a.subject_id) ? -1 : 0));
    }
    console.log(questions);

/**************************************************/
/********* Imprime os cards das questões **********/
/**************************************************/

    function appendQuests(){

    /************** Caso o usuário tenha questões **************/
        if (questions.length && questions[0] != 'empty') {
            $('#results').empty();
            
            /************** Exibe o termo de busca caso exista **************/

            if ($('#search-box').val()) {
                $('#results').append(
                    '<span id="no-quests">Procurando por "<b>'+$('#search-box').val()+'</b>"</span>'
                );  
            } 
            
            /************** Cria e insere os cards **************/

            for (q in questions) {
                $('#results').append(
                    '<div>'+
                        '<div id="'+questions[q].id+'" class="question-card simple-box">'+
                            '<div class="question-tag tag-subject">'+questions[q].subject_name+'</div>'+
                            '<div class="question-tag tag-content">'+questions[q].content+'</div>'+
                            '<div class="question-tag tag-type">'+questions[q].type+'</div>'+
                            '<span class="question-card-statement">'+questions[q].statement+'</span>'+
                        '</div>'+
                    '</div>'
                );
            }

            /************** Exibe os enunciados das questões **************/

            let quills = [];
            let cards = $('.question-card .question-card-statement');

            // Cria os Quill Containers para os enunciados
            for (let i = 0 ; i < cards.length ; i++) {
                quills.push(
                    new Quill(cards[i], {theme: 'bubble', enable: 'false', readOnly: true})
                );
                quills[i].setContents(JSON.parse(questions[i].statement)); 
                quills[i].disable();
            }
            $('.question-card').on('click', showDetails);
        }

    /************** Caso a filtragem ou busca não retorne nenhuma questão **************/
        else if (questions[0] != 'empty') {
            $('#results').empty();
            $('#results').append(
                '<span id="no-quests">Nenhuma questão corresponde aos filtros aplicados.</span>'
            );
        }
            
        $('#results').css({display: 'flex'}).hide().fadeIn(300);
    }
    appendQuests();


/***************************************************/
/****** Fecha overlay dos detalhes da questão ******/
/***************************************************/

    function closeDetails(){
        $('.showing-quest').fadeOut(200);
    }    
    $('#quest-details').on('mouseleave', () => {
        $('.showing-quest').on('click', closeDetails);
    });
    $('#quest-details').on('mouseenter', () => {
        $('.showing-quest').off('click',closeDetails);
    });

/***************************************************/
/******** Exibe detalhes da questão clicada ********/
/***************************************************/
    
    function showDetails(e) {

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
                '<div id="left-info">'+
                    '<div id="owner">'+
                        '<img id="owner-pic" src="/img/users_profile_pics/'+question.user.profile_pic+'">'+
                        '<span>Cadastrada por<br><a href="/profile/'+question.user.id+'" target="_blank">'+question.owner+'</a></span>'+
                    '</div>'+
                    '<div id="tags">'+
                        '<div class="question-tag tag-subject">'+question.subject_name+'</div>'+
                        '<div class="question-tag tag-content">'+question.content+'</div>'+
                        '<div class="question-tag tag-type">'+question.type+'</div>'+
                    '</div>'+
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

        if(question.answer_suggestion){
            $('#quest-details-content').append(
                '<span id="question-answer"><strong>Sugestão de resposta:</strong> '+question.answer_suggestion+'</span>'
            );
        }
        $('#quest-details-content').append(
            '<div class="simple-line"></div>'+
            '<span id="n-lines">Resposta de no máximo <strong>'+question.n_lines+'</strong> linhas.</span>'
        );
        // if(question.other_terms){
            $('#quest-details-content').append(
                '<span id="other-terms"><strong>Outros termos relacionados:</strong> de alguma forma aqui vão os termos</span>'
            );
        // }

        $('.x').on('click', closeDetails);
        $('.showing-quest').fadeIn(200).css('display', 'flex');
    }

/***************************************************/
/********* Insere dinamicamente os filtros *********/
/***************************************************/

    function updateFilters() {
        if (questions[0] != 'empty') {
            let subjects = [];
            for (q in questions){
                subjects.push({id: questions[q].subject_id, name: questions[q].subject_name});
                
                // Elimina duplicatas
                subjects = Array.from(new Set(subjects.map(s => s.id)))
                .map(id => {
                    return subjects.find(a => a.id === id)
                });
            }
            for(s in subjects){
                $('#filter-subjects').append(
                    '<div>'+
                        '<label for="subject-'+s+'" class="checkbox-label">'+
                            '<input type="checkbox" class="simple-box" name="subjects[]" id="subject-'+s+'" checked value="'+subjects[s].id+'">'+
                            '<div class="checkbox"><div class="checkmark"></div></div>'+
                            '<span>'+subjects[s].name+'</span>'+
                        '</label>'+
                    '</div>'
                );
            }
        }
    }
    updateFilters();

/******************************************************/
/********* Permite marcar todas as checkboxes *********/
/******************************************************/

// Copyright: Saran, 2014. https://www.sanwebe.com/2014/01/how-to-select-all-deselect-checkboxes-jquery

    //select all checkboxes
    $("#all-questions").change(function(){  //"select all" change 
        var status = this.checked; // "select all" checked status
        $('.checkbox-label input').each(function(){ //iterate all listed checkbox items
            this.checked = status; //change ".checkbox" checked status
        });
    });

    $('.checkbox-label input').change(function(){ //".checkbox" change 
        //uncheck "select all", if one of the listed checkbox item is unchecked
        if(this.checked == false){ //if this item is unchecked
            $("#all-questions")[0].checked = false; //change "select all" checked status to false
        }
        
        //check "select all" if all checkbox items are checked
        if ($('.checkbox-label input:checked').length == $('.checkbox-label input').length-1 ){ 
            $("#all-questions")[0].checked = true; //change "select all" checked status to true
        }
    });

/***************************************************************************/
/********* Impede que deixe grupos de checkboxes sem marcar nenhum *********/
/***************************************************************************/

    $('.checkbox-label input').on('change', () => {
        let filterSubjectsCheck = false;
        let subjectsInputs = $('#filter-subjects input');
        
        for (i = 0; i < subjectsInputs.length; i++) {
            if (subjectsInputs[i].checked == true) {
                filterSubjectsCheck = true;
                break;
            }
        }

        if ( (!$('#public-questions')[0].checked && !$('#private-questions')[0].checked && !$('#favorite-questions')[0].checked)
            || (!filterSubjectsCheck)
            || (!$('#alternative')[0].checked && !$('#essay')[0].checked) ) {
            
            $('#filter-btn').css({userSelect: 'none', pointerEvents: 'none', filter: 'grayscale(100%)', opacity: '.6'}).removeAttr('type');  
        }
        else {
            $('#filter-btn').removeAttr('style').attr('type', 'submit');  
        }
    });

/******************************************************/
/*********** Faz a filtragem dos resultados ***********/
/******************************************************/

    /******** Aplica os filtros ********/
    $('#filters').on('submit', (e) => {
        e.preventDefault();

        // Caso todos os filtros estejam selecionados, envia somente "all: 1", senão, envia todos os marcados
        let data;
        
        if ($('#all-questions')[0].checked) {
            data = {all: $('#all-questions').val(), _token: $("#filters :input[name='_token']").val()}
        }
        else {
            data = $(e.target).serialize();
            if ($('#search-box').val()) {
                data += '&search='+$('#search-box').val();  
            } 
        }
        console.log(data);

        // Posta via AJAX
        $.ajax({
            url: '/filter_my_quests',
            type: 'post',
            data: data,
            dataType: 'json',
            success: (response) => {
                questions = response;
                questions.sort((a,b) => (a.subject_id > b.subject_id) ? 1 : ((b.subject_id > a.subject_id) ? -1 : 0)); // Coloca as questões por ordem de disciplina
                console.log(questions);
                appendQuests();
            },
            // error:  (jqXHR, textStatus, errorThrown) => { console.log(errorThrown)},
        });

        // 
    });

    /******** Procura por palavra-chave ********/
    $('#header-right-items').on('submit', (e) => {
        e.preventDefault();
        
        // Posta via AJAX
        $.ajax({
            url: '/search_my_quests',
            type: 'post',
            data: $(e.target).serialize(),
            dataType: 'json',
            success: (response) => {
                questions = response;
                questions.sort((a,b) => (a.subject_id > b.subject_id) ? 1 : ((b.subject_id > a.subject_id) ? -1 : 0)); // Coloca as questões por ordem de disciplina
                console.log(questions);
                appendQuests();
            },
        });
    });


});