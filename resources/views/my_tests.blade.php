@extends('layouts.lobby')

@section('title', '| Minhas avaliações')

{{-- Define a seção atual --}}
@section('current_1', 'current')
@section('current_2', '')
@section('current_3', '')
@section('current-detail_1') <div id="current-detail"></div> @endsection
@section('current-detail_2', '')
@section('current-detail_3', '')

{{-- Define o header da seção --}}
@section('header-img', '/img/icons/ico_test.svg')
@section('header-title', 'Minhas avaliações')
@section('search-placeholder', 'Procurar em "Minhas avaliações"')

{{-- Carrega banner se a conta foi recém criada --}}
@if(session('account_created'))
@section('banner')
    <div class="banner"><span><strong>Seja bem-vindo(a), {{$user->name}}! </strong>&nbsp;Sua conta foi criada com sucesso.</span><span class="btn-close-banner hello">OK!</span></div>
    <div class="help-tip simple-box">
        <div class="arrow">&RightArrow;</div>
        <span class="confirmation-header"><b>Consulte a guia de ajuda.</b></span>
        <span class="confirmation-details">Nela você encontra tutoriais e dicas de como utilizar o Prova+.</span>
        <span class="confirmation-btn-hard close-help-tip">OK</span>
    </div>
@endsection
@endif

{{-- Carrega banner se o perfil foi recém editado --}}
@if(session('profile_edited'))
@section('banner')
    <div class="banner"><span><strong>Seu perfil foi editado com sucesso.</strong></span><span class="btn-close-banner">OK!</span></div>
@endsection
@endif

{{-- Conteúdo da seção --}}
@section('lobby_content')

    <a href="/create_test" id="btn-create" title="Criar avaliação"><img src="/img/icons/ico_plus.svg" alt="Criar"></a>

@endsection