@extends('layouts.lobby')

@section('title', '| Procurar questões')

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



@endsection