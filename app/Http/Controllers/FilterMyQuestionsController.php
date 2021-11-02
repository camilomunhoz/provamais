<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\DB; 
use App\Models\User;
use App\Models\Question;

class FilterMyQuestionsController extends Controller
{
    public function filter(Request $request) {
        
        // Caso todos os filtros não estejam selecionados
        if (!$request->all){

            $user_id = Auth::user()->id;

            $sql = "SELECT * FROM questions WHERE user_id = $user_id";

            // Privacidade
            $privacy = [];
            if ($request->public) $privacy['public'] = $request->public;
            if ($request->private) $privacy['private'] = $request->private;

            if (count($privacy) == 2){
                $sql .= " AND (private = 0 OR private = 1)";
            }
            else if (array_key_exists('public', $privacy)){
                $sql .= " AND private = 0";
            }
            else if (array_key_exists('private', $privacy)){
                $sql .= " AND private = 1";
            }
            else {
                echo json_encode([]);
                die();
            }
            
            // Disciplinas
            if ($request->subjects) {
                $subjects = $request->subjects;

                foreach ($subjects as $key => $subject) {
                    if ($key == 0) {
                        $sql .= " AND (subject_id = $subject";
                    }
                    else {
                        $sql .= " OR subject_id = $subject";
                    }
                    if ($key == count($subjects)-1) {
                        $sql .= ")";
                    }
                }
            }
            else {
                echo json_encode([]);
                die();
            }

            // Tipos das questões
            if ($request->types) {
                $types = $request->types;

                if (count($types) == 2) {
                    $sql .= " AND (type LIKE 'Dissertativa' OR type LIKE 'Objetiva')";
                }
                else if (count($types) == 1) {
                    $sql .= " AND type LIKE '$types[0]'";
                }
            }
            else {
                echo json_encode([]);
                die();
            }

            // Caso tenha termo de busca
            if ($request->search) {
                $sql .= " AND (statement LIKE '%$request->search%' OR content LIKE '%$request->search%')";
            }

            // Resgatando as questões
            $questions = DB::select($sql);

            // Transformando o resultado em uma Collection para melhor manipulação
            $questions = Question::hydrate($questions);

            // Inserindo dados das chaves estrangeiras. Acesso direto por causa da relação.
            foreach ($questions as $q) {
                $q['subject_name'] = $q->subject->name;
                $q['options'] = $q->options;
                
                if ($q->user->name == Auth::user()->name) {
                    $q->owner = 'você mesmo';
                }
                else {
                    $username = explode(' ', $q->user->name);
                    $q->owner = $username[0];
                }

                if(!$q->user->profile_pic){
                    $q->user->profile_pic = 'user_pic_placeholder.png';
                }

                // Retirando dados sensíveis e deixando somente 'id' e 'profile_pic'
                unset($q->user['name']);
                unset($q->user['cpf']);
                unset($q->user['password']);
                unset($q->user['pix']);
                unset($q->user['email']);
                unset($q->user['description']);
                unset($q->user['created_at']);
                unset($q->user['updated_at']);
            }
        }

        // Caso todos os filtros estejam selecionados
        else if ($request->all){
            $questions = Auth::user()->questions;

            // Inserindo dados das chaves estrangeiras. Acesso direto por causa da relação.
            foreach ($questions as $q) {
                $q['subject_name'] = $q->subject->name;
                $q['options'] = $q->options;
                
                if ($q->user->name == Auth::user()->name) {
                    $q->owner = 'você mesmo';
                }
                else {
                    $username = explode(' ', $q->user->name);
                    $q->owner = $username[0];
                }

                if(!$q->user->profile_pic){
                    $q->user->profile_pic = 'user_pic_placeholder.png';
                }

                // Retirando dados sensíveis e deixando somente 'id' e 'profile_pic'
                unset($q->user['name']);
                unset($q->user['cpf']);
                unset($q->user['password']);
                unset($q->user['pix']);
                unset($q->user['email']);
                unset($q->user['description']);
                unset($q->user['created_at']);
                unset($q->user['updated_at']);
            }
        }

        echo json_encode($questions);
    }

    public function search(Request $request) {

        $user_id = Auth::user()->id;

        $sql = "SELECT * FROM questions WHERE user_id = $user_id AND (statement LIKE '%$request->search%' OR content LIKE '%$request->search%')";

        // Resgatando as questões
        $questions = DB::select($sql);
        
        // Transformando o resultado em uma Collection para melhor manipulação
        $questions = Question::hydrate($questions);

        // Inserindo dados das chaves estrangeiras. Acesso direto por causa da relação.
        foreach ($questions as $q) {
            $q['subject_name'] = $q->subject->name;
            
            if ($q->user->name == Auth::user()->name) {
                $q->owner = 'você mesmo';
            }
            else {
                $username = explode(' ', $q->user->name);
                $q->owner = $username[0];
            }
            
            if(!$q->user->profile_pic){
                $q->user->profile_pic = 'user_pic_placeholder.png';
            }
            
            // Retirando dados sensíveis e deixando somente 'id' e 'profile_pic'
            unset($q->user['name']);
            unset($q->user['cpf']);
            unset($q->user['password']);
            unset($q->user['pix']);
            unset($q->user['email']);
            unset($q->user['description']);
            unset($q->user['created_at']);
            unset($q->user['updated_at']);
        }

        echo json_encode($questions);
    }
}
