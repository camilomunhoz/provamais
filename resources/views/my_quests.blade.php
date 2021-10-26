@extends('layouts.lobby')

@section('title', '| Minhas questões')
@section('css', '/css/search_and_filter.css')

{{-- Define a seção atual --}}
@section('current_1', '')
@section('current_2', 'current')
@section('current_3', '')
@section('current-detail_1', '')
@section('current-detail_2') <div id="current-detail"></div> @endsection
@section('current-detail_3', '')

{{-- Define o header da seção --}}
@section('header-img', '/img/icons/ico_question.svg')
@section('header-title', 'Minhas questões')
@section('search-placeholder', 'Procurar em "Minhas questões"')

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

{{-- Conteúdo da seção --}}
@section('lobby_content')

    <div id="content">
        
        {{-- Sidebar de filtros --}}
        <form id="filters" class="simple-box" @if($questions[0] == 'empty') style="user-select: none; pointer-events: none; filter: grayscale(100%); opacity: .6;" @endif> @csrf

            {{-- Header --}}
            <div id="filter-header">
                <div>
                    <img src="/img/icons/ico_filter.svg">
                    <span>Filtros</span>
                </div>
                <div>
                    <x-checkbox id="all-questions" name="all" checked="checked">Todas</x-checkbox>

                </div>
            </div>

            {{-- Filtros --}}
            <div id="filter-checkboxes">

                <span class="filter-section">Marcadores</span>
                <x-checkbox id="public-questions" name="public" checked="checked">Públicas</x-checkbox>
                <x-checkbox id="private-questions" name="private" checked="checked">Privadas</x-checkbox>
                <x-checkbox id="favorite-questions" name="favorite" checked="checked">Favoritas</x-checkbox>
                
                <span class="filter-section">Disciplinas</span>
                <div id="filter-subjects">
                    @if ($questions[0] == 'empty') &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nenhuma @endif
                </div>

                <span class="filter-section">Tipo de questão</span>
                <x-checkbox id="alternative" name="types[]" value="Objetiva" checked="checked">Objetiva</x-checkbox>
                <x-checkbox id="essay" name="types[]" value="Dissertativa" checked="checked">Dissertativa</x-checkbox>

            </div>

            {{-- Botão para aplicar os filtros --}}
            <button type="submit" id="filter-btn" class="no-style" title="Filtrar resultados">Aplicar filtros</button>

        </form>

        {{-- Define variável que será usada em /js/show_questions.js para acessar os detalhes da questão --}}
        <script> var questions = {!! json_encode($questions) !!}; </script>

        {{-- Resultados da pesquisa --}}
        <div id="results">
            @if ($questions[0] == 'empty')
                <span id="no-quests">Não há questões para exibir.</span>
                <div id="create-tip">
                    <span>Clique aqui para<br>cadastrar uma questão</span><br>
                    <img src="/img/icons/ico_curved_arrow.svg">
                </div>
            @endif
            
            <script src="/js/show_questions.js"></script>
        </div>

    </div>

    {{-- Botão de criar questão --}}
    <a href="/create_quest" id="btn-create" title="Cadastrar questão"><img src="/img/icons/ico_plus.svg" alt="Criar"></a>
    
    {{-- Overlay de detalhes que aparece ao clicar em uma questão --}}
    <div class="black-overlay showing-quest">
        <div id="actions" class="simple-box"></div>
        <div id="quest-details" class="simple-box">
            {{-- Aqui são inseridos os detalhes da questão via JS --}}
        </div>   
    </div>

@endsection