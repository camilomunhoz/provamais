@extends('layouts.main')
@section('title', '| Recuperação de senha')
{{-- @section('js', '/js/pdf.js') --}}
@section('css', '/css/reset_password.css')

@section('content')

    <div id="wrapper">

        <form action="/password/reset/email" method="POST">
            @csrf
            <a href="/" id="logo"><img src="/img/logo.svg" alt="ProvA+"></a>

            <h1>Insira seu e-mail cadastrado</h1>
            <input class="simple-box" type="text" name="email" placeholder="E-mail" @if(session('status')) value="{{old('email')}}" @endif>
            @if(!session('status') && !$errors->any())
                <span class="info">Um link para redefinição de senha será enviado ao e-mail informado.</span>
            @else
                @if(session('status'))
                    <span class="info status">{{session('status')}}</span>
                @else
                    @foreach($errors->all() as $error)
                        <span class="info status">{{$error}}</span>
                    @endforeach
                @endif
            @endif
            <input type="submit" value="Recuperar acesso" class="save-btn confirmation-btn-hard">
        </form>

        <script>
            $('input[type=text]').on('input', (e) => {
                if (!$(e.currentTarget).val() || $(e.currentTarget).val().match(/^(\s+)$/)) {
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
                    })
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