@extends('layouts.lobby')

@section('title', '| Procurar questões')
@section('css', '/css/search_and_filter.css')

{{-- Define o a seção atual --}}
@section('current_1', '')
@section('current_2', '')
@section('current_3', 'current')
@section('current-detail_1', '')
@section('current-detail_2', '')
@section('current-detail_3') <div id="current-detail"></div> @endsection

{{-- Define o header da seção --}}
@section('header-img', '/img/icons/ico_searching.svg')
@section('header-title', 'Procurar questões')
@section('search-placeholder', 'Procurar questões da comunidade')

{{-- Conteúdo da seção --}}
@section('lobby_content')

<div id="content">
        
    {{-- Sidebar de filtros --}}
    <div id="filters" class="simple-box">

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

            <span class="filter-section">Disciplinas</span>
            @for ($i = 0; $i < 16; $i++)
                <x-checkbox :id="$i" name="blah">Filtro</x-checkbox>
            @endfor

            <span class="filter-section">Tipo de questão</span>
            <x-checkbox id="alternative" name="objetiva">Objetiva</x-checkbox>
            <x-checkbox id="essay" name="dissertativa">Dissertativa</x-checkbox>

        </div>

        {{-- Botão para aplicar os filtros --}}
        <div id="filter-btn" title="Filtrar resultados">Aplicar filtros</div>

    </div>

    <div id="results">
        @for ($i = 0; $i < 15; $i++)
            <x-question-card :id="$i" subject="Disciplina" content="Conteúdo" type="Tipo da questão">Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere repudiandae quia laudantium eius porro voluptate, qui reprehenderit maxime! Earum, ex.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, id.</x-question-card>
        @endfor
    </div>

</div>

@endsection