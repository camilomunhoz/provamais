@extends('layouts.section')

@section('title', '| Novo documento')
@section('css', '/css/create_doc.css')

{{-- URL para redirecionamento caso a ação seja cancelada --}}
@section('if-cancelled', '/my_docs')

{{-- Linkando o Quill e Katex --}}
@section('quill')
    <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
	<link href="//cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.css" integrity="sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn" crossorigin="anonymous">
    <script src="//cdn.quilljs.com/1.3.6/quill.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.js" integrity="sha384-pK1WpvzWVBQiP0/GjnvRxV4mOb0oxFuyRxJlk6vVw146n3egcN5C925NCP7a7BY8" crossorigin="anonymous"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/contrib/auto-render.min.js" integrity="sha384-vZTG03m+2yp6N6BNi5iM4rW4oIwk5DfcNdFfxkk9ZWpDriOkXX8voJBFrAO7MpVl" crossorigin="anonymous"
        onload="renderMathInElement(document.body);"></script>
@endsection

{{-- Define o título do header --}}
@section('section-title', 'Novo documento')

{{-- Adiciona um botão de cancelar no header --}}
@section('add-header-section')
    <div class="header-section cancel-action">
        <span>Cancelar</span>
        <img src="/img/icons/ico_plus.svg" alt="X">
    </div>
@endsection

{{-- Conteúdo da seção --}}
@section('section_content')
    <script type="text/javascript" src="/js/create_doc.js"></script>
    
    {{-- DOCUMENTO --}}
    <div id="doc">
        {{-- @csrf Token que será "movido" com JS pra dentro do form de salvamento --}}
        <div id="add-question-btn">Adicionar questões</div>
        <div id="questions"></div>
        <div id="teste"></div>
    </div>

    {{-- Overlay de adição de questões --}}
    <div class="black-overlay add-question-overlay">

        <div id="add-question-dialog" class="simple-box">

            {{-- Header --}}
            <div id="add-question-dialog-header">
                <div id="add-question-dialog-left-items">
                    <span id="add-question-header-title">Selecione as questões desejadas.</span>
                </div>
                <div id="add-question-dialog-right-items">
                    <img class="x" src="/img/icons/ico_plus.svg" alt="X" title="Fechar">
                </div>
            </div>

            {{-- Divisória --}} <div class="simple-line"></div>

            {{-- Conteúdo principal --}}
            <div id="add-question-dialog-content">

                {{-- Sidebar para filtragem --}}
                <div id="filters-sidebar">

                    {{-- Pesquisa por palavra-chave --}}
                    <div id="search-for-quests">
                        <div id="search-submit">
                            <img src="/img/icons/ico_search_box.svg" alt="Pesquisar" title="Pesquisar">
                        </div>
                        <input type="text" placeholder="Termo de busca" id="search-box" class="simple-box" name="search">
                    </div>

                    {{-- Filtros com checkboxes --}}
                    <form id="filters" class="simple-box"> @csrf

                        <div id="filter-header">
                            <div>
                                <img src="/img/icons/ico_filter.svg">
                                <span>Filtros</span>
                            </div>
                            <div>
                                <x-checkbox id="all" name="all">Todas</x-checkbox>
            
                            </div>
                        </div>
            
                        <div id="filter-checkboxes">
            
                            <span class="filter-section">Marcadores</span>
                            <x-checkbox id="all-questions" name="all_questions" checked="checked">De qualquer usuário</x-checkbox>
                            <x-checkbox id="my-questions" name="my_questions" checked="checked">Minhas questões públicas</x-checkbox>
                            <x-checkbox id="private-questions" name="private" checked="checked">Minhas questões privadas</x-checkbox>
                            <x-checkbox id="favorite-questions" name="favorite">Favoritas</x-checkbox>
                            
                            <span class="filter-section">Tipo de questão</span>
                            <x-checkbox id="alternative" name="types[]" value="Objetiva" checked="checked">Objetiva</x-checkbox>
                            <x-checkbox id="essay" name="types[]" value="Dissertativa" checked="checked">Dissertativa</x-checkbox>
            
                            <span class="filter-section">Disciplinas</span>
                            <div id="filter-subjects">
                                @foreach($subjects as $subject)
                                    <x-checkbox id="{{$subject->id}}" name="subjects[]" value="{{$subject->id}}">{{$subject->name}}</x-checkbox>
                                @endforeach
                            </div>
            
                        </div>
            
                        <button type="submit" id="filter-btn" class="no-style" title="Filtrar resultados">Aplicar filtros</button>
            
                    </form>
                </div>

                {{-- Resultados da pesquisa --}}
                <div id="results">
                    <span>&larr;&nbsp;&nbsp;&nbsp; Especifique a busca inserindo um termo de busca.</span><br><br><br>
                    <span>&larr;&nbsp;&nbsp;&nbsp; Escolha ao menos uma disciplina para começar.</span>
                </div>

            </div>

            {{-- Divisória --}} <div class="simple-line"></div>

            {{-- Footer --}}
            <form id="add-question-dialog-footer">
                <button type="button" id="insert-questions" class="save-btn confirmation-btn-hard">Inserir</button>
                <span id="selected-questions">Questões selecionadas: <b>0</b></span>
            </form>
        </div>   
    </div>
    
@endsection