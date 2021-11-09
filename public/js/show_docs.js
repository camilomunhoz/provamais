$(document).ready(function(){

    /****************************************************/
    /********* Imprime os cards dos documentos **********/
    /****************************************************/

    function appendDocs() {
        $('#docs').empty();

        if (docs[0] != 'empty' && docs.length > 0) {
            
            // Coloca os documentos em ordem alfabética
            if (docs[0] != 'empty') {    
                docs.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            }
            console.log(docs);

            // Insere os cards dos docs
            for (d of docs) {
                $('#docs').append(
                    '<div id="'+d.id+'" class="doc-card simple-box" title="'+d.name+'">'+
                        '<img src="/img/icons/ico_test.svg">'+
                        '<span>'+d.name+'</span>'+
                    '</div>'
                );
                $('#'+d.id).on('click', showDetails);
            }
        }
        else {
            // Insere a instrução de criação
            $('#docs').append(
                '<div id="create-tip">'+
                    '<span>Clique aqui para<br>criar um documento</span><br>'+
                    '<img src="/img/icons/ico_curved_arrow.svg">'+
                '</div>'
            );
        }
    }
    if (docs[0] != 'empty') appendDocs();
    
    /************************************************************/
    /********** Imprime detalhes e ações do documento ***********/
    /************************************************************/

    function showDetails(e) {
        let docCard; // Armazenará o card (elemento) clicado

        // Caso clique nos elementos filhos
        (!$(e.target).hasClass('doc-card')) ? 
            docCard = $(e.target).parents('.doc-card')
            :
            docCard = $(e.target);

        // Pega o id do doc clicado
        let docId = docCard.attr('id');

        let doc; // Armazenará o doc escolhido e seus atributos

        // Percorre a var docs (declarada inline no .html) em busca do doc clicado
        for(d of docs){
            if(d.id == docId){
                doc = d;
                break;
            }
        }

        // Inserindo os detalhes e ações do doc
        $('#doc-details').empty();
        $('#doc-details').append(
            '<div id="doc-details-header">'+
                '<form id="doc-name" data-action="delete_doc" data-doc-id="'+docId+'">'+
                    '<textarea name="name" data-name="'+doc.name+'" class="no-style" spellcheck="false" maxlength="100" disabled>'+doc.name+'</textarea>'+
                '</form>'+
                '<img class="x" src="/img/icons/ico_plus.svg" alt="X" title="Fechar">'+
            '</div>'+
            '<div class="simple-line"></div>'+
            '<div id="doc-actions">'+

                '<div id="rename" class="doc-action" alt="Renomear" title="Renomear">'+
                    '<img src="/img/icons/ico_rename.svg">'+
                    '<span>Renomear</span>'+
                '</div>'+

                '<a id="edit" class="doc-action" href="/edit_doc/'+docId+'" alt="Editar" title="Editar">'+
                    '<img src="/img/icons/ico_edit_doc.svg">'+
                    '<span>Editar</span>'+
                '</a>'+

                '<a id="pdf" class="doc-action" href="/pdf_doc/'+docId+'" alt="Gerar PDF" title="Gerar PDF">'+
                    '<img src="/img/icons/ico_pdf.svg">'+
                    '<span>Gerar PDF</span>'+
                '</a>'+

                '<a id="answers" class="doc-action" href="/pdf_gabarito/'+docId+'" alt="Gabarito" title="Gabarito">'+
                    '<img src="/img/icons/ico_answers.svg">'+
                    '<span>Gabarito</span>'+
                '</a>'+

                '<div id="duplicate" class="doc-action" href="/duplicate_doc/'+docId+'" alt="Duplicar" title="Duplicar">'+
                    '<img src="/img/icons/ico_duplicate.svg">'+
                    '<span>Duplicar</span>'+
                '</div>'+

                '<div id="remove" class="doc-action" href="/remove_doc/'+docId+'" alt="Apagar" title="Apagar">'+
                    '<img src="/img/icons/ico_trash.svg" style="filter: brightness(90%)">'+
                    '<span>Apagar</span>'+
                '</div>'+

            '</div>'
        );

        // Permite o redimensionamento automático da textarea do nome do doc
        $("#doc-name textarea").each(function () {
            setTimeout(() => {
                let scrollHeight = $('#doc-name textarea')[0].scrollHeight;
                this.setAttribute("style", "height:" + (scrollHeight) + "px;overflow-y:hidden;");
            },0);
          }).on("input", function () {
            this.style.height = "0px";
            this.style.height = ($('#doc-name textarea')[0].scrollHeight) + "px";
        });

        // Mostra título da ação quando passa por cima
        function expandAction(e) {
            if (e.target.nodeName == 'A' || e.target.nodeName == 'DIV') {
                $(e.target).children('span').slideDown(100);
            }
            else if (e.target.nodeName == 'IMG') {
                $(e.target).siblings().slideDown(100);
            }
            $('.doc-action').on('mouseleave', minimizeAction);
        }
        $('.doc-action').on('mouseenter', expandAction);

        // Esconde título da ação quando passa por cima
        function minimizeAction(e) {
            $('.doc-action').off('mouseleave');
            let action;
            if (e.target.nodeName == 'A' || e.target.nodeName == 'DIV') {
                $(e.target).children('span').slideUp(100);
                action = $(e.target).attr('id');
            }
            else if (e.target.nodeName == 'IMG') {
                $(e.target).siblings().slideUp(100);
                action = $(e.target).parents('.doc-action').attr('id');
            }
            else if (e.target.nodeName == 'SPAN') {
                $(e.target).slideUp(100);
                action = $(e.target).parents('.doc-action').attr('id');
            }
            $('#'+action).off('mouseenter');
            setTimeout(() => { $('#'+action).on('mouseenter', expandAction); }, 200); // Para não acumular animações
        }

        // Renomeia o documento
        let currentName = $('#doc-name textarea').val();
        $('#rename').on('click',() => {
            $('#doc-name textarea').removeAttr('disabled').focus().select();
            $('#doc-name textarea').on('blur', (e) => {
                $('#doc-name').submit();
            });
        });
        $('#doc-name').on('submit', (e) => {
            e.preventDefault();
                if ($('#doc-name textarea').val() != '' && !$('#doc-name textarea').val().match(/^(\s+)$/)) {
                updateName(e, docId);
            }
            else {
                $('#doc-name textarea').val(currentName);
            }
        });
        $('#doc-name textarea').on('keydown', (e) => {
            if (e.key == 'Enter') {
                $('#doc-name textarea').off('blur');
                $('#doc-name').submit();
                $('#doc-name textarea').blur();
                return false;
            }
            return e.key != 'Enter';
        });

        // Duplica o documento
        $('#duplicate').on('click', () => { duplicateDoc(docId) });

        // Apaga o documento
        $('#remove').on('click', () => { removeDoc(docId) });

        $('.x').on('click', closeDetails);
        $('.showing-doc').fadeIn(200).css('display', 'flex');
    }

    /*************************************************************/
    /****************** Resgata documentos do BD *****************/
    /*************************************************************/

    function getDocs() {
        $.get('/my_docs/get', (data) => {
            docs = JSON.parse(data);
            appendDocs();
        });
    }

    /*************************************************************/
    /************ Salva o novo nome no banco via AJAX ************/
    /*************************************************************/

    function updateName(e, id) {
        e.preventDefault();
        if ($('#doc-name textarea').val() != $('#doc-name textarea').data('name')) {
            $.post('/my_docs/rename/'+id,
                {name: $('#doc-name textarea').val(), _token: $('input[name="_token"]').val()},
                function() {
                    getDocs();
                    $('#doc-name textarea').data('name', $('#doc-name textarea').val());
                }
            );
        }
        $('#doc-name textarea').attr('disabled', 'disabled');
        $('#doc-name textarea').off('blur');
    }

    /***************************************************************/
    /********************** Duplica documento **********************/
    /***************************************************************/

    function duplicateDoc(id) {
        $.get('/my_docs/duplicate/'+id, (data) => {
            getDocs();
            closeDetails();
        });
    }

    /*************************************************************/
    /********************** Apaga documento **********************/
    /*************************************************************/

    function removeDoc(id) {
        $.get('/my_docs/remove/'+id, (data) => {
            getDocs();
            closeDetails();
        });
    }

    /*************************************************************/
    /********* Fecha overlay dos detalhes e ações do doc *********/
    /*************************************************************/

    function closeDetails(){
        $('.showing-doc').fadeOut(200);
        setTimeout(() => { $('#doc-details').empty() }, 200);
    }    
    $('#doc-details').on('mouseleave', () => {
        $('.showing-doc').on('mousedown', closeDetails);
    });
    $('#doc-details').on('mouseenter', () => {
        $('.showing-doc').off('mousedown',closeDetails);
    });

});