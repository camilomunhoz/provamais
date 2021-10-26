@extends('layouts.section')

@section('title', '| Meu perfil')
@section('css', '/css/my_profile.css')

{{-- URL para redirecionamento caso a ação seja cancelada --}}
@section('if-cancelled', '/my_docs')

{{-- Define título do header --}}
@section('section-title', 'Meu perfil')

{{-- Adiciona um botão de cancelar no header --}}
@section('add-header-section')
    <div class="header-section cancel-action">
        <span>Cancelar</span>
        <img src="/img/icons/ico_plus.svg" alt="X">
    </div>
@endsection

{{-- Conteúdo da seção --}}
@section('section_content')
    <script type="text/javascript" src="/js/my_profile.js"></script>

    <form id="my-profile" action="/update_profile" method="POST" enctype="multipart/form-data">
        @csrf
        <div id="my-profile-sidebar">
            <span id="my-profile-name">{{$user->name}}</span>
            <div id="wrp-my-profile-pic">
                <img id="my-profile-pic" src="/img/users_profile_pics/{{($user->profile_pic)}}" alt="Foto de perfil">
                @if($user->profile_pic!='user_pic_placeholder.png')
                    <input type="checkbox" id="reset-my-profile-pic" name="resetpic" title="Remover foto de perfil" value="0">
                    <label for="reset-my-profile-pic"><img src="/img/icons/ico_plus.svg" alt="X"></label>
                @endif
            </div>
            <label for="my-profile-alterpic" id="alterpic-label">Alterar foto de perfil</label>
            <input type="file" accept=".jpg, .jpeg, .png" name="profilepic" id="my-profile-alterpic">
            <span class="my-profile-data simple-box">CPF nº {{$user->cpf}}</span>
            <span class="my-profile-data simple-box">{{$user->email}}</span>
            <span class="my-profile-data simple-box">Questões cadastradas: <b>{{$user->n_quests}}</b></span>
        </div>
        <div id="my-profile-extras">
            <label>
                Descrição:<br>
                <textarea name="desc" placeholder="Dê mais detalhes sobre você ao público" class="my-profile-desc simple-box">{{$user->description}}</textarea>
            </label>
            <label>
                Chave Pix:<br>
                <input type="text" name="pix" placeholder="Chave Pix" class="my-profile-pix simple-box" value="{{$user->pix}}">
            </label>
            <button type="submit" class="confirmation-btn-hard save-btn">SALVAR</button>
        </div>
    </form>
    <div class="breathe-space"></div>
@endsection