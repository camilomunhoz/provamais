$(document).ready(function(){

    // Coloca as questões por ordem de disciplina e conteúdo
    if (questions[0] != 'empty') {    
        questions.sort((a,b) => (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0));
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
            
            /************** Exibe o termo de busca esteja sendo buscado **************/

            if ($('#search-box').val()) {
                $('#results').append(
                    '<span id="no-quests">Procurando por "<b>'+$('#search-box').val()+'</b>"</span>'
                );  
            } 
            
            /************** Cria e insere os cards **************/

            for (q in questions) {

                $('#results').append(
                    '<div id="card-'+q+'">'+
                        '<div id="'+questions[q].id+'" class="question-card simple-box">'+
                            '<div class="question-tag tag-subject">'+questions[q].subject_name+'</div>'+
                            '<div class="question-tag tag-content">'+questions[q].content+'</div>'+
                            '<div class="question-tag tag-type">'+questions[q].type+'</div>'+
                            '<span class="question-card-statement">'+questions[q].statement+'</span>'+
                        '</div>'+
                    '</div>'
                );

                if (questions[q].private) {
                    $('#card-'+q+' > div').prepend(
                        '<img src="/img/icons/ico_lock.svg" style="width: 10px;" title="Só você tem acesso a esta questão.">'
                    );
                }

                if ($('#public-questions').length) {  // Micro gambiarra pra exibir o "edit" e "delete" somente em "Minhas questões"
                    $('#card-'+q+' > div').append(
                        '<a href="/edit_quest/'+questions[q].id+'" class="question-action edit" title="Editar"><img src="/img/icons/ico_edit.svg"></a>'+
                        '<div class="question-action remove" title="Apagar"><img class="trash" src="/img/icons/ico_trash.png"></div>'
                    );
                }
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

            if ($('#search-box').val()) {
                $('#results').append(
                    '<span id="no-quests">Procurando por "<b>'+$('#search-box').val()+'</b>"</span>'
                );  
            } 
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

        // Caso clique nos elementos filhos
        (!$(e.target).hasClass('question-card')) ? 
            questCard = $(e.target).parents('.question-card')
            :
            questCard = $(e.target);

        // Pega o id da questão clicada
        let questId = questCard.attr('id');
        
        if ( // Caso clique em "apagar" ou "editar"
            ($(e.target).attr('id') == 'remove') ||
            ($(e.target).attr('id') == 'edit')   ||
            ($(e.target).hasClass('btn-remove')) ||
            ($(e.target).prop('nodeName') == 'IMG')
        ){
            if ($(e.target).hasClass('trash') && !questCard.children('.btn-remove').length) {
                $(e.target).attr('title', 'Cancelar');
                questCard.append(
                    '<a href="/remove_quest/'+questId+'" class="confirmation-btn-hard btn-remove">Apagar</a>'
                );
            }
            else if ($(e.target).hasClass('trash') && questCard.children('.btn-remove').length) {
                $(e.target).attr('title', 'Apagar');
                $('.btn-remove').remove();
            }
            return;
        }


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
        if (questions[q].private) {
            $('#tags').prepend(
                '<img src="/img/icons/ico_lock.svg" style="width: 10px;" title="Só você tem acesso a esta questão.">'
            );
        }

        let statement = new Quill('#question-statement', {theme: 'bubble', enable: 'false', readOnly: 'true'});
        statement.setContents(JSON.parse(question.statement));
        statement.disable();
        
        if(question.image){
            $('#quest-details-content').append(
                '<img id="question-image" src="/img/questions_images/'+question.image+'">'
            );
        }
        if(question.answer_suggestion){
            $('#quest-details-content').append(
                '<span id="question-answer"><strong>Sugestão de resposta:</strong> '+question.answer_suggestion+'</span>'
            );
        }
        if(question.options && question.options.length){
            let correct;
            $('#quest-details-content').append(
                '<div id="question-options"></div>'
            );
            for(let i = 0; i < question.options.length; i++){
                $('#question-options').append(
                    '<div class="option-container opt-'+i+'"></div>'
                );
                $('.opt-'+i).append(
                    '<span class="option-enumerator"><b>&#'+(97+i)+';)</b></span>'+
                    '<div class="question-option o'+i+'"></div>'
                );
                let option = new Quill('.o'+i, {theme: 'bubble', enable: 'false', readOnly: 'true'});
                option.setContents(JSON.parse(question.options[i].content));
                option.disable();
                if (question.options[i].correct) correct = i;
            }
            $('#quest-details-content').append(
                '<div id="question-answer" style="text-align: right; padding-right: 10px;"><strong>Alternativa correta:</strong> &#'+(65+correct)+';</div>'
            );
        }
        $('#quest-details-content').append(
            '<div class="simple-line"></div>'
        );
        if (question.type == 'Dissertativa') {
            $('#quest-details-content').append(
                '<span id="n-lines">Resposta de no máximo <strong>'+question.n_lines+'</strong> linhas.</span>'
            );
        }
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

        // Na aba "Procurar questões", não há esses filtros, então a condição será verdadeira sempre
        let filterPublicCheck = true;
        let filterPrivateCheck = true;
        let filterFavoriteCheck = true;

        let subjectsInputs = $('#filter-subjects input');
        
        // Somente mudará de estado caso exista "#public-questions", isto é, em "Minhas questões"
        if ($('#public-questions').length) {
            filterPublicCheck = $('#public-questions')[0].checked;
            filterPrivateCheck = $('#private-questions')[0].checked;
            filterFavoriteCheck = $('#favorite-questions')[0].checked;
        }

        for (i = 0; i < subjectsInputs.length; i++) {
            if (subjectsInputs[i].checked == true) {
                filterSubjectsCheck = true;
                break;
            }
        }

        if ( (!filterPublicCheck && !filterPrivateCheck && !filterFavoriteCheck)
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
            data = {all: $('#all-questions').val(), _token: $("#filters :input[name='_token']").val()};
            $('#search-box').val('');
        }
        else {
            data = $(e.target).serialize();
            if ($('#search-box').val()) {
                data += '&search='+$('#search-box').val();  
            } 
        }

        // Posta via AJAX
        $.ajax({
            url: $('#public-questions').length ? '/filter_my_quests' : '/filter_quests', // Micro gambiarra pra saber se filtra "Minhas questões" ou "Procurar questões"
            type: 'post',
            data: data,
            dataType: 'json',
            success: (response) => {
                questions = response;
                questions.sort((a,b) => (a.subject_id > b.subject_id) ? 1 : ((b.subject_id > a.subject_id) ? -1 : 0)); // Coloca as questões por ordem de disciplina
                questions.sort((a,b) => (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0)); // Coloca as questões por ordem de conteúdo
                console.log(questions);
                appendQuests();
            }
        });
    });

    /******** Procura por palavra-chave ********/
    $('#header-right-items').on('submit', (e) => {
        e.preventDefault();

        // Marca todos os filtros
        for ($i of $('#filters input')) {
            $i.checked = true;
        }
        
        // Posta via AJAX
        $.ajax({
            url: '/search_my_quests',
            type: 'post',
            data: $(e.target).serialize(),
            dataType: 'json',
            success: (response) => {
                questions = response;
                questions.sort((a,b) => (a.subject_id > b.subject_id) ? 1 : ((b.subject_id > a.subject_id) ? -1 : 0)); // Coloca as questões por ordem de disciplina
                questions.sort((a,b) => (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0)); // Coloca as questões por ordem de disciplina
                console.log(questions);
                appendQuests();
            },
        });
    });


});