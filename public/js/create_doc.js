$(document).ready(function() {

/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/
/*******            Este código contém a lógica necessária para o funcionamento do cadastro e edição de documentos.                 ********/
/*******                O código exclusivo para a edição de documentos está ao final, após o próximo divisor.                       ********/
/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/

    /****************************************************************/
    /*********** Exibe o ambiente de seleção de questões ************/
    /****************************************************************/

    var selectedQuestions = [];

    $('#add-question-btn').on('click', () => {
        $('.add-question-overlay').fadeIn(200).css('display', 'flex');
    });

    /***************************************************/
    /****** Fecha overlay de seleção de questões *******/
    /***************************************************/

    function closeDialog(){
        $('.add-question-overlay').fadeOut(200);
        setTimeout(() => {
            $('#results').empty();
            $('#results').append(
                '<span>&larr;&nbsp;&nbsp;&nbsp; Especifique a busca inserindo um termo de busca.</span><br><br><br>'+
                '<span>&larr;&nbsp;&nbsp;&nbsp; Escolha ao menos uma disciplina para começar.</span>'
            );
            selectedQuestions = [];
            updateSelectedCount();
            blockOrUnlockInsertion();
        }, 200);  
    }
    $('.x').on('click', closeDialog);
    $('#add-question-dialog').on('mouseleave', () => {
        $('.add-question-overlay').on('click', closeDialog);
    });
    $('#add-question-dialog').on('mouseenter', () => {
        $('.add-question-overlay').off('click',closeDialog);
    });


    /**************************************************/
    /********* Imprime os cards das questões **********/
    /**************************************************/

    function appendQuests(){

    /************** Caso retorne questões **************/
        if (questions.length) {
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
                    '<div id="result-'+q+'" class="result">'+
                        '<div id="'+questions[q].id+'" class="question-card simple-box">'+
                            '<div class="question-tag tag-subject">'+questions[q].subject_name+'</div>'+
                            '<div class="question-tag tag-content">'+questions[q].content+'</div>'+
                            '<div class="question-tag tag-type">'+questions[q].type+'</div>'+
                            '<span class="question-card-statement">'+questions[q].statement+'</span>'+
                        '</div>'+
                    '</div>'
                );

                if (questions[q].private) {
                    $('#result-'+q+' > .question-card').prepend(
                        '<img src="/img/icons/ico_lock.svg" style="width: 10px;" title="Só você tem acesso a esta questão.">'
                    );
                }

                $('#result-'+q).append(
                    '<label for="q-'+q+'" class="checkbox-label" title="Selecionar">'+
                        '<input type="checkbox" class="simple-box" id="q-'+q+'" value="'+questions[q].id+'">'+
                        '<div class="checkbox"><div class="checkmark"></div></div>'+
                    '</label>'
                );
                // Marca a checkbox caso a questão já esteja selecionada 
                if (questions[q].id == selectedQuestions.find((quest) => {
                    if (quest == questions[q].id) return true;
                    else return false;
                })) {
                    $('#q-'+q)[0].checked = true;
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
            $('#results').append('<div id="quest-details" class="simple-box"></div>');
            $('.result input[type=checkbox]').on('change', selectQuestion);
        }

    /************** Caso a filtragem ou busca não retorne nenhuma questão **************/
        else {
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

    /******************************************************/
    /********* Permite marcar todas as checkboxes *********/
    /******************************************************/

    // Copyright: Saran, 2014. https://www.sanwebe.com/2014/01/how-to-select-all-deselect-checkboxes-jquery

    //select all checkboxes
    $("#all").change(function(){  //"select all" change 
        var status = this.checked; // "select all" checked status
        $('#filters .checkbox-label input').each(function(){ //iterate all listed checkbox items
            this.checked = status; //change ".checkbox" checked status
        });
    });

    $('#filters .checkbox-label input').change(function(){ //".checkbox" change 
        //uncheck "select all", if one of the listed checkbox item is unchecked
        if(this.checked == false){ //if this item is unchecked
            $("#all")[0].checked = false; //change "select all" checked status to false
        }
        
        //check "select all" if all checkbox items are checked
        if ($('#filters .checkbox-label input:checked').length == $('#filters .checkbox-label input').length-1 ){ 
            $("#all")[0].checked = true; //change "select all" checked status to true
        }
    });

    /***************************************************************************/
    /********* Impede que deixe grupos de checkboxes sem marcar nenhum *********/
    /***************************************************************************/

    $('#filters .checkbox-label input').on('change', checkFilters);

    function checkFilters() {
        let filterSubjectsCheck = false;

        // Na aba "Procurar questões", não há esses filtros, então a condição será verdadeira sempre
        let filterAnyUserCheck = $('#all-questions')[0].checked;
        let filterMyQuestsCheck = $('#my-questions')[0].checked;
        let filterPrivateCheck = $('#private-questions')[0].checked;
        let filterFavoriteCheck = $('#favorite-questions')[0].checked;

        let subjectsInputs = $('#filter-subjects input');

        for (i = 0; i < subjectsInputs.length; i++) {
            if (subjectsInputs[i].checked == true) {
                filterSubjectsCheck = true;
                break;
            }
        }

        if ( (!filterAnyUserCheck && !filterMyQuestsCheck && !filterPrivateCheck && !filterFavoriteCheck)
            || (!filterSubjectsCheck)
            || (!$('#alternative')[0].checked && !$('#essay')[0].checked) ) {
            
            $('#filter-btn').css({
                userSelect: 'none',
                pointerEvents: 'none',
                filter: 'grayscale(100%)',
                opacity: '.6'
            })
            .removeAttr('type');  
        }
        else {
            $('#filter-btn').removeAttr('style').attr('type', 'submit');
        }
    }
    checkFilters();


    /******************************************************/
    /*********** Faz a filtragem dos resultados ***********/
    /******************************************************/

    /******** Aplica os filtros ********/
    $('#filters').on('submit', (e) => {
        e.preventDefault();

        // Caso todos os filtros estejam selecionados, envia somente "all: 1", senão, envia todos os marcados
        let data;     
        if ($('#all')[0].checked) {
            data = {all: $('#all').val(),
                    _token: $("#filters :input[name='_token']").val(),
                    search: $('#search-box').val()};
        }
        else {
            data = $(e.target).serialize();
            
            // Se houver termo de busca, manda junto
            if ($('#search-box').val()) {
                data += '&search='+$('#search-box').val();  
            }
        }
        

        // Posta via AJAX
        $.ajax({
            url: '/filter_doc_quests',
            type: 'post',
            data: data,
            dataType: 'json',
            success: (response) => {
                questions = response;
                questions.sort((a,b) => (a.subject_id > b.subject_id) ? 1 : ((b.subject_id > a.subject_id) ? -1 : 0)); // Coloca as questões por ordem de disciplina
                questions.sort((a,b) => (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0)); // Coloca as questões por ordem de disciplina
                // console.log(questions);
                appendQuests();
            }
        });
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

        // // Não exibe os detalhes e marca a checkbox caso clicada
        // if ($(e.target).hasClass('checkbox')) {
        //     $(e.target).siblings('input')[0].checked == true ? 
        //         $(e.target).siblings('input')[0].checked = false:
        //         $(e.target).siblings('input')[0].checked = true;
        //     return false;
        // }
        // else if ($(e.target).hasClass('checkmark')) {
        //     $(e.target).parent().siblings('input')[0].checked = false; 
        //     return false;
        // }

        // Pega o id da questão clicada
        let questId = questCard.attr('id');

        let question; // Armazenará a questão e seus atributos

        // Percorre as questões (advindas da filtragem) em busca da questão clicada
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
                '<div id="right-info">'+
                    '<label for="q-current" class="checkbox-label">'+
                        '<input type="checkbox" class="simple-box" id="q-current" value="'+questions[q].id+'">'+
                        '<div id="select-current">Selecionar</div>'+    
                    '</label>'+
                    '<img class="x" src="/img/icons/ico_plus.svg" alt="X" title="Fechar">'+
                '</div>'+
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
                
        // Botão de selecionar

            // Quando exibe os detalhes, marca como selecionado ou não de acordo com as questões selecionadas
            if ($('#q-current').val() == selectedQuestions.find((quest) => {
                if (quest == questions[q].id) return true;
                else return false;
            })) {
                $('#select-current').html('Selecionada <div class="checkmark"></div>').css({
                    color: 'var(--color1)',
                    backgroundColor: 'transparent',
                }).addClass('selected').attr('title', 'Remover');
            }
            else {
                $('#select-current').html('Selecionar').css({
                    color: 'grey',
                    backgroundColor: '#ddd',
                }).removeClass('selected').removeAttr('title');
            }

            // Seleciona ou desseleciona a questão
            $('#select-current').on('click', () => {
                if (!$('#select-current').hasClass('selected')) {
                    $('#select-current').html('Selecionada <div class="checkmark"></div>').css({
                        color: 'var(--color1)',
                        backgroundColor: 'transparent',
                    }).addClass('selected').attr('title', 'Remover');

                    // Inclui nas selecionadas e marca a checkbox
                    selectedQuestions.push(Number($('#q-current').val()));
                    $('.result input[value='+$('#q-current').val()+']')[0].checked = true;
                    updateSelectedCount();
                }
                else {
                    $('#select-current').html('Selecionar').css({
                        color: 'grey',
                        backgroundColor: '#ddd',
                    }).removeClass('selected').removeAttr('title');

                    // Remove das selecionadas e desmarca a checkbox
                    selectedQuestions.splice(
                        selectedQuestions.findIndex((q) => {
                            if (q == questId) return true;   
                            else return false;
                        }),
                    1);
                    $('.result input[value='+$('#q-current').val()+']')[0].checked = false;
                    updateSelectedCount();
                }
                blockOrUnlockInsertion();
            });

        $('#quest-details').slideDown(200).css('display', 'grid');
        $('#no-quests').hide();

        $('.x').on('click', () => {
            $('#quest-details').slideUp(200);
            setTimeout(() => {$('#no-quests').show()}, 200);
        });
    }

    /**************************************************************************/
    /******** Seleciona e desseleciona as questões que serão inseridas ********/
    /**************************************************************************/

    function selectQuestion(e) {
        let questId = Number(e.target.value);
        if (e.target.checked == true) {
            selectedQuestions.push(questId);
        }
        else {
            selectedQuestions.splice(
                selectedQuestions.findIndex((q) => {
                    if (q == questId) return true;   
                    else return false;
                }),
            1);
        }
        updateSelectedCount();
        blockOrUnlockInsertion();
    }

    /******************************************************************************/
    /*********** Bloqueia o botão de inserir quando nenhuma selecionada ***********/
    /******************************************************************************/

    function blockOrUnlockInsertion() {
        if (selectedQuestions.length === 0) {
            $('#insert-questions').css({
                userSelect: 'none',
                pointerEvents: 'none',
                filter: 'grayscale(100%)',
                opacity: '.4'
            }).off('click');
        }
        else {
            $('#insert-questions').off('click');
            $('#insert-questions').on('click', getQuestions).removeAttr('style');
        }
    }
    blockOrUnlockInsertion();

    /************************************************************************/
    /************** Atualiza o número de questões selecionadas **************/
    /************************************************************************/

    function updateSelectedCount() {
        $('#selected-questions b').html(selectedQuestions.length);
    }
    updateSelectedCount();

    /***********************************************************************/
    /*********** Puxa do banco e insere as questões selecionadas ***********/
    /***********************************************************************/

    function getQuestions() {
        $('#insert-questions').off('click');
        let questionsIds = '';
        selectedQuestions.find((q) => {
            questionsIds += q+';';
        });
        let data = {
            ids: questionsIds,
            _token: $('input[name=_token]').val()
        };
        console.log(data)

        $.get('/insert_doc_quests', data)
            .done((response => {
                let questions = JSON.parse(response);
                for (q of questions) {
                    insertQuestion(q);
                }
                closeDialog();
            })
        );
    }

    function insertQuestion(q) {
        $('#doc').append(
            '<div class="question simple-box" data-question-id="'+q.id+'">'+
                '<div class="statement">'+q.statement+'</div>'+
                '<div>dfas jhfd kajfkjafkda hfkdaj fkajdfhklajhdfk ljah kfjdha kfjldhadfas jhfd kajfkjafkda hfkdaj fkajdfhklajhdfk ljah kfjdha kfjldha kfjah sdkjfha sddfas jhfd kajfkjafkda hfkdaj fkajdfhklajhdfk ljah kfjdha kfjldha kfjah sdkjfha sddfas jhfd kajfkjafkda hfkdaj fkajdfhklajhdfk ljah kfjdha kfjldha kfjah sdkjfha sddfas jhfd kajfkjafkda hfkdaj fkajdfhklajhdfk ljah kfjdha kfjldha kfjah sdkjfha sddfas jhfd kajfkjafkda hfkdaj fkajdfhklajhdfk ljah kfjdha kfjldha kfjah sdkjfha sddfas jhfd kajfkjafkda hfkdaj fkajdfhklajhdfk ljah kfjdha kfjldha kfjah sdkjfha sd</div>'+
            '</div>'
        );
        $('[data-question-id='+q.id+']').on('click', () => {
            $('[data-question-id='+q.id+']').css({height: 'fit-content'}) // css-tricks do the trick (animate height/width to "auto")
        })
    }

/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/
/********************************************************* Código para a edição de documentos **********************************************/
/*******************************************************************  a seguir  ************************************************************/
/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/
});