<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;

class AuthController extends Controller
{
    public function register_user(StoreUserRequest $request){
        
        $user = new User;
        
        $user->name = $request->name;
        trim($user->name);                                      // Tira espaços no início e fim
        $user->name = preg_replace('/\s+/', ' ', $user->name);  // Tira espaços múltiplos
        $user->name = mb_strtolower($user->name, 'utf-8');      // Passa caracteres para lowercase
        $user->name = ucwords($user->name);                     // Capitaliza as primeiras letras
        
        $user->email = $request->email;

        $hashedPassword = Hash::make($request->password);       // "Criptografa" a senha com hash
        $user->password = $hashedPassword;

        $user->cpf = $request->cpf;

        $user->save();

        $credentials = [
            'email' => $request->email, 
            'password' => $request->password
        ];

        if(Auth::attempt($credentials)){
            $request->session()->regenerate();
            
            return redirect('/my_docs')->with('account_created','Conta criada.');
        }
    }

    public function login(Request $request){
        $credentials = [
            'email' => $request->email, 
            'password' => $request->password
        ];
        if(!filter_var($request->email, FILTER_VALIDATE_EMAIL)){
            return back()->with('login', 'current')->withErrors(['E-mail inválido.'])->withInput($request->except('password'));
        }
        elseif(User::where('email',$request->email)->exists() && !Auth::attempt($credentials)){
            return back()->with('login', 'current')->withErrors(['Senha incorreta.'])->withInput($request->except('password'));
        }
        elseif(!User::where('email',$request->email)->exists()){
            return back()->with('login', 'current')->withErrors(['E-mail não cadastrado.'])->withInput($request->except('password'));
        }
        if(Auth::attempt($credentials)){
            $request->session()->regenerate();
            
            return redirect('/my_docs');
        }
    }

    public function logout(){
        Auth::logout();
        return redirect('/');
    }
}
