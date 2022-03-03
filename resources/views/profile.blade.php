@extends('layouts.section')

@section('title', '| '.$user->name)
@section('css', '/css/profile.css')

{{-- Conteúdo da seção --}}
@section('section_content')

    <div id="profile">
        <span id="profile-name">{{$user->name}}</span>
        <div id="wrp-profile-pic">
            <img id="profile-pic" src="/img/users_profile_pics/{{($user->profile_pic)}}" alt="Foto de perfil">
        </div>
        <div class="simple-line"></div>
        @if ($user->description)
            <span class="profile-data" id="profile-desc">{{$user->description}}</span>
        @endif
        @if ($user->pix)
            <span class="profile-data"><b>Chave Pix:</b> {{$user->pix}}</span>
        @endif
        <span class="profile-data">Questões cadastradas:<b> {{$user->n_quests}}</b></span>
        
        <div class="breathe-space"></div>
    </div>
    
@endsection