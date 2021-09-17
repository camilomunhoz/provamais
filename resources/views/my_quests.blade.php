@extends('layouts.lobby')

@section('title', '| Minhas questões')

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

{{-- Conteúdo da seção --}}
@section('lobby_content')

    <a href="/create_quest" id="btn-create" title="Cadastrar questão"><img src="/img/icons/ico_plus.svg" alt="Criar"></a>

@endsection