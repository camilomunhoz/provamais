<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Subject;
use App\Models\Question;

class ViewController extends Controller
{
    /*********** FUNÇÕES PARA EXIBIÇÃO DAS VIEWS ***********/

    // Index (página inicial)
    public function index(){
        return view('welcome');
    }
    
    // View "Meus documentos"
    public function my_docs(){
        if(Auth::check()){
            $user = Auth::user();
            $username = explode(' ', $user->name);
            $user->name = $username[0];
            if(!$user->profile_pic){
                $user->profile_pic = 'user_pic_placeholder.png';
            }
            return view('my_docs', ['user' => $user]);
        }
        return redirect('/');
    }

    // View "Criar documento"
    public function create_doc(){
        if(Auth::check()){
            return view('create_doc');
        }
        return redirect('/');
    }

    // View "Minhas questões"
    public function my_quests(){
        if(Auth::check()){
            $user = Auth::user();
            $username = explode(' ', $user->name);
            $user->name = $username[0];
            if(!$user->profile_pic){
                $user->profile_pic = 'user_pic_placeholder.png';
            }

            $questions = $user->questions;
            
            foreach ($questions as $q){
                $q['subject_name'] = $q->subject->name;

                $owner = explode(' ', $q->user->name);
                $q['owner'] = $owner[0];
            }

            return view('my_quests', ['user' => $user, 'questions' => $questions]);
        }
        return redirect('/');
    }

    // View "Cadastrar questão"
    public function create_quest(){
        if(Auth::check()){
            $subjects = Subject::all();
            return view('create_quest', ['subjects' => $subjects]);
        }
        return redirect('/');
    }

    // View "Procurar questões"
    public function search_quests(){
        if(Auth::check()){
            $user = Auth::user();
            $username = explode(' ', $user->name);
            $user->name = $username[0];
            if(!$user->profile_pic){
                $user->profile_pic = 'user_pic_placeholder.png';
            }
            return view('search_quests', ['user' => $user]);
        }
        return redirect('/');
    }

    // View "Editar perfil"
    public function my_profile(){
        if(Auth::check()){
            $user = Auth::user();
            if(!$user->profile_pic){
                $user->profile_pic = 'user_pic_placeholder.png';
            }
            return view('my_profile', ['user' => $user]);
        }
        return redirect('/');
    }

    // View "Ajuda e Tutoriais"
    public function help(){
        return view('help');
    }

    // // Utility para voltar
    // public function goback(){
    //     return back();
    // }
}
