@extends('layouts.main')
@section('title', '| Recuperação de senha')
{{-- @section('js', '/js/pdf.js') --}}
@section('css', '/css/reset_password.css')

@section('content')

    <div id="wrapper">

        <form id="redefinition-dialog" action="/password/reset/update" method="POST">
            @csrf
            <a href="/" id="logo"><img src="/img/logo.svg" alt="ProvA+"></a>

            <h2>Crie uma nova senha</h2>
            <input class="simple-box" type="hidden" name="token" value="{{$token}}">
            <input class="simple-box" type="text" name="email" placeholder="E-mail" value="{{$_GET['email']}}">
            <input class="simple-box" type="password" name="password" placeholder="Nova senha">
            <input class="simple-box" type="password" name="password_confirmation" placeholder="Confirme a senha">
            <div id="alerts">
                @if($errors->any())
                    @foreach ($errors->all() as $error)
                        <span class="error-feedback">{{$error}}</span>
                    @endforeach
                @endif
                <span class="error-pswd-feedback">A senha deve ter tamanho mínimo de 8 caracteres<br>e conter uma letra maíuscula e um número.</span>
            </div>
            <input type="submit" value="Recuperar acesso" class="save-btn confirmation-btn-hard">
        </form>

        <script>
            $('input[type=password]').on('input', () => {
                if (!$('input[name=password').val() || !$('input[name=password_confirmation').val()) {
                    $('.save-btn').css({
                        userSelect: 'none',
                        pointerEvents: 'none',
                        filter: 'grayscale(100%)',
                        opacity: '.6'
                    });
                }
                else {
                    $('.save-btn').css({
                        userSelect: 'all',
                        pointerEvents: 'all',
                        filter: 'none',
                        opacity: '1'
                    });
                }
            });
            $('form').on('submit', () => {
                $('body').css('cursor', 'progress')
                $('.save-btn').css({
                    userSelect: 'none',
                    pointerEvents: 'none',
                    opacity: '.6',
                });
            });
        </script>
    </div>

@endsection